import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ColorResult } from 'react-color';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import ColorPickerModal from '../components/ColorPickerModal';
import ThemePreview from '../components/ThemePreview';
import { useTheme } from '../contexts/theme';
import { useCustomThemeLogic } from '../hooks/useCustomThemeLogic';

export default function CustomThemeSettingsPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;

  const {
    selectedPrimaryColor,
    setSelectedPrimaryColor,
    selectedBackgroundColor,
    setSelectedBackgroundColor,
    selectedTextColor,
    setSelectedTextColor,
    isSaveEnabled,
    validationMessage,
    handleSave,
  } = useCustomThemeLogic();

  const [activePicker, setActivePicker] = useState<'primary' | 'background' | 'text' | null>(null);

  // ✨ Stili corretti: ripristino della dichiarazione Stylesheet.create
  const styles = StyleSheet.create({
    colorSelectorRow: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      marginBottom: 5,
    },
    colorSwatchButton: {
      alignItems: 'center',
      borderColor: theme.colors.cardBorder,
      borderRadius: 15,
      borderWidth: 2,
      height: 30,
      justifyContent: 'center',
      width: 30,
    },
    colorSwatchLabel: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSizes.medium,
      marginRight: 15,
      minWidth: 120,
    },
    colorSwatchSelected: {
      borderColor: theme.colors.primary,
    },
    container: {
      backgroundColor: theme.colors.background,
      flex: 1,
      ...(isLargeScreen && {
        alignItems: 'center',
        justifyContent: 'center',
      }),
    },
    contentContainer: {
      padding: 20,
    },
    fullscreenContainer: {
      flex: 1,
    },
    popupContainer: {
      backgroundColor: theme.colors.cardBackground,
      // @ts-ignore
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
      borderRadius: 15,
      elevation: 8,
      maxWidth: 400,
      width: '90%',
    },
    saveButton: {
      alignItems: 'center',
      alignSelf: 'center', 
      backgroundColor: isSaveEnabled ? theme.colors.primary : theme.colors.textSecondary,
      borderRadius: 10,
      marginTop: 30,
      opacity: isSaveEnabled ? 1 : 0.5,
      padding: 15,
      paddingHorizontal: 30,
    },
    saveButtonText: {
      color: theme.colors.headerText,
      fontSize: theme.typography.fontSizes.medium,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    section: {
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 8,
      // @ts-ignore
      boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
      elevation: 2,
      marginBottom: 15,
      padding: 10,
    },
    sectionTitle: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSizes.medium,
      fontWeight: theme.typography.fontWeights.bold,
      marginBottom: 10,
    },
    validationMessage: {
      color: 'red',
      fontSize: theme.typography.fontSizes.small,
      fontWeight: theme.typography.fontWeights.bold,
      marginBottom: 10,
      marginTop: 10,
      textAlign: 'center',
    },
  });

  const getPickerState = () => {
    switch (activePicker) {
      case 'background':
        // ✨ Correzione della tipizzazione di onColorChange
        return {
          color: selectedBackgroundColor,
          onChange: (color: string | ColorResult) => {
            if (typeof color === 'string') {
                setSelectedBackgroundColor(color);
            } else if (color.hex) {
                setSelectedBackgroundColor(color.hex);
            }
          }
        };
      case 'primary':
        // ✨ Correzione della tipizzazione di onColorChange
        return {
          color: selectedPrimaryColor,
          onChange: (color: string | ColorResult) => {
            if (typeof color === 'string') {
                setSelectedPrimaryColor(color);
            } else if (color.hex) {
                setSelectedPrimaryColor(color.hex);
            }
          }
        };
      case 'text':
        // ✨ Correzione della tipizzazione di onColorChange
        return {
          color: selectedTextColor,
          onChange: (color: string | ColorResult) => {
            if (typeof color === 'string') {
                setSelectedTextColor(color);
            } else if (color.hex) {
                setSelectedTextColor(color.hex);
            }
          }
        };
      default:
        return null;
    }
  };

  const pickerState = getPickerState();

  const handleCloseModal = () => {
    setActivePicker(null);
  };
  
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Personalizza Tema',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: theme.colors.headerBackground,
          },
          headerTitleStyle: {
            color: theme.colors.headerText,
            fontSize: theme.typography.fontSizes.large,
            fontWeight: theme.typography.fontWeights.bold,
          },
          headerTintColor: theme.colors.headerText,
        }}
      />
      <View style={isLargeScreen ? styles.popupContainer : styles.fullscreenContainer}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.section}>
            <View style={styles.colorSelectorRow}>
              <Text style={styles.colorSwatchLabel}>Colore di Sfondo</Text>
              <TouchableOpacity
                style={[styles.colorSwatchButton, { backgroundColor: selectedBackgroundColor }, activePicker === 'background' && styles.colorSwatchSelected]}
                onPress={() => setActivePicker('background')}
              />
            </View>
          </View>
          <View style={styles.section}>
            <View style={styles.colorSelectorRow}>
              <Text style={styles.colorSwatchLabel}>Colore Primario</Text>
              <TouchableOpacity
                style={[styles.colorSwatchButton, { backgroundColor: selectedPrimaryColor }, activePicker === 'primary' && styles.colorSwatchSelected]}
                onPress={() => setActivePicker('primary')}
              />
            </View>
          </View>
          <View style={styles.section}>
            <View style={styles.colorSelectorRow}>
              <Text style={styles.colorSwatchLabel}>Colore Testo</Text>
              <TouchableOpacity
                style={[styles.colorSwatchButton, { backgroundColor: selectedTextColor }, activePicker === 'text' && styles.colorSwatchSelected]}
                onPress={() => setActivePicker('text')}
              />
            </View>
          </View>
          <ThemePreview
            selectedPrimaryColor={selectedPrimaryColor}
            selectedBackgroundColor={selectedBackgroundColor}
            selectedTextColor={selectedTextColor}
          />
          {validationMessage ? (
            <Text style={styles.validationMessage}>{validationMessage}</Text>
          ) : null}
          <TouchableOpacity
            onPress={() => {
              handleSave();
              router.back();
            }}
            style={styles.saveButton}
            disabled={!isSaveEnabled}
          >
            <Text style={styles.saveButtonText}>Salva Personalizzazioni</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      {pickerState && (
        <ColorPickerModal
          visible={!!activePicker}
          onClose={handleCloseModal}
          activePicker={activePicker}
          selectedColor={pickerState.color}
          onColorChange={pickerState.onChange}
        />
      )}
    </View>
  );
}