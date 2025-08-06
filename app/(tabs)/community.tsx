import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../contexts/theme'; // Importa l'hook useTheme

const CommunityScreen = () => {
  const { theme } = useTheme(); // Usa l'hook per ottenere il tema corrente

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      // Usa il colore di sfondo dal tema
      backgroundColor: theme.colors.background,
    },
    header: {
      padding: 20,
      // Usa il colore di sfondo dell'header dal tema
      backgroundColor: theme.colors.headerBackground,
      alignItems: 'center',
      justifyContent: 'center',
      borderBottomLeftRadius: 15,
      borderBottomRightRadius: 15,
      // Le ombre sono stili specifici del layout, quindi le manteniamo qui
      // ma possiamo usare i colori del tema se vogliamo
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    headerTitle: {
      // Usa il font size, peso e colore dal tema
      fontSize: theme.typography.fontSizes.large,
      fontWeight: theme.typography.fontWeights.bold,
      color: theme.colors.headerText,
    },
    content: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    placeholderText: {
      // Usa il font size e colore dal tema
      fontSize: theme.typography.fontSizes.medium,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>qui verranno inserite le varie tab delle parrocchie</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.placeholderText}>Qui verranno visualizzate le informazioni della parrocchia.</Text>
      </View>
    </SafeAreaView>
  );
};

export default CommunityScreen;
