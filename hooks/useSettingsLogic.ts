import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../contexts/AuthProvider';
import { useSupabase } from '../contexts/SupabaseProvider';
import { useTheme } from '../contexts/theme';

export const useSettingsLogic = () => {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const { setTheme, themeName, fontSizeOption, setFontSizeOption, customColors, setCustomColors } = useTheme();
  const router = useRouter();

    const [isSaving, setIsSaving] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isPersonalDataModalVisible, setIsPersonalDataModalVisible] = useState(false);

  const handleThemeChange = (selectedTheme: 'light' | 'dark' | 'custom') => {
    setTheme(selectedTheme);
    if (selectedTheme === 'custom') {
      router.push('/theme-settings');
    }
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
      const currentSettings = {
        themeName,
        fontSizeOption,
        customColors: themeName === 'custom' ? customColors : undefined,
      };
      
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

  const handleImportPreferences = async () => {
    if (!user) {
      Alert.alert("Errore", "Utente non autenticato. Riprova il login.");
      return;
    }

    setIsImporting(true);

    try {
      const { data, error } = await supabase
        .from('utenti')
        .select('impostazioni_app')
        .eq('id', user.id)
        .single();

      if (error) {
        throw error;
      }

      const savedSettings = data?.impostazioni_app;

      if (savedSettings) {
        if (savedSettings.themeName) {
          setTheme(savedSettings.themeName);
        }

        if (savedSettings.fontSizeOption) {
          setFontSizeOption(savedSettings.fontSizeOption);
        }

        if (savedSettings.customColors) {
          setCustomColors(savedSettings.customColors);
          if (savedSettings.themeName !== 'custom') {
            setTheme('custom');
          }
        }

        Alert.alert("Successo", "Le tue preferenze sono state importate!");
      } else {
        Alert.alert("Attenzione", "Nessuna preferenza salvata trovata.");
      }
    } catch (err) {
      console.error('Errore nell\'importazione delle preferenze:', err);
      Alert.alert(
        "Errore",
        "Si è verificato un errore durante l\'importazione. Riprova più tardi."
      );
    } finally {
      setIsImporting(false);
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
    isImporting,
    themeName,
    fontSizeOption,
    isPersonalDataModalVisible,
    handleThemeChange,
    handleFontSizeChange,
    handleSave,
    handleImportPreferences,
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