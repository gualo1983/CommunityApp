// File: components/ConfirmDeleteModal.tsx
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useTheme } from "../contexts/theme";

interface ConfirmDeleteModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  tabName: string;
}

const ConfirmDeleteModal = ({
  visible,
  onClose,
  onConfirm,
  tabName,
}: ConfirmDeleteModalProps) => {
  const { theme } = useTheme();

  const modalStyles = StyleSheet.create({
    button: {
      alignItems: "center",
      borderRadius: 5,
      minWidth: "45%",
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 20,
      width: "100%",
    },
    buttonText: {
      color: theme.colors.headerText,
      fontWeight: "bold",
    },
    cancelButton: {
      backgroundColor: theme.colors.textSecondary,
    },
    centeredView: {
      alignItems: "center",
      backgroundColor: theme.colors.cardBackground,
      flex: 1,
      justifyContent: "center",
    },
    confirmButton: {
      backgroundColor: theme.colors.error, // Rosso per la conferma di eliminazione
    },
    modalTitle: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSizes.large,
      fontWeight: theme.typography.fontWeights.bold,
      marginBottom: 15,
      textAlign: "center",
    },
    modalView: {
      alignItems: "center",
      backgroundColor: theme.colors.background,
      borderRadius: 10,
      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
      elevation: 5,
      maxWidth: 400,
      padding: 20,
      width: "80%",
    },
  });

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={modalStyles.centeredView}>
        <View style={modalStyles.modalView}>
          <Text style={modalStyles.modalTitle}>
            Sei sicuro di voler eliminare la tab &quot;{tabName}&quot;?
          </Text>
          <View style={modalStyles.buttonContainer}>
            <TouchableOpacity
              style={[modalStyles.button, modalStyles.cancelButton]}
              onPress={onClose}
            >
              <Text style={modalStyles.buttonText}>Annulla</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[modalStyles.button, modalStyles.confirmButton]}
              onPress={onConfirm}
            >
              <Text style={modalStyles.buttonText}>Elimina</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmDeleteModal;
