// File: settings.tsx

import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import SettingsOption from '../components/SettingsOption';
import { useTheme } from '../contexts/theme';

export default function SettingsPage() {
  const { theme, setTheme, themeName, fontSizeOption, setFontSizeOption } = useTheme();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;

  const handleThemeChange = (selectedTheme: 'light' | 'dark' | 'custom') => {
    setTheme(selectedTheme);
    if (selectedTheme === 'custom') {
      router.push('/theme-settings');
    }
  };

  const handleFontSizeChange = (option: 'small' | 'medium' | 'large') => {
    setFontSizeOption(option);
  };

  const handleSave = () => {
    console.log('Salvataggio del tema:', themeName, 'Dimensione carattere:', fontSizeOption);
    router.back();
  };

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      flex: 1,
      justifyContent: 'center',
      padding: 20,
    },
    fullscreenContainer: {
      flex: 1,
      width: '100%',
    },
    popupContainer: {
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 15,
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
      elevation: 8,
      maxWidth: 400,
      padding: 20,
      width: '90%',
    },
    saveButton: {
      alignItems: 'center',
      alignSelf: 'center',
      backgroundColor: theme.colors.primary,
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
      borderRadius: 10,
      elevation: 5,
      paddingHorizontal: 50,
      paddingVertical: 15,
    },
    saveButtonContainer: {
      marginTop: 20,
      width: '100%',
    },
    saveButtonText: {
      color: theme.colors.headerText,
      fontSize: theme.typography.fontSizes.medium,
      fontWeight: theme.typography.fontWeights.bold,
    },
    sectionContainer: {
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 10,
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      elevation: 5,
      marginBottom: 20,
      padding: 15,
    },
    subtitle: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSizes.medium,
      fontWeight: theme.typography.fontWeights.bold,
      marginBottom: 10,
    },
  });

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Impostazioni',
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
        {/* Sezione per il tema dell'App */}
        <View style={styles.sectionContainer}>
          <Text style={styles.subtitle}>Tema dell&apos;App</Text>
          <SettingsOption
            label="Tema chiaro"
            isSelected={themeName === 'light'}
            onPress={() => handleThemeChange('light')}
          />
          <SettingsOption
            label="Tema scuro"
            isSelected={themeName === 'dark'}
            onPress={() => handleThemeChange('dark')}
          />
          <SettingsOption
            label="Scelto da me"
            isSelected={themeName === 'custom'}
            onPress={() => handleThemeChange('custom')}
          />
        </View>

        {/* Sezione per la dimensione del carattere */}
        <View style={styles.sectionContainer}>
          <Text style={styles.subtitle}>Dimensione Carattere</Text>
          <SettingsOption
            label="Piccolo"
            isSelected={fontSizeOption === 'small'}
            onPress={() => handleFontSizeChange('small')}
          />
          <SettingsOption
            label="Medio"
            isSelected={fontSizeOption === 'medium'}
            onPress={() => handleFontSizeChange('medium')}
          />
          <SettingsOption
            label="Grande"
            isSelected={fontSizeOption === 'large'}
            onPress={() => handleFontSizeChange('large')}
          />
        </View>

        <View style={styles.saveButtonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Salva</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}