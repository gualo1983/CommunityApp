// File: hooks/useMessagesLogic.ts

import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { useEffect, useRef, useState } from 'react';
import { useSupabase } from '../contexts/SupabaseProvider';
import { Conversation, Message } from '../interfaces/message';

// Definizione di un'interfaccia per la riga del database Supabase
interface SupabaseMessageRow {
  id: string;
  proprietario_id: string;
  destinatario_id: string;
  titolo: string;
  corpo: {
    dettagli: string;
  };
  stato_lettura: boolean;
  data: string;
}

// Interfaccia per la riga del database degli profili utente, ora basata sulla tabella 'utenti'
interface UserProfileRow {
  id: string;
  nome: string;
  cognome: string;
}

// Funzione per raggruppare i messaggi in conversazioni
const groupMessages = (messages: SupabaseMessageRow[], userId: string | null, usersMap: Map<string, string>): Conversation[] => {
  const conversationsMap = new Map<string, Conversation>();

  messages.forEach(msg => {
    // Creazione di una chiave unica per la conversazione basata sui partecipanti e sul titolo della richiesta
    const participants = [msg.proprietario_id, msg.destinatario_id].sort().join('-');
    const conversationId = `${participants}-${msg.titolo}`;

    // Identifica l'ID dell'altro partecipante
    const otherParticipantId = msg.proprietario_id === userId ? msg.destinatario_id : msg.proprietario_id;

    if (!conversationsMap.has(conversationId)) {
      conversationsMap.set(conversationId, {
        id: conversationId,
        requestTitle: msg.titolo,
        messages: [],
        isUnread: false, // Verrà aggiornato in un secondo momento
        // Aggiungi il nome dell'altro partecipante alla conversazione
        otherParticipantName: usersMap.get(otherParticipantId) || otherParticipantId,
      });
    }

    const conversation = conversationsMap.get(conversationId)!;

    // Mappa la riga del database al nostro oggetto Message
    const message: Message = {
      id: msg.id,
      senderId: msg.proprietario_id, // Ora l'ID del mittente è salvato
      // Utilizza la mappa per ottenere il nome del mittente invece dell'ID
      senderName: usersMap.get(msg.proprietario_id) || msg.proprietario_id,
      content: msg.corpo.dettagli,
      timestamp: new Date(msg.data),
      isRead: msg.stato_lettura,
      isMe: msg.proprietario_id === userId,
    };

    conversation.messages.push(message);

    // Aggiorna lo stato di non letto per la conversazione
    if (!message.isRead && !message.isMe) {
        conversation.isUnread = true;
    }
  });

  // Ordina i messaggi all'interno di ogni conversazione per timestamp
  conversationsMap.forEach(conv => {
    conv.messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  });

  return Array.from(conversationsMap.values());
};

