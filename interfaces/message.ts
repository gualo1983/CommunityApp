// File: interfaces/message.ts

// Interfaccia per la struttura di un singolo messaggio
export interface Message {
  id: string;
  senderName: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  senderId: string;
  isMe: boolean; // Indica se il messaggio è stato inviato dall'utente attuale
}

// Interfaccia per un'intera conversazione
export interface Conversation {
  id: string;
  requestTitle: string;
  messages: Message[];
  isUnread: boolean;
  otherParticipantName: string;
}


/*
// File: interfaces/message.ts

// Interfaccia per la struttura di un singolo messaggio
export interface Message {
  id: string;
  senderName: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  isMe: boolean; // Indica se il messaggio è stato inviato dall'utente attuale
}

// Interfaccia per un'intera conversazione
export interface Conversation {
  id: string;
  requestTitle: string;
  messages: Message[];
  isUnread: boolean;
}

*/