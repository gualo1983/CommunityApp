// /components/SettingsPageUi.tsx
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { useAuth } from '../contexts/AuthProvider';
import { useTheme } from '../contexts/theme';
import { useSettingsLogic } from '../hooks/useSettingsLogic';
import SettingsOption from './SettingsOption';

export const SettingsPageUI = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  useWindowDimensions();

  const {
    isSaving,
    isImporting,
    themeName,
    fontSizeOption,
    handleThemeChange,
    handleFontSizeChange,
    handleSave,
    handleImportPreferences,
  } = useSettingsLogic();

  const styles = StyleSheet.create({
    // Il contenitore principale occupa l'intera pagina e imposta lo sfondo
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    // Lo stile del contenitore del contenuto di ScrollView
    contentContainer: {
      flexGrow: 1, // Permette a ScrollView di espandersi
      alignItems: 'center', // Centra orizzontalmente tutto il contenuto
      padding: 20,
    },
    // Questo è il contenitore della card principale, ora centrato
    mainCardContainer: {
      width: '100%',
      maxWidth: 400, // Limite per schermi grandi
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 15,
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
      elevation: 8,
      padding: 20,
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
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      elevation: 5,
      marginBottom: 20,
      padding: 15,
      width: '100%',
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
    importButton: {
      backgroundColor: theme.colors.primary,
      padding: 15,
      borderRadius: 10,
      marginTop: 10,
      alignItems: 'center',
    },
    importButtonText: {
      color: theme.colors.headerText,
      fontSize: theme.typography.fontSizes.medium,
      fontWeight: theme.typography.fontWeights.bold,
    },
  });


  const handleOpenPersonalDataPage = () => {
    router.push('/PersonalDataPage');
  };

  return (
    <ScrollView contentContainerStyle={styles.contentContainer} style={styles.container}>
      <View style={styles.mainCardContainer}>
        <View style={styles.sectionContainer}>
          <Text style={styles.subtitle}>Informazioni Personali</Text>
          <TouchableOpacity
            style={styles.personalDataButton}
            onPress={handleOpenPersonalDataPage}
          >
            <Text style={styles.personalDataButtonText}>Modifica Dati</Text>
          </TouchableOpacity>
        </View>

        {user && (
          <View style={styles.sectionContainer}>
            <Text style={styles.subtitle}>Importa Preferenze</Text>
            <TouchableOpacity
              style={[styles.importButton, { opacity: isImporting ? 0.7 : 1 }]}
              onPress={handleImportPreferences}
              disabled={isImporting}
            >
              <Text style={styles.importButtonText}>
                {isImporting ? 'Importazione...' : 'Importa preferenze salvate'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        
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
    </ScrollView>
  );
};


/*
import { useRouter } from 'expo-router';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions
} from 'react-native';
import { useTheme } from '../contexts/theme';
import { useSettingsLogic } from '../hooks/useSettingsLogic';
import SettingsOption from './SettingsOption';

export const SettingsPageUI = () => {
  const { theme } = useTheme();
  const router = useRouter(); // Importa il router per la navigazione
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;

  // Usa il custom hook per ottenere tutta la logica
  const {
   // isLoading,
    isSaving,
    themeName,
    fontSizeOption,
    handleThemeChange,
    handleFontSizeChange,
    handleSave,
  } = useSettingsLogic();

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
/*
  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }
*/
/*
  const handleOpenPersonalDataPage = () => {
    router.push('/PersonalDataPage'); // Reindirizza l'utente alla pagina
  };

  return (
    <View style={styles.container}>
      <View style={isLargeScreen ? styles.popupContainer : styles.fullscreenContainer}>
        <View style={styles.sectionContainer}>
          <Text style={styles.subtitle}>Informazioni Personali</Text>
          <TouchableOpacity
            style={styles.personalDataButton}
            onPress={handleOpenPersonalDataPage}
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
};
/*

/*
import React from 'react';
import {
    ActivityIndicator,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions
} from 'react-native';

import { useTheme } from '../contexts/theme';
import { useSettingsLogic } from '../hooks/useSettingsLogic';
import { PersonalDataForm } from './PersonalDataForm';
import SettingsOption from './SettingsOption';

export const SettingsPageUI = () => {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;

  // Usa il custom hook per ottenere tutta la logica
  const {
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
  } = useSettingsLogic();

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
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
      backgroundColor: theme.colors.background,
      borderRadius: 20,
      padding: 25,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      width: isLargeScreen ? '50%' : '90%',
    },
    closeButton: {
      position: 'absolute',
      top: 10,
      right: 10,
    },
    closeButtonText: {
      fontSize: 24,
      color: theme.colors.text,
    }
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
      <View style={isLargeScreen ? styles.popupContainer : styles.fullscreenContainer}>
        <View style={styles.sectionContainer}>
          <Text style={styles.subtitle}>Informazioni Personali</Text>
          <TouchableOpacity
            style={styles.personalDataButton}
            onPress={handleOpenPersonalDataModal}
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
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={isPersonalDataModalVisible}
        onRequestClose={handleClosePersonalDataModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Pressable onPress={handleClosePersonalDataModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>×</Text>
            </Pressable>
            <PersonalDataForm onSaveSuccess={handleClosePersonalDataModal} />
          </View>
        </View>
      </Modal>
    </View>
  );
};
*/