export const useMessagesLogic = () => {
  const { supabase } = useSupabase();
  const [userId, setUserId] = useState<string | null>(null);
  const [usersMap, setUsersMap] = useState<Map<string, string>>(new Map());
  
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Usiamo i ref per mantenere i valori più recenti degli stati nei listener in tempo reale
  const conversationsRef = useRef(conversations);
  const usersMapRef = useRef(usersMap);

  // Manteniamo i ref sincronizzati con gli stati
  useEffect(() => {
    conversationsRef.current = conversations;
    console.log('useEffect: Lo stato delle conversazioni è stato aggiornato.');
  }, [conversations]);

  useEffect(() => {
    usersMapRef.current = usersMap;
  }, [usersMap]);

  useEffect(() => {
    const checkUser = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setUserId(session?.user?.id || null);
    };

    checkUser();
  }, [supabase]);

  useEffect(() => {
    if (!supabase || !userId) {
      setIsLoading(false);
      return;
    }

    let subscription: RealtimeChannel | null = null;
    
    // Funzione per caricare i dati iniziali (messaggi e profili utente)
    const fetchInitialData = async () => {
      console.log('fetchInitialData: Avvio il caricamento dei dati iniziali...');
      setIsLoading(true);
      
      const { data: messagesData } = await supabase
        .from('messaggi')
        .select('*')
        .or(`proprietario_id.eq.${userId},destinatario_id.eq.${userId}`);
      
      const { data: profilesData } = await supabase.from('utenti').select('id, nome, cognome').returns<UserProfileRow[]>();
      
      // Creazione di una mappa utente locale prima di aggiornare lo stato
      let localUsersMap = new Map<string, string>();
      if (profilesData) {
        profilesData.forEach(profile => {
          localUsersMap.set(profile.id, `${profile.nome} ${profile.cognome}`);
        });
      }
      
      if (messagesData) {
          setConversations(groupMessages(messagesData, userId, localUsersMap));
      }
      
      setUsersMap(localUsersMap);
      setIsLoading(false);
      console.log('fetchInitialData: Caricamento dati iniziali completato.');
    };
    
    const setupRealtime = () => {
        console.log('setupRealtime: Iscrizione al canale "public:messaggi"...');
        subscription = supabase
          .channel('public:messaggi')
          // Listener per nuovi messaggi (INSERT)
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messaggi' }, (payload: RealtimePostgresChangesPayload<SupabaseMessageRow>) => {
            const newMsg = payload.new as SupabaseMessageRow;
            console.log('RealtimeDB: Messaggio INSERT ricevuto.', newMsg);
            // Aggiungiamo il nuovo messaggio solo se riguarda l'utente corrente
            if (newMsg.proprietario_id === userId || newMsg.destinatario_id === userId) {
              setConversations(prevConversations => {
                const updatedConversations = prevConversations.map(conv => {
                  const participants = [newMsg.proprietario_id, newMsg.destinatario_id].sort().join('-');
                  const conversationId = `${participants}-${newMsg.titolo}`;
                  
                  if (conv.id === conversationId) {
                    const newMessage: Message = {
                      id: newMsg.id,
                      senderId: newMsg.proprietario_id,
                      senderName: usersMapRef.current.get(newMsg.proprietario_id) || newMsg.proprietario_id,
                      content: newMsg.corpo.dettagli,
                      timestamp: new Date(newMsg.data),
                      isRead: newMsg.stato_lettura,
                      isMe: newMsg.proprietario_id === userId,
                    };
                    return {
                      ...conv,
                      messages: [...conv.messages, newMessage],
                      isUnread: newMsg.proprietario_id !== userId,
                    };
                  }
                  return conv;
                });
  
                // Se è una conversazione totalmente nuova, la creiamo e la aggiungiamo.
                const participants = [newMsg.proprietario_id, newMsg.destinatario_id].sort().join('-');
                const conversationId = `${participants}-${newMsg.titolo}`;
                const isNewConversation = !prevConversations.some(conv => conv.id === conversationId);
  
                if (isNewConversation) {
                  const otherParticipantId = newMsg.proprietario_id === userId ? newMsg.destinatario_id : newMsg.proprietario_id;
                  const newConversation: Conversation = {
                    id: conversationId,
                    requestTitle: newMsg.titolo,
                    messages: [{
                      id: newMsg.id,
                      senderId: newMsg.proprietario_id,
                      senderName: usersMapRef.current.get(newMsg.proprietario_id) || newMsg.proprietario_id,
                      content: newMsg.corpo.dettagli,
                      timestamp: new Date(newMsg.data),
                      isRead: newMsg.stato_lettura,
                      isMe: newMsg.proprietario_id === userId,
                    }],
                    isUnread: newMsg.proprietario_id !== userId,
                    otherParticipantName: usersMapRef.current.get(otherParticipantId) || otherParticipantId,
                  };
                  return [...prevConversations, newConversation];
                }
  
                return [...updatedConversations]; // Forza il re-rendering
              });
            }
          })
          // Listener per le modifiche (UPDATE), in particolare lo stato di lettura
          .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'messaggi' }, (payload: RealtimePostgresChangesPayload<SupabaseMessageRow>) => {
            const updatedMsg = payload.new as SupabaseMessageRow;
            console.log('RealtimeDB: Messaggio UPDATE ricevuto.', updatedMsg);

            // Aggiorniamo solo lo stato di lettura del messaggio
            setConversations(prevConversations => {
              const updatedConversations = prevConversations.map(conv => {
                const updatedMessages = conv.messages.map(msg => {
                  if (msg.id === updatedMsg.id) {
                    return { ...msg, isRead: updatedMsg.stato_lettura };
                  }
                  return msg;
                });

                // Controlla se ci sono ancora messaggi non letti nella conversazione per aggiornare il pallino
                const hasUnread = updatedMessages.some(msg => !msg.isRead && msg.senderId !== userId);
                
                return { ...conv, messages: updatedMessages, isUnread: hasUnread };
              });
              return [...updatedConversations]; // Forza il re-rendering
            });
            // Aggiorna anche la conversazione selezionata se è aperta
            setSelectedConversation(prev => {
                if (prev) {
                    const updatedMessages = prev.messages.map(msg => {
                        if (msg.id === updatedMsg.id) {
                          return { ...msg, isRead: updatedMsg.stato_lettura };
                        }
                        return msg;
                    });
                    const hasUnread = updatedMessages.some(msg => !msg.isRead && msg.senderId !== userId);
                    return { ...prev, messages: updatedMessages, isUnread: hasUnread };
                }
                return prev;
            });
          })
          .subscribe();
    };
    
    fetchInitialData();
    setupRealtime();

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, [supabase, userId]);

  const openConversation = (conversation: Conversation) => {
    console.log('openConversation: Apertura conversazione.', conversation);
    // Aggiorna lo stato di "letto" nel database quando si apre la conversazione
    const unreadMessageIds = conversation.messages
      .filter(msg => !msg.isRead && !msg.isMe)
      .map(msg => msg.id);

    if (unreadMessageIds.length > 0) {
      // Aggiorna lo stato locale immediatamente per rimuovere il pallino
      setConversations(prevConversations => {
          const updated = prevConversations.map(conv => 
              conv.id === conversation.id ? { ...conv, isUnread: false } : conv
          );
          return [...updated]; // Forza il re-rendering
      });

      console.log('openConversation: Aggiorno lo stato di lettura nel DB per i messaggi:', unreadMessageIds);
      supabase
        .from('messaggi')
        .update({ stato_lettura: true })
        .in('id', unreadMessageIds)
        .then(({ error }) => {
          if (error) console.error('Errore nell\'aggiornamento dello stato di lettura:', error);
          else console.log('openConversation: Stato di lettura aggiornato con successo nel DB.');
        });
    }

    setSelectedConversation(conversation);
    setModalVisible(true);
  };

  const closeConversationModal = () => {
    setModalVisible(false);
    setSelectedConversation(null);
  };

  const handleReply = async (messageContent: string) => {
    if (selectedConversation && userId) {
      const recipientId = selectedConversation.messages.find(msg => !msg.isMe)?.senderId;
      if (!recipientId) return;

      const newDbMessage = {
        proprietario_id: userId,
        destinatario_id: recipientId,
        titolo: selectedConversation.requestTitle,
        corpo: { dettagli: messageContent },
        stato_lettura: false,
        data: new Date().toISOString(),
      };
      
      console.log('handleReply: Avvio l\'invio del messaggio...');
      try {
        const { data, error } = await supabase.from('messaggi').insert([newDbMessage]).select();
        if (error) {
          console.error('Errore nell\'invio del messaggio:', error);
        } else {
          console.log('handleReply: Messaggio inviato con successo:', data);
          
          setSelectedConversation(prev => {
            if (prev) {
                const newMessage: Message = {
                    id: (data && data.length > 0) ? data[0].id : 'temp-id',
                    senderId: userId,
                    senderName: usersMap.get(userId) || userId,
                    content: messageContent,
                    timestamp: new Date(),
                    isRead: false,
                    isMe: true,
                };
                return {
                    ...prev,
                    messages: [...prev.messages, newMessage]
                };
            }
            return prev;
          });
        }
      } catch (e) {
        console.error('Errore durante l\'inserimento del messaggio:', e);
      }
    }
  };

  const sortedConversations = [...conversations].sort((a, b) => {
    const lastMessageA = a.messages[a.messages.length - 1];
    const lastMessageB = b.messages[b.messages.length - 1];
    if (!lastMessageA || !lastMessageB) return 0;
    return lastMessageB.timestamp.getTime() - lastMessageA.timestamp.getTime();
  });

  return {
    sortedConversations,
    modalVisible,
    selectedConversation,
    openConversation,
    closeConversationModal,
    handleReply,
    isLoading,
  };
};





