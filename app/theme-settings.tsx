import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ChromePicker, ColorResult } from 'react-color';
import { Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Appbar, Button, Surface } from 'react-native-paper';
import { useTheme } from '../contexts/theme';

export default function AnotherCustomThemeSettingsPage() {
  const {
    theme,
    themeName,
    setTheme,
    setCustomColors,
    customColors,
  } = useTheme();
  const router = useRouter();

  const [selectedPrimaryColor, setSelectedPrimaryColor] = useState(customColors.primary);
  const [selectedBackgroundColor, setSelectedBackgroundColor] = useState(customColors.background);
  const [selectedTextColor, setSelectedTextColor] = useState(customColors.text);

  const [activePicker, setActivePicker] = useState<'primary' | 'background' | 'text' | null>(null);

  useEffect(() => {
    setSelectedPrimaryColor(customColors.primary);
    setSelectedBackgroundColor(customColors.background);
    setSelectedTextColor(customColors.text);
  }, [customColors]);

  const handleSave = () => {
    setCustomColors({
      primary: selectedPrimaryColor,
      background: selectedBackgroundColor,
      text: selectedTextColor,
    });
    setTheme('custom');
    router.back();
  };

  const closePicker = () => {
    setActivePicker(null);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    contentContainer: {
      padding: 20,
    },
    title: {
      fontSize: theme.typography.fontSizes.large,
      fontWeight: theme.typography.fontWeights.bold,
      color: theme.colors.text,
      marginBottom: 20,
      textAlign: 'center',
    },
    section: {
      marginBottom: 20,
      borderRadius: 8,
      padding: 15,
      backgroundColor: theme.colors.cardBackground,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    sectionTitle: {
      fontSize: theme.typography.fontSizes.medium,
      fontWeight: theme.typography.fontWeights.bold,
      color: theme.colors.text,
      marginBottom: 10,
    },
    colorSelectorRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      marginBottom: 10,
    },
    colorSwatchButton: {
      width: 38,
      height: 38,
      borderRadius: 19,
      borderWidth: 2,
      borderColor: theme.colors.cardBorder,
      justifyContent: 'center',
      alignItems: 'center',
    },
    colorSwatchSelected: {
      borderColor: theme.colors.primary,
    },
    colorSwatchLabel: {
      fontSize: theme.typography.fontSizes.medium,
      color: theme.colors.text,
      marginRight: 15,
      minWidth: 120,
    },
    pickerOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
    },
    pickerModal: {
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 8,
      padding: 10,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    chromePickerWeb: {
      width: Platform.OS === 'web' ? '100%' : undefined,
      maxWidth: 300,
      borderRadius: 8,
      overflow: 'hidden',
    } as any,
    previewContainer: {
      padding: 20,
      borderRadius: 10,
      marginTop: 20,
      alignItems: 'center',
      backgroundColor: selectedBackgroundColor,
      borderColor: theme.colors.cardBorder,
      borderWidth: 1,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 5,
    },
    previewTitle: {
      color: selectedTextColor,
      fontSize: theme.typography.fontSizes.large,
      fontWeight: theme.typography.fontWeights.bold,
      marginBottom: 5,
    },
    previewText: {
      color: selectedTextColor,
      fontSize: theme.typography.fontSizes.medium,
      marginBottom: 10,
      textAlign: 'center',
    },
    previewButton: {
      backgroundColor: selectedPrimaryColor,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
      marginTop: 10,
    },
    previewButtonText: {
      color: selectedTextColor,
      fontWeight: 'bold',
    },
    saveButton: {
      backgroundColor: theme.colors.primary,
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 30,
      width: '60%',
      alignSelf: 'center',
    },
    saveButtonText: {
      color: theme.colors.text, // Modificato per usare il colore del testo generale
      fontWeight: 'bold',
      fontSize: theme.typography.fontSizes.medium,
    },
    closeButton: {
      marginTop: 10,
      alignSelf: 'center',
      width: '80%',
      backgroundColor: theme.colors.primary,
    },
    closeButtonText: {
      color: theme.colors.headerText,
      fontWeight: 'bold',
    },
  });

  return (
    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: theme.colors.headerBackground }}>
        <Appbar.BackAction onPress={() => router.back()} color={theme.colors.headerText} />
        <Appbar.Content title="Personalizza Tema" titleStyle={{ color: theme.colors.headerText }} />
      </Appbar.Header>

      <ScrollView style={styles.contentContainer}>
        {/* Sezione Colore di Sfondo */}
        <Surface style={styles.section}>
          <View style={styles.colorSelectorRow}>
            <Text style={styles.colorSwatchLabel}>Colore di Sfondo</Text>
            <TouchableOpacity
              style={[styles.colorSwatchButton, { backgroundColor: selectedBackgroundColor }, activePicker === 'background' && styles.colorSwatchSelected]}
              onPress={() => setActivePicker('background')}
            />
          </View>
        </Surface>

        {/* Sezione Colore Primario */}
        <Surface style={styles.section}>
          <View style={styles.colorSelectorRow}>
            <Text style={styles.colorSwatchLabel}>Colore Primario</Text>
            <TouchableOpacity
              style={[styles.colorSwatchButton, { backgroundColor: selectedPrimaryColor }, activePicker === 'primary' && styles.colorSwatchSelected]}
              onPress={() => setActivePicker('primary')}
            />
          </View>
        </Surface>

        {/* Sezione Colore Testo */}
        <Surface style={styles.section}>
          <View style={styles.colorSelectorRow}>
            <Text style={styles.colorSwatchLabel}>Colore Testo</Text>
            <TouchableOpacity
              style={[styles.colorSwatchButton, { backgroundColor: selectedTextColor }, activePicker === 'text' && styles.colorSwatchSelected]}
              onPress={() => setActivePicker('text')}
            />
          </View>
        </Surface>

        {/* Preview */}
        <Surface style={styles.previewContainer}>
          <Text style={styles.previewTitle}>Titolo di prova</Text>
          <Text style={styles.previewText}>
            Questo è un esempio di testo per mostrare come i colori scelti si adattano all&apos;applicazione.
            Puoi personalizzare il colore di sfondo, il colore primario e il colore del testo.
          </Text>
          <Button mode="contained" style={styles.previewButton} labelStyle={styles.previewButtonText}>
            Pulsante di esempio
          </Button>
        </Surface>

        <Button mode="contained" onPress={handleSave} style={styles.saveButton} labelStyle={styles.saveButtonText}>
          Salva Personalizzazioni
        </Button>
      </ScrollView>

      {/* Modal per i color picker (Web e Native) */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={!!activePicker}
        onRequestClose={closePicker}
      >
        <TouchableWithoutFeedback onPress={closePicker}>
          <View style={styles.pickerOverlay}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={styles.pickerModal}>
                {Platform.OS === 'web' ? (
                  <>
                    {activePicker === 'background' && (
                      <ChromePicker
                        color={selectedBackgroundColor}
                        onChangeComplete={(color: ColorResult) => setSelectedBackgroundColor(color.hex)}
                        disableAlpha={true}
                        styles={{ picker: styles.chromePickerWeb }}
                      />
                    )}
                    {activePicker === 'primary' && (
                      <ChromePicker
                        color={selectedPrimaryColor}
                        onChangeComplete={(color: ColorResult) => setSelectedPrimaryColor(color.hex)}
                        disableAlpha={true}
                        styles={{ picker: styles.chromePickerWeb }}
                      />
                    )}
                    {activePicker === 'text' && (
                      <ChromePicker
                        color={selectedTextColor}
                        onChangeComplete={(color: ColorResult) => setSelectedTextColor(color.hex)}
                        disableAlpha={true}
                        styles={{ picker: styles.chromePickerWeb }}
                      />
                    )}
                    <Button mode="contained" onPress={closePicker} style={styles.closeButton} labelStyle={styles.closeButtonText}>
                      Chiudi
                    </Button>
                  </>
                ) : (
                  <>
                    <Text style={{ color: theme.colors.textSecondary, textAlign: 'center', marginBottom: 10 }}>
                      Il color picker avanzato è disponibile solo su web.
                      Colore attuale: {
                        activePicker === 'background' ? selectedBackgroundColor :
                        activePicker === 'primary' ? selectedPrimaryColor :
                        selectedTextColor
                      }
                    </Text>
                    <Button mode="contained" onPress={closePicker} style={{ marginTop: 10 }}>
                      Chiudi
                    </Button>
                  </>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
