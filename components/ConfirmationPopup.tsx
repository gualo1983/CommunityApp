// /components/ConfirmationPopup.tsx

import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { useTheme } from '../contexts/theme';

interface ConfirmationPopupProps {
  isVisible: boolean;
  onClose: () => void;
}

const ConfirmationPopup: React.FC<ConfirmationPopupProps> = ({ isVisible, onClose }) => {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();

  // Definisce un breakpoint per distinguere tra schermi grandi e piccoli (es. 768px)
  const isLargeScreen = width >= 768;

  const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      padding: 20,
    },
    popupContainer: {
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 15,
      padding: 20,
      elevation: 8,
      shadowColor: 'rgba(0, 0, 0, 0.25)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      width: '90%',
      maxWidth: 400,
    },
    fullscreenContainer: {
      flex: 1,
      width: '100%',
      backgroundColor: theme.colors.cardBackground,
      padding: 20,
    },
    title: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSizes.large,
      fontWeight: theme.typography.fontWeights.bold,
      textAlign: 'center',
      marginBottom: 10,
    },
    subtitle: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSizes.medium,
      textAlign: 'center',
      marginBottom: 20,
    },
    button: {
      backgroundColor: theme.colors.primary,
      borderRadius: 10,
      paddingVertical: 12,
      paddingHorizontal: 20,
      elevation: 5,
      shadowColor: 'rgba(0, 0, 0, 0.2)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 4,
    },
    buttonText: {
      color: theme.colors.headerText,
      fontSize: theme.typography.fontSizes.medium,
      fontWeight: theme.typography.fontWeights.bold,
      textAlign: 'center',
    },
  });

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={isLargeScreen ? styles.popupContainer : styles.fullscreenContainer}>
          <Text style={styles.title}>
            Verifica la tua e-mail!
          </Text>
          <Text style={styles.subtitle}>
            Ti abbiamo inviato una e-mail di conferma. Clicca sul link al suo interno per attivare il tuo account e fare il login.
          </Text>
          <TouchableOpacity
            onPress={onClose}
            style={styles.button}
          >
            <Text style={styles.buttonText}>
              Ho capito
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmationPopup;