//collegamento al db e mesaggi in real time o quasi 
/*
// File: hooks/useMessagesLogic.ts

import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { useEffect, useRef, useState } from 'react';
import { useSupabase } from '../contexts/SupabaseProvider';
import { Conversation, Message } from '../interfaces/message';

// Definizione di un'interfaccia per la riga del database Supabase
interface SupabaseMessageRow {
  id: string;
  proprietario_id: string;
  destinatario_id: string;
  titolo: string;
  corpo: {
    dettagli: string;
  };
  stato_lettura: boolean;
  data: string;
}

// Interfaccia per la riga del database degli profili utente, ora basata sulla tabella 'utenti'
interface UserProfileRow {
  id: string;
  nome: string;
  cognome: string;
}

// NOTE: Assicurati che l'interfaccia 'Conversation' in '../interfaces/message.ts'
// contenga la seguente proprietà:
// otherParticipantName: string;

// Funzione per raggruppare i messaggi in conversazioni
const groupMessages = (messages: SupabaseMessageRow[], userId: string | null, usersMap: Map<string, string>): Conversation[] => {
  const conversationsMap = new Map<string, Conversation>();

  messages.forEach(msg => {
    // === DEBUG CONSOLE LOG ===
    const senderName = usersMap.get(msg.proprietario_id) || msg.proprietario_id;
    const recipientName = usersMap.get(msg.destinatario_id) || msg.destinatario_id;

    console.log(`Messaggio inviato da: "${senderName}" - id ${msg.proprietario_id}. Messaggio ricevuto da: "${recipientName}" - id ${msg.destinatario_id}`);
    // ========================

    // Creazione di una chiave unica per la conversazione basata sui partecipanti e sul titolo della richiesta
    const participants = [msg.proprietario_id, msg.destinatario_id].sort().join('-');
    const conversationId = `${participants}-${msg.titolo}`;

    // Identifica l'ID dell'altro partecipante
    const otherParticipantId = msg.proprietario_id === userId ? msg.destinatario_id : msg.proprietario_id;

    if (!conversationsMap.has(conversationId)) {
      conversationsMap.set(conversationId, {
        id: conversationId,
        requestTitle: msg.titolo,
        messages: [],
        isUnread: false, // Verrà aggiornato in un secondo momento
        // Aggiungi il nome dell'altro partecipante alla conversazione
        otherParticipantName: usersMap.get(otherParticipantId) || otherParticipantId,
      });
    }

    const conversation = conversationsMap.get(conversationId)!;

    // Mappa la riga del database al nostro oggetto Message
    const message: Message = {
      id: msg.id,
      senderId: msg.proprietario_id, // Ora l'ID del mittente è salvato
      // Utilizza la mappa per ottenere il nome del mittente invece dell'ID
      senderName: usersMap.get(msg.proprietario_id) || msg.proprietario_id,
      content: msg.corpo.dettagli,
      timestamp: new Date(msg.data),
      isRead: msg.stato_lettura,
      isMe: msg.proprietario_id === userId,
    };

    conversation.messages.push(message);

    // Aggiorna lo stato di non letto per la conversazione
    if (!message.isRead && !message.isMe) {
        conversation.isUnread = true;
    }
  });

  // Ordina i messaggi all'interno di ogni conversazione per timestamp
  conversationsMap.forEach(conv => {
    conv.messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  });

  return Array.from(conversationsMap.values());
};

export const useMessagesLogic = () => {
  const { supabase } = useSupabase();
  const [userId, setUserId] = useState<string | null>(null);
  const [usersMap, setUsersMap] = useState<Map<string, string>>(new Map());
  
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Usiamo i ref per mantenere i valori più recenti degli stati nei listener in tempo reale
  const conversationsRef = useRef(conversations);
  const usersMapRef = useRef(usersMap);

  // Manteniamo i ref sincronizzati con gli stati
  useEffect(() => {
    conversationsRef.current = conversations;
  }, [conversations]);

  useEffect(() => {
    usersMapRef.current = usersMap;
  }, [usersMap]);

  useEffect(() => {
    const checkUser = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setUserId(session?.user?.id || null);
    };

    checkUser();
  }, [supabase]);

  useEffect(() => {
    if (!supabase || !userId) {
      setIsLoading(false);
      return;
    }

    let subscription: RealtimeChannel | null = null;
    
    // Funzione per caricare i dati iniziali (messaggi e profili utente)
    const fetchInitialData = async () => {
      setIsLoading(true);
      
      // CORREZIONE: Filtra i messaggi per includere solo quelli in cui l'utente loggato è il mittente o il destinatario
      const { data: messagesData } = await supabase
        .from('messaggi')
        .select('*')
        .or(`proprietario_id.eq.${userId},destinatario_id.eq.${userId}`);
      
      const { data: profilesData } = await supabase.from('utenti').select('id, nome, cognome').returns<UserProfileRow[]>();
      
      // Creazione di una mappa utente locale prima di aggiornare lo stato
      let localUsersMap = new Map<string, string>();
      if (profilesData) {
        profilesData.forEach(profile => {
          localUsersMap.set(profile.id, `${profile.nome} ${profile.cognome}`);
        });
      }
      
      if (messagesData) {
          // Utilizza la mappa locale, che è già aggiornata, per raggruppare i messaggi
          setConversations(groupMessages(messagesData, userId, localUsersMap));
      }
      
      // Ora aggiorna lo stato con la mappa dei profili completa
      setUsersMap(localUsersMap);
      setIsLoading(false);
    };
    
    const setupRealtime = () => {
        // Listener in tempo reale per le modifiche al database
        subscription = supabase
          .channel('public:messaggi')
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messaggi' }, (payload: RealtimePostgresChangesPayload<SupabaseMessageRow>) => {
            const newMsg = payload.new as SupabaseMessageRow;

            // Non ricarichiamo tutti i dati, aggiorniamo solo lo stato esistente
            setConversations(prevConversations => {
              // Creiamo una copia della conversazione per evitare mutazioni dirette
              const updatedConversations = prevConversations.map(conv => {
                const participants = [newMsg.proprietario_id, newMsg.destinatario_id].sort().join('-');
                const conversationId = `${participants}-${newMsg.titolo}`;
                
                if (conv.id === conversationId) {
                  const newMessage: Message = {
                    id: newMsg.id,
                    senderId: newMsg.proprietario_id,
                    senderName: usersMapRef.current.get(newMsg.proprietario_id) || newMsg.proprietario_id,
                    content: newMsg.corpo.dettagli,
                    timestamp: new Date(newMsg.data),
                    isRead: newMsg.stato_lettura,
                    isMe: newMsg.proprietario_id === userId,
                  };
                  return {
                    ...conv,
                    messages: [...conv.messages, newMessage],
                    isUnread: newMsg.proprietario_id !== userId,
                  };
                }
                return conv;
              });

              // Se è una nuova conversazione, la aggiungiamo
              const participants = [newMsg.proprietario_id, newMsg.destinatario_id].sort().join('-');
              const conversationId = `${participants}-${newMsg.titolo}`;
              const isNewConversation = !prevConversations.some(conv => conv.id === conversationId);

              if (isNewConversation) {
                // Se è una nuova conversazione, raggruppiamo di nuovo tutti i messaggi per aggiungerla
                fetchInitialData();
                return prevConversations;
              }

              return updatedConversations;
            });
          })
          .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'messaggi' }, (payload: RealtimePostgresChangesPayload<SupabaseMessageRow>) => {
            const updatedMsg = payload.new as SupabaseMessageRow;

            // Aggiorniamo solo lo stato di lettura del messaggio
            setConversations(prevConversations => {
              return prevConversations.map(conv => {
                const updatedMessages = conv.messages.map(msg => {
                  if (msg.id === updatedMsg.id) {
                    return { ...msg, isRead: updatedMsg.stato_lettura };
                  }
                  return msg;
                });
                return { ...conv, messages: updatedMessages };
              });
            });
          })
          .subscribe();
    };
    
    fetchInitialData();
    setupRealtime();

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, [supabase, userId]);

  const openConversation = (conversation: Conversation) => {
    // Aggiorna lo stato di "letto" nel database quando si apre la conversazione
    const unreadMessageIds = conversation.messages
      .filter(msg => !msg.isRead && !msg.isMe)
      .map(msg => msg.id);

    if (unreadMessageIds.length > 0) {
      supabase
        .from('messaggi')
        .update({ stato_lettura: true })
        .in('id', unreadMessageIds)
        .then(({ error }) => {
          if (error) console.error('Errore nell\'aggiornamento dello stato di lettura:', error);
        });
    }

    setSelectedConversation(conversation);
    setModalVisible(true);
  };

  const closeConversationModal = () => {
    setModalVisible(false);
    setSelectedConversation(null);
  };

  const handleReply = async (messageContent: string) => {
    if (selectedConversation && userId) {
      // Correzione: Cerca l'ID del destinatario, non il nome, utilizzando la nuova proprietà senderId
      const recipientId = selectedConversation.messages.find(msg => !msg.isMe)?.senderId;
      if (!recipientId) return;

      const newDbMessage = {
        proprietario_id: userId,
        destinatario_id: recipientId,
        titolo: selectedConversation.requestTitle,
        corpo: { dettagli: messageContent },
        stato_lettura: false,
        data: new Date().toISOString(),
      };

      try {
        // Inserimento del nuovo messaggio nel database
        const { data, error } = await supabase.from('messaggi').insert([newDbMessage]).select();
        if (error) {
          console.error('Errore nell\'invio del messaggio:', error);
        } else {
          console.log('Messaggio inviato con successo:', data);
          
          // Aggiorna immediatamente lo stato locale per visualizzare il messaggio
          setSelectedConversation(prev => {
            if (prev) {
                const newMessage: Message = {
                    id: (data && data.length > 0) ? data[0].id : 'temp-id', // Usa l'ID del messaggio appena creato se disponibile
                    senderId: userId, // Popolato
                    senderName: usersMap.get(userId) || userId,
                    content: messageContent,
                    timestamp: new Date(),
                    isRead: false,
                    isMe: true,
                };
                return {
                    ...prev,
                    messages: [...prev.messages, newMessage]
                };
            }
            return prev;
          });
        }
      } catch (e) {
        console.error('Errore durante l\'inserimento del messaggio:', e);
      }
    }
  };

  const sortedConversations = [...conversations].sort((a, b) => {
    const lastMessageA = a.messages[a.messages.length - 1];
    const lastMessageB = b.messages[b.messages.length - 1];
    if (!lastMessageA || !lastMessageB) return 0;
    return lastMessageB.timestamp.getTime() - lastMessageA.timestamp.getTime();
  });

  return {
    sortedConversations,
    modalVisible,
    selectedConversation,
    openConversation,
    closeConversationModal,
    handleReply,
    isLoading,
  };
};
*/

