// File: components/ColorPickerModal.tsx

import React from 'react';
import { ChromePicker, ColorResult } from 'react-color';
import { Modal, Platform, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useTheme } from '../contexts/theme';

interface ColorPickerModalProps {
  visible: boolean;
  onClose: () => void;
  activePicker: 'primary' | 'background' | 'text' | null;
  selectedColor: string;
  onColorChange: (color: ColorResult) => void;
}

const ColorPickerModal = ({ visible, onClose, activePicker, selectedColor, onColorChange }: ColorPickerModalProps) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    chromePickerWeb: {
      width: Platform.OS === 'web' ? '100%' : undefined,
      maxWidth: 300,
      borderRadius: 8,
      overflow: 'hidden',
    } as any,
    closeButton: {
      alignItems: 'center',
      alignSelf: 'center',
      backgroundColor: theme.colors.primary,
      borderRadius: 5,
      justifyContent: 'center',
      marginTop: 10,
      padding: 10,
      width: '80%',
    },
    closeButtonText: {
      color: theme.colors.headerText,
      fontWeight: 'bold',
    },  
    infoText: {
      color: theme.colors.textSecondary,
      marginBottom: 10,
      textAlign: 'center',
    },
    pickerModal: {
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 8,
      boxShadow: '0px 2px 3.84px rgba(0, 0, 0, 0.25)',
      elevation: 5,
      padding: 10,
    },
    pickerOverlay: {
      ...StyleSheet.absoluteFillObject,
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      zIndex: 9999,
    },
  });

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.pickerOverlay}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={styles.pickerModal}>
              {Platform.OS === 'web' ? (
                <>
                  <ChromePicker
                    color={selectedColor}
                    onChangeComplete={onColorChange}
                    disableAlpha={true}
                    styles={{ picker: styles.chromePickerWeb }}
                  />
                  <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Chiudi</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.infoText}>
                    Il color picker avanzato è disponibile solo su web.
                    Colore attuale: {selectedColor}
                  </Text>
                  <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Chiudi</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ColorPickerModal;