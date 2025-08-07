// File: components/RequestModal.tsx

import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../contexts/theme';
import { Request } from '../interfaces/request';

interface RequestModalProps {
  visible: boolean;
  onClose: () => void;
  request: Request | null;
  onSendMessage: () => void;
}

const RequestModal = ({ visible, onClose, request, onSendMessage }: RequestModalProps) => {
  const { theme } = useTheme();

  if (!request) return null;

  const styles = StyleSheet.create({
    button: {
      backgroundColor: theme.colors.primary,
      borderRadius: 5,
      elevation: 2,
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    buttonClose: {
      backgroundColor: theme.colors.cardBorder,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
    },
    centeredView: {
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
      flex: 1,
      justifyContent: 'center',
      padding: 20,
    },
    modalIdText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSizes.small,
      position: 'absolute',
      right: 25,
      top: 15,
    },
    modalText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSizes.medium,
      marginBottom: 20,
      textAlign: 'justify',
    },
    modalTitle: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSizes.large,
      fontWeight: theme.typography.fontWeights.bold,
      marginBottom: 15,
      textAlign: 'center',
    },
    modalView: {
      alignItems: 'center',
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 10,
      boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.25)',
      elevation: 5,
      maxWidth: 600,
      padding: 25,
      width: '100%',
    },
    textStyle: {
      color: theme.colors.headerText,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <ScrollView>
            <Text style={styles.modalIdText}>ID: {request.id}</Text>
            <Text style={styles.modalTitle}>{request.title}</Text>
            <Text style={styles.modalText}>{request.longDescription}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={onSendMessage}>
                <Text style={styles.textStyle}>Invia messaggio</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.buttonClose]} onPress={onClose}>
                <Text style={styles.textStyle}>Chiudi</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default RequestModal;