//prima del collegamento al DB

/*
// File: hooks/useMessagesLogic.ts

import { useState } from 'react';
import { Conversation, Message } from '../interfaces/message';
import { DUMMY_CONVERSATIONS } from '../utils/messages';

export const useMessagesLogic = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [conversations, setConversations] = useState(DUMMY_CONVERSATIONS);

  const openConversation = (conversation: Conversation) => {
    const updatedConversations = conversations.map(c =>
      c.id === conversation.id ? { ...c, isUnread: false } : c
    );
    setConversations(updatedConversations);
    setSelectedConversation(conversation);
    setModalVisible(true);
  };

  const closeConversationModal = () => {
    setModalVisible(false);
    setSelectedConversation(null);
  };

  const handleReply = (message: string) => {
    if (selectedConversation) {
      const newReply: Message = {
        id: `msg${Date.now()}`, // ID generato dinamicamente
        senderName: 'Tu',
        content: message,
        timestamp: new Date(),
        isRead: true,
        isMe: true,
      };

      const updatedConversations = conversations.map(c =>
        c.id === selectedConversation.id
          ? { ...c, messages: [...c.messages, newReply] }
          : c
      );
      setConversations(updatedConversations);
      setSelectedConversation(prev => prev ? { ...prev, messages: [...prev.messages, newReply] } : null);
    }
  };

  // Ordina le conversazioni in base all'ultimo messaggio
  const sortedConversations = [...conversations].sort((a, b) => {
    const lastMessageA = a.messages[a.messages.length - 1];
    const lastMessageB = b.messages[b.messages.length - 1];
    if (!lastMessageA || !lastMessageB) return 0;
    return lastMessageB.timestamp.getTime() - lastMessageA.timestamp.getTime();
  });

  return {
    sortedConversations,
    modalVisible,
    selectedConversation,
    openConversation,
    closeConversationModal,
    handleReply,
  };
};
*/