import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../contexts/AuthProvider';
import { useSupabase } from '../contexts/SupabaseProvider';
import { useTheme } from '../contexts/theme';

export const useSettingsLogic = () => {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const { setTheme, themeName, fontSizeOption, setFontSizeOption, customColors } = useTheme();
  const router = useRouter();

  const [isSaving, setIsSaving] = useState(false);
  const [isPersonalDataModalVisible, setIsPersonalDataModalVisible] = useState(false);

  const handleThemeChange = async (selectedTheme: 'light' | 'dark' | 'custom') => {
    setTheme(selectedTheme);
    await AsyncStorage.setItem('appTheme', selectedTheme);
    if (selectedTheme === 'custom') {
      router.push('/theme-settings');
    }
  };

  const handleFontSizeChange = async (option: 'small' | 'medium' | 'large') => {
    setFontSizeOption(option);
    await AsyncStorage.setItem('appFontSize', option);
  };

  const handleSave = async () => {
    if (!user) {
      Alert.alert("Errore", "Utente non autenticato. Riprova il login.");
      return;
    }
    
    setIsSaving(true);

    try {
      const currentSettings: {
        themeName: 'light' | 'dark' | 'custom';
        fontSizeOption: 'small' | 'medium' | 'large';
        customColors?: {
          primary: string;
          background: string;
          text: string;
        };
      } = {
        themeName,
        fontSizeOption,
      };

      if (themeName === 'custom') {
        currentSettings.customColors = customColors;
        // Salva anche i colori personalizzati in AsyncStorage
        await AsyncStorage.setItem('customColors', JSON.stringify(customColors));
      }
      
      const { error: updateError } = await supabase
        .from('utenti')
        .update({ impostazioni_app: currentSettings })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      console.log('Impostazioni dell\'app salvate con successo:', currentSettings);
      Alert.alert("Successo", "Le impostazioni sono state salvate!");
      router.replace('/');
    } catch (err) {
      console.error('Errore nel salvataggio delle impostazioni:', err);
      Alert.alert("Errore", "Si è verificato un errore nel salvataggio. Riprova.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenPersonalDataModal = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    setIsPersonalDataModalVisible(true);
  };

  const handleClosePersonalDataModal = () => {
    setIsPersonalDataModalVisible(false);
  };

  return {
    isSaving,
    themeName,
    fontSizeOption,
    isPersonalDataModalVisible,
    handleThemeChange,
    handleFontSizeChange,
    handleSave,
    handleOpenPersonalDataModal,
    handleClosePersonalDataModal,
  };
};




/*
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../contexts/AuthProvider';
import { useSupabase } from '../contexts/SupabaseProvider';
import { useTheme } from '../contexts/theme';

export const useSettingsLogic = () => {
  const { user } = useAuth(); // Usiamo 'user' per verificare l'autenticazione
  const { supabase } = useSupabase();
  const { setTheme, themeName, fontSizeOption, setFontSizeOption } = useTheme();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPersonalDataModalVisible, setIsPersonalDataModalVisible] = useState(false);

  // Carica le impostazioni utente all'avvio della pagina
  useEffect(() => {
    const fetchSettings = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
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

  const handleOpenPersonalDataModal = () => {
    // Verifica se l'utente è autenticato usando la variabile 'user'
    if (!user) {
      // Se non è autenticato, reindirizza alla pagina di login/registrazione
      router.push('/login'); // Sostituisci con il percorso corretto
      return;
    }
    // Se è autenticato, apri il modale
    setIsPersonalDataModalVisible(true);
  };

  const handleClosePersonalDataModal = () => {
    setIsPersonalDataModalVisible(false);
  };

  return {
    isLoading,
    isSaving,
    themeName,
    fontSizeOption,
    isPersonalDataModalVisible,
    handleThemeChange,
    handleFontSizeChange,
    handleSave,
    handleOpenPersonalDataModal,
    handleClosePersonalDataModal,
  };
};

*/