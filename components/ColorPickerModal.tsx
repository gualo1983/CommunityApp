// File: components/ColorPickerModal.tsx

import React from 'react';
import { ChromePicker, ColorResult } from 'react-color';
import { Modal, Platform, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useTheme } from '../contexts/theme';

import ColorPicker from 'react-native-wheel-color-picker';

// ✨ Rimuovi l'interfaccia HsvColor perché non è più utilizzata dalla nuova libreria.
// interface HsvColor {
//   h: number;
//   s: number;
//   v: number;
// }

interface ColorPickerModalProps {
  visible: boolean;
  onClose: () => void;
  activePicker: 'primary' | 'background' | 'text' | null;
  selectedColor: string;
  onColorChange: (color: ColorResult | string) => void;
}

const ColorPickerModal = ({ visible, onClose, activePicker, selectedColor, onColorChange }: ColorPickerModalProps) => {
  const { theme } = useTheme();

  const handleNativeColorChange = (color: string) => {
    onColorChange(color);
  };
  
  const androidPickerStyles = StyleSheet.create({
    androidPickerContainer: {
      height: 300,
      width: '100%',
    },
  });

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
      elevation: 5,
      padding: 10,
      ...Platform.select({
        web: {
          boxShadow: '0px 2px 3.84px rgba(0, 0, 0, 0.25)',
        },
        android: {
          width: '90%',
          maxWidth: 350,
        },
      }),
    },
    pickerOverlay: {
      ...StyleSheet.absoluteFillObject,
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      zIndex: 9999,
    },
  });

  const AndroidColorPicker = ColorPicker as any;

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
                    onChangeComplete={onColorChange as (color: ColorResult) => void}
                    disableAlpha={true}
                    styles={{ picker: styles.chromePickerWeb }}
                  />
                  <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Chiudi</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.infoText}>Scegli un colore</Text>
                  <View style={androidPickerStyles.androidPickerContainer}>
                    <AndroidColorPicker
                      onColorChange={handleNativeColorChange}
                      style={{ flex: 1 }}
                      color={selectedColor}
                      thumbSize={30}
                      sliderSize={30}
                      noSnap={true}
                      swatches={false}
                    />
                  </View>
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