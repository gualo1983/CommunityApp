import { Stack } from 'expo-router';
import React from 'react';
import { SettingsPageUI } from '../components/SettingsPageUI';
import { useTheme } from '../contexts/theme';

export default function SettingsPage() {
  const { theme } = useTheme();

  return (
    <>
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
      <SettingsPageUI />
    </>
  );
}
/*
// File: settings.tsx

import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import SettingsOption from '../components/SettingsOption';
import { useAuth } from '../contexts/AuthProvider';
import { useSupabase } from '../contexts/SupabaseProvider';
import { useTheme } from '../contexts/theme';

export default function SettingsPage() {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const { theme, setTheme, themeName, fontSizeOption, setFontSizeOption } = useTheme();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Carica le impostazioni utente all'avvio della pagina
  useEffect(() => {
    const fetchSettings = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('utenti')
          .select('impostazioni_app')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        
        if (data && data.impostazioni_app) {
          const { themeName: savedTheme, fontSizeOption: savedFontSize } = data.impostazioni_app;
          if (savedTheme) setTheme(savedTheme);
          if (savedFontSize) setFontSizeOption(savedFontSize);
        }
      } catch (err) {
        console.error("Errore nel recupero delle impostazioni utente:", err);
        Alert.alert("Errore", "Impossibile caricare le impostazioni.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSettings();
  }, [user, supabase, setTheme, setFontSizeOption]);

  const handleThemeChange = (selectedTheme: 'light' | 'dark' | 'custom') => {
    setTheme(selectedTheme);
  };

  const handleFontSizeChange = (option: 'small' | 'medium' | 'large') => {
    setFontSizeOption(option);
  };

  const handleSave = async () => {
    if (!user) {
      Alert.alert("Errore", "Utente non autenticato. Riprova il login.");
      return;
    }
    
    setIsSaving(true);

    try {
      const appSettings = {
        themeName,
        fontSizeOption,
      };

      const { error: updateError } = await supabase
        .from('utenti')
        .update({ impostazioni_app: appSettings })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      console.log('Impostazioni dell\'app salvate con successo:', appSettings);
      Alert.alert("Successo", "Le impostazioni sono state salvate!");
    } catch (err) {
      console.error('Errore nel salvataggio delle impostazioni:', err);
      Alert.alert("Errore", "Si è verificato un errore nel salvataggio. Riprova.");
    } finally {
      setIsSaving(false);
    }
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
      // @ts-ignore
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
      borderRadius: 15,
      elevation: 8,
      maxWidth: 400,
      padding: 20,
      width: '90%',
    },
    saveButton: {
      alignItems: 'center',
      alignSelf: 'center',
      backgroundColor: theme.colors.primary,
      // @ts-ignore
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
      borderRadius: 10,
      elevation: 5,
      paddingHorizontal: 50,
      paddingVertical: 15,
      opacity: isSaving ? 0.7 : 1,
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
      // @ts-ignore
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
    personalDataButton: {
      backgroundColor: theme.colors.primary,
      padding: 15,
      borderRadius: 10,
      marginTop: 10,
      alignItems: 'center',
    },
    personalDataButtonText: {
      color: theme.colors.headerText,
      fontSize: theme.typography.fontSizes.medium,
      fontWeight: theme.typography.fontWeights.bold,
    },
  });

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

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
        <View style={styles.sectionContainer}>
          <Text style={styles.subtitle}>Informazioni Personali</Text>
          <TouchableOpacity
            style={styles.personalDataButton}
            onPress={() => router.push('/PersonalDataPage')}
          >
            <Text style={styles.personalDataButtonText}>Modifica Dati</Text>
          </TouchableOpacity>
        </View>
        
        
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
          <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={isSaving}>
            <Text style={styles.saveButtonText}>{isSaving ? 'Salvataggio...' : 'Salva'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
*/