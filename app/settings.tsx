import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../contexts/theme'; // Importa l'hook useTheme dal contesto

// Questo componente rappresenta la pagina delle impostazioni.
export default function SettingsPage() {
  const { theme, setTheme, themeName } = useTheme();
  const router = useRouter();

  // Stili del componente che usano i valori del tema
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: theme.colors.background,
    },
    title: {
      fontSize: theme.typography.fontSizes.large,
      fontWeight: theme.typography.fontWeights.bold,
      color: theme.colors.text,
      marginBottom: 20,
    },
    themeContainer: {
      padding: 10,
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 5,
    },
    subtitle: {
      fontSize: theme.typography.fontSizes.medium,
      fontWeight: theme.typography.fontWeights.bold,
      color: theme.colors.text,
      marginBottom: 10,
    },
    themeOption: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 15,
    },
    optionText: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSizes.medium,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: theme.colors.text,
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkboxSelected: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    checkmark: {
      color: theme.colors.headerText,
      fontSize: 18,
    },
    saveButtonContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      marginTop: 20,
    },
    saveButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 15,
      paddingHorizontal: 50,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5,
    },
    saveButtonText: {
      color: theme.colors.headerText, // Corretto per usare il colore del testo dell'header, visibile in entrambi i temi
      fontSize: theme.typography.fontSizes.medium,
      fontWeight: theme.typography.fontWeights.bold,
    },
  });

  // Funzione per gestire il cambio tema
  const handleThemeChange = (selectedTheme: 'light' | 'dark' | 'custom') => {
    setTheme(selectedTheme);
    // Se l'utente seleziona un tema personalizzato, naviga alla pagina di personalizzazione
    if (selectedTheme === 'custom') {
      router.push('/theme-settings'); // Aggiornato il percorso
    }
  };

  const handleSave = () => {
    // TODO: Inserisci qui la logica per salvare il tema selezionato
    // su un un dispositivo (es. AsyncStorage) o su un backend (es. Appwrite)
    console.log('Salvataggio del tema:', themeName);
    router.back(); // Torna alla schermata precedente
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Impostazioni</Text>
      <View style={styles.themeContainer}>
        <Text style={styles.subtitle}>Tema dell&apos;App</Text>

        {/* Opzione Tema Chiaro */}
        <TouchableOpacity
          style={styles.themeOption}
          onPress={() => handleThemeChange('light')}
        >
          <Text style={styles.optionText}>Tema chiaro</Text>
          <View style={[styles.checkbox, themeName === 'light' && styles.checkboxSelected]}>
            {themeName === 'light' && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </TouchableOpacity>

        {/* Opzione Tema Scuro */}
        <TouchableOpacity
          style={styles.themeOption}
          onPress={() => handleThemeChange('dark')}
        >
          <Text style={styles.optionText}>Tema scuro</Text>
          <View style={[styles.checkbox, themeName === 'dark' && styles.checkboxSelected]}>
            {themeName === 'dark' && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </TouchableOpacity>

        {/* Opzione Tema Personalizzato con navigazione */}
        <TouchableOpacity
          style={styles.themeOption}
          onPress={() => handleThemeChange('custom')} // Cambiato a 'custom'
        >
          <Text style={styles.optionText}>Scelto da me</Text>
          <View style={[styles.checkbox, themeName === 'custom' && styles.checkboxSelected]}>
            {themeName === 'custom' && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </TouchableOpacity>

      </View>
      <View style={styles.saveButtonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Salva</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
