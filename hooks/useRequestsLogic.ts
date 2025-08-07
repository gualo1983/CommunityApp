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