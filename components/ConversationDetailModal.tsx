// File: components/ConversationDetailModal.tsx

import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../contexts/theme';
import { Conversation, Message } from '../interfaces/message';

interface ConversationDetailModalProps {
  visible: boolean;
  onClose: () => void;
  conversation: Conversation | null;
  onReply: (message: string) => void;
}

const ConversationDetailModal = ({ visible, onClose, conversation, onReply }: ConversationDetailModalProps) => {
  const { theme } = useTheme();
  const [replyText, setReplyText] = useState('');
  const MAX_CHARS = 500;
  const charsRemaining = MAX_CHARS - replyText.length;
  const isCloseToLimit = charsRemaining <= 50;
  
  // 1. Sposta la ref e useEffect qui, prima di ogni return
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (visible && scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [visible, conversation]);

  // Il render condizionale deve venire dopo la dichiarazione degli hooks
  if (!conversation) {
    return null;
  }

  const handleReply = () => {
    if (replyText.trim().length > 0) {
      onReply(replyText);
      setReplyText('');
    }
  };

  const styles = StyleSheet.create({
    // ... i tuoi stili qui
    centeredView: {
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
      flex: 1,
      justifyContent: 'center',
      padding: 20,
    },
    chatContainer: {
      padding: 10,
      minHeight: 200,
      ...Platform.select({
        web: {
          flex: 1,
        },
        android: {
          flex: 1,
        },
      }),
    },
    closeButton: {
      padding: 5,
      position: 'absolute',
      right: 10,
      top: 10,
      zIndex: 1,
    },
    counterText: {
      color: isCloseToLimit ? '#dc3545' : theme.colors.textSecondary,
      fontSize: theme.typography.fontSizes.small,
    },
    inputContainer: {
      alignItems: 'center',
      borderColor: theme.colors.cardBorder,
      borderTopWidth: 1,
      flexDirection: 'row',
      marginTop: 10,
      paddingTop: 10,
    },
    messageBubble: {
      borderRadius: 15,
      marginBottom: 10,
      maxWidth: '80%',
      padding: 10,
    },
    messageText: {
      color: theme.colors.headerText,
      fontSize: theme.typography.fontSizes.small,
    },
    messageTimestamp: {
      color: theme.colors.headerText,
      fontSize: theme.typography.fontSizes.small,
      marginTop: 5,
      textAlign: 'right',
    },
    modalTitle: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSizes.large,
      fontWeight: theme.typography.fontWeights.bold,
      marginBottom: 10,
      textAlign: 'center',
    },
    modalView: {
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 10,
      elevation: 5,
      maxWidth: 400,
      padding: 15,
      width: '100%',
      ...Platform.select({
        web: {
          maxHeight: '80%',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
        },
        android: {
          flex: 1,
          height: '80%',
        },
      }),
    },
    myMessage: {
      alignSelf: 'flex-end',
      backgroundColor: theme.colors.primary,
      borderBottomRightRadius: 0,
    },
    replyFooter: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 5,
    },
    sendButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 20,
      padding: 10,
    },
    sendButtonText: {
      color: theme.colors.headerText,
      fontWeight: 'bold',
    },
    textInput: {
      backgroundColor: theme.colors.background,
      borderColor: isCloseToLimit ? '#dc3545' : theme.colors.cardBorder,
      borderRadius: 20,
      borderWidth: 1,
      color: theme.colors.text,
      flex: 1,
      height: 40,
      marginRight: 10,
      padding: 10,
    },
    theirMessage: {
      alignSelf: 'flex-start',
      backgroundColor: theme.colors.headerBackground,
      borderBottomLeftRadius: 0,
    },
  });

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MaterialCommunityIcons name="close-circle" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>R: {conversation.requestTitle}</Text>
          <ScrollView style={styles.chatContainer} ref={scrollViewRef}>
            {conversation.messages.map((message: Message) => (
              <View
                key={message.id}
                style={[
                  styles.messageBubble,
                  message.isMe ? styles.myMessage : styles.theirMessage,
                ]}
              >
                <Text style={styles.messageText}>{message.content}</Text>
                <Text style={styles.messageTimestamp}>
                  {message.senderName} - {message.timestamp.toLocaleString()}
                </Text>
              </View>
            ))}
          </ScrollView>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              onChangeText={setReplyText}
              value={replyText}
              placeholder="Scrivi un messaggio..."
              placeholderTextColor={theme.colors.textSecondary}
              multiline={false}
              maxLength={MAX_CHARS}
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleReply}>
              <MaterialCommunityIcons name="send" size={24} color={theme.colors.headerText} />
            </TouchableOpacity>
          </View>
          <View style={styles.replyFooter}>
            <Text style={styles.counterText}>Caratteri: {charsRemaining}</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConversationDetailModal;