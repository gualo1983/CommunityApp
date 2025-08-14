// File: hooks/useRequestsLogic.ts

import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useSupabase } from '../contexts/SupabaseProvider';
import { Request, SupabaseRequestResponse } from '../interfaces/request';
import { getUrgency } from '../utils/requests';

export const useRequestsLogic = () => {
  const { supabase } = useSupabase();
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isMessageModalVisible, setIsMessageModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('richieste')
          .select('id, titolo, descrizione_breve, descrizione_estesa, data_creazione, data_scadenza')
          .order('data_scadenza', { ascending: true });
        
        if (error) {
          throw error;
        }

        const mappedRequests: Request[] = data.map((req: SupabaseRequestResponse) => {
          // Accedi direttamente alla proprietà 'dettagli'
          const longDescription = req.descrizione_estesa.dettagli;

          return {
            id: req.id,
            title: req.titolo,
            shortDescription: req.descrizione_breve,
            longDescription: longDescription,
            createdAt: new Date(req.data_creazione),
            expiresAt: new Date(req.data_scadenza),
          };
        });

        setRequests(mappedRequests);
      } catch (err: any) {
        console.error('Errore nel recupero delle richieste:', err);
        setError('Impossibile caricare le richieste. Riprova più tardi.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, [supabase]);

  const sortedRequests = [...requests].sort((a, b) => {
    const urgencyA = getUrgency(a.expiresAt);
    const urgencyB = getUrgency(b.expiresAt);
    const urgencyOrder = { red: 1, yellow: 2, green: 3, expired: 4 };

    return urgencyOrder[urgencyA] - urgencyOrder[urgencyB];
  });
  
  const openRequestModal = (request: Request) => {
    setSelectedRequest(request);
    setModalVisible(true);
  };

  const closeRequestModal = () => {
    setModalVisible(false);
    setSelectedRequest(null);
  };

  const handleSendMessage = () => {
    setModalVisible(false);
    setIsMessageModalVisible(true);
  };

  const handleMessageSend = (message: string) => {
    if (selectedRequest) {
      console.log(`Messaggio per la richiesta ${selectedRequest.id} inviato:`, message);
      Alert.alert('Messaggio Inviato', 'Il tuo messaggio è stato inviato con successo.');
    }
    setIsMessageModalVisible(false);
  };

  return {
    sortedRequests,
    isLoading,
    error,
    modalVisible,
    isMessageModalVisible,
    selectedRequest,
    openRequestModal,
    closeRequestModal,
    handleSendMessage,
    handleMessageSend,
    setIsMessageModalVisible,
  };
};

/*
// File: hooks/useRequestsLogic.ts

import { useState } from 'react';
import { Request } from '../interfaces/request';
import { DUMMY_REQUESTS, getUrgency } from '../utils/requests';

export const useRequestsLogic = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isMessageModalVisible, setIsMessageModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  const openRequestModal = (request: Request) => {
    setSelectedRequest(request);
    setModalVisible(true);
  };

  const closeRequestModal = () => {
    setModalVisible(false);
    setSelectedRequest(null);
  };

  const handleSendMessage = () => {
    setModalVisible(false);
    setIsMessageModalVisible(true);
  };

  const handleMessageSend = (message: string) => {
    if (selectedRequest) {
      console.log(`Messaggio per la richiesta ${selectedRequest.id} inviato:`, message);
    }
    setIsMessageModalVisible(false);
  };

  const sortedRequests = [...DUMMY_REQUESTS].sort((a, b) => {
    const urgencyA = getUrgency(a.expiresAt);
    const urgencyB = getUrgency(b.expiresAt);

    const urgencyOrder = { red: 1, yellow: 2, green: 3, expired: 4 };

    return urgencyOrder[urgencyA] - urgencyOrder[urgencyB];
  });

  return {
    sortedRequests,
    modalVisible,
    isMessageModalVisible,
    selectedRequest,
    openRequestModal,
    closeRequestModal,
    handleSendMessage,
    handleMessageSend,
    setIsMessageModalVisible,
  };
};
*/