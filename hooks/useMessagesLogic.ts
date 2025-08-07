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