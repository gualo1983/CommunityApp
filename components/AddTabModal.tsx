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

interface AddTabModalProps {
  visible: boolean;
  onClose: () => void;
  onAddTab: (tabName: string) => void;
}

const AddTabModal = ({ visible, onClose, onAddTab }: AddTabModalProps) => {
  const { theme } = useTheme();
  const [tabName, setTabName] = useState("");

  const handleAdd = () => {
    if (tabName.trim()) {
      onAddTab(tabName.trim());
      setTabName("");
      onClose(); // <-- Aggiunta questa linea per chiudere il popup
    }
  };

  const modalStyles = StyleSheet.create({
    addButton: {
      backgroundColor: theme.colors.primary,
    },
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
    input: {
      backgroundColor: theme.colors.cardBackground,
      borderColor: theme.colors.cardBorder,
      borderRadius: 5,
      borderWidth: 1,
      color: theme.colors.text,
      height: 40,
      marginBottom: 20,
      paddingHorizontal: 10,
      width: "100%",
    },
    modalTitle: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSizes.large,
      fontWeight: theme.typography.fontWeights.bold,
      marginBottom: 15,
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
          <Text style={modalStyles.modalTitle}>Crea nuova tab</Text>
          <TextInput
            style={modalStyles.input}
            onChangeText={setTabName}
            value={tabName}
            placeholder="Nome della tab"
            placeholderTextColor={theme.colors.textSecondary}
          />
          <View style={modalStyles.buttonContainer}>
            <TouchableOpacity
              style={[modalStyles.button, modalStyles.cancelButton]}
              onPress={onClose}
            >
              <Text style={modalStyles.buttonText}>Annulla</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[modalStyles.button, modalStyles.addButton]}
              onPress={handleAdd}
            >
              <Text style={modalStyles.buttonText}>Aggiungi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddTabModal;
