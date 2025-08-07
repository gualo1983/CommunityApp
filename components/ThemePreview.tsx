// File: components/ThemePreview.tsx

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../contexts/theme';

interface ThemePreviewProps {
  selectedPrimaryColor: string;
  selectedBackgroundColor: string;
  selectedTextColor: string;
}

const ThemePreview = ({ selectedPrimaryColor, selectedBackgroundColor, selectedTextColor }: ThemePreviewProps) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    previewButton: {
      backgroundColor: selectedPrimaryColor,
      borderRadius: 8,
      marginTop: 10,
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    previewButtonText: {
      color: selectedTextColor,
      fontWeight: 'bold',
    },
    previewContainer: {
      alignItems: 'center',
      backgroundColor: selectedBackgroundColor,
      borderColor: theme.colors.cardBorder,
      borderRadius: 10,
      borderWidth: 1,
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      elevation: 5,
      marginTop: 20,
      padding: 20,
    },
    previewText: {
      color: selectedTextColor,
      fontSize: theme.typography.fontSizes.medium,
      marginBottom: 10,
      textAlign: 'center',
    },
    previewTitle: {
      color: selectedTextColor,
      fontSize: theme.typography.fontSizes.large,
      fontWeight: theme.typography.fontWeights.bold,
      marginBottom: 5,
    },
  });

  return (
    <View style={styles.previewContainer}>
      <Text style={styles.previewTitle}>Titolo di prova</Text>
      <Text style={styles.previewText}>
        Questo è un esempio di testo per mostrare come i colori scelti si adattano all&apos;applicazione.
        Puoi personalizzare il colore di sfondo, il colore primario e il colore del testo.
      </Text>
      <TouchableOpacity style={styles.previewButton}>
        <Text style={styles.previewButtonText}>Pulsante di esempio</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ThemePreview;