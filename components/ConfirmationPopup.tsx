// /components/ConfirmationPopup.tsx

import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

import { useTheme } from "../contexts/theme";

interface ConfirmationPopupProps {
  isVisible: boolean;
  onClose: () => void;
}

const ConfirmationPopup: React.FC<ConfirmationPopupProps> = ({
  isVisible,
  onClose,
}) => {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();

  // Definisce un breakpoint per distinguere tra schermi grandi e piccoli (es. 768px)
  const isLargeScreen = width >= 768;

  const styles = StyleSheet.create({
    button: {
      backgroundColor: theme.colors.primary,
      borderRadius: 10,
      boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.4)",
      elevation: 5,
      paddingHorizontal: 20,
      paddingVertical: 12,
    },
    buttonText: {
      color: theme.colors.headerText,
      fontSize: theme.typography.fontSizes.medium,
      fontWeight: theme.typography.fontWeights.bold,
      textAlign: "center",
    },
    centeredView: {
      alignItems: "center",
      backgroundColor: theme.colors.cardBackground,
      flex: 1,
      justifyContent: "center",
      padding: 20,
    },
    fullscreenContainer: {
      backgroundColor: theme.colors.cardBackground,
      flex: 1,
      padding: 20,
      width: "100%",
    },
    popupContainer: {
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 15,
      boxShadow: "0px 4px 5px rgba(0, 0, 0, 0.3)",
      elevation: 8,
      maxWidth: 400,
      padding: 20,
      width: "90%",
    },
    subtitle: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSizes.medium,
      marginBottom: 20,
      textAlign: "center",
    },
    title: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSizes.large,
      fontWeight: theme.typography.fontWeights.bold,
      marginBottom: 10,
      textAlign: "center",
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
        <View
          style={
            isLargeScreen ? styles.popupContainer : styles.fullscreenContainer
          }
        >
          <Text style={styles.title}>Verifica la tua e-mail!</Text>
          <Text style={styles.subtitle}>
            Ti abbiamo inviato una e-mail di conferma. Clicca sul link al suo
            interno per attivare il tuo account e fare il login.
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.button}>
            <Text style={styles.buttonText}>Ho capito</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmationPopup;
