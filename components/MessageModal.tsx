// File: components/MessageModal.tsx

import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useTheme } from "../contexts/theme";

interface MessageModalProps {
  visible: boolean;
  onClose: () => void;
  requestTitle: string | null;
  onSend: (message: string) => void;
}

const MessageModal = ({
  visible,
  onClose,
  requestTitle,
  onSend,
}: MessageModalProps) => {
  const { theme } = useTheme();
  const [messageText, setMessageText] = useState("");
  const MAX_CHARS = 500;
  const charsRemaining = MAX_CHARS - messageText.length;
  const isCloseToLimit = charsRemaining <= 50;

  if (!visible || !requestTitle) return null;

  const styles = StyleSheet.create({
    button: {
      backgroundColor: theme.colors.primary,
      borderRadius: 5,
      elevation: 2,
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    buttonCancel: {
      backgroundColor: theme.colors.cardBorder,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginTop: 20,
    },
    centeredView: {
      alignItems: "center",
      backgroundColor: theme.colors.cardBackground,
      flex: 1,
      justifyContent: "center",
      padding: 20,
    },
    counterContainer: {
      flexDirection: "row",
      justifyContent: "flex-end",
      marginTop: 5,
    },
    counterText: {
      color: isCloseToLimit ? theme.colors.error : theme.colors.textSecondary,
      fontSize: theme.typography.fontSizes.small,
    },
    modalTitle: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSizes.medium,
      fontWeight: theme.typography.fontWeights.bold,
      marginBottom: 15,
      textAlign: "center",
    },
    modalView: {
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 10,
      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
      elevation: 5,
      maxWidth: 400,
      padding: 25,
      width: "100%",
    },
    textInput: {
      backgroundColor: theme.colors.background,
      borderColor: isCloseToLimit ? theme.colors.error : theme.colors.cardBorder,
      borderRadius: 5,
      borderWidth: 1,
      color: theme.colors.text,
      fontSize: theme.typography.fontSizes.small,
      minHeight: 120,
      padding: 10,
      textAlignVertical: "top",
    },
    textStyle: {
      color: theme.colors.headerText,
      fontWeight: "bold",
      textAlign: "center",
    },
  });

  const handleSend = () => {
    onSend(messageText);
    setMessageText("");
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>R: {requestTitle}</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={setMessageText}
            value={messageText}
            placeholder={`Scrivi all'inserzionista un messaggio (max ${MAX_CHARS} caratteri)`}
            placeholderTextColor={theme.colors.textSecondary}
            multiline={true}
            maxLength={MAX_CHARS}
            scrollEnabled={true}
          />
          <View style={styles.counterContainer}>
            <Text style={styles.counterText}>
              {charsRemaining} / {MAX_CHARS}
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleSend}>
              <Text style={styles.textStyle}>Invia</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonCancel]}
              onPress={onClose}
            >
              <Text style={styles.textStyle}>Annulla</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default MessageModal;
