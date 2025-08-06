import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../contexts/theme'; // Percorso corretto

export default function CustomThemeSettingsPage() {
  const {
    theme,
    themeName,
    setTheme,
    setCustomLightColors,
    setCustomDarkColors,
    customLightColors,
    customDarkColors,
  } = useTheme();
  const router = useRouter();

  // Seleziona i colori personalizzati correnti in base al tema attivo
  const currentCustomColors =
    themeName === 'customLight' ? customLightColors : customDarkColors;

  // Funzione per salvare le personalizzazioni
  const handleSave = () => {
    // Applica il tema personalizzato corrente (light o dark) con i nuovi colori
    if (themeName === 'customLight') {
      setTheme('customLight');
    } else {
      setTheme('customDark');
    }
    router.back(); // Torna alla pagina precedente dopo il salvataggio
  };

  // Funzioni per impostare i colori personalizzati
  const setPrimaryColor = (color: string) => {
    if (themeName === 'customLight') {
      setCustomLightColors({ ...customLightColors, primary: color });
    } else {
      setCustomDarkColors({ ...customDarkColors, primary: color });
    }
  };

  const setBackgroundColor = (color: string) => {
    if (themeName === 'customLight') {
      setCustomLightColors({ ...customLightColors, background: color });
    } else {
      setCustomDarkColors({ ...customDarkColors, background: color });
    }
  };

  const setTextColor = (color: string) => {
    if (themeName === 'customLight') {
      setCustomLightColors({ ...customLightColors, text: color });
    } else {
      setCustomDarkColors({ ...customDarkColors, text: color });
    }
  };

  // Palette di colori strutturata con diverse tonalità
  const colorPalette = [
    {
      name: 'Blu',
      shades: [
        { hex: '#6495ED', label: 'Chiaro' },
        { hex: '#4169E1', label: 'Normale' },
        { hex: '#0000CD', label: 'Scuro' }
      ]
    },
    {
      name: 'Rosso',
      shades: [
        { hex: '#FA8072', label: 'Chiaro' },
        { hex: '#FF4500', label: 'Normale' },
        { hex: '#B22222', label: 'Scuro' }
      ]
    },
    {
      name: 'Verde',
      shades: [
        { hex: '#90EE90', label: 'Chiaro' },
        { hex: '#32CD32', label: 'Normale' },
        { hex: '#228B22', label: 'Scuro' }
      ]
    },
    {
      name: 'Giallo',
      shades: [
        { hex: '#FFFFE0', label: 'Chiaro' },
        { hex: '#FFD700', label: 'Normale' },
        { hex: '#DAA520', label: 'Scuro' }
      ]
    },
    {
      name: 'Viola',
      shades: [
        { hex: '#E6E6FA', label: 'Chiaro' },
        { hex: '#8A2BE2', label: 'Normale' },
        { hex: '#4B0082', label: 'Scuro' }
      ]
    },
    {
      name: 'Grigio',
      shades: [
        { hex: '#D3D3D3', label: 'Chiaro' },
        { hex: '#808080', label: 'Normale' },
        { hex: '#696969', label: 'Scuro' }
      ]
    },
    {
      name: 'Neutri',
      shades: [
        { hex: '#FFFFFF', label: 'Bianco' },
        { hex: '#F5F5DC', label: 'Beige' },
        { hex: '#000000', label: 'Nero' }
      ]
    },
    {
      name: 'Arancione',
      shades: [
        { hex: '#FFDAB9', label: 'Chiaro' },
        { hex: '#FFA500', label: 'Normale' },
        { hex: '#FF8C00', label: 'Scuro' }
      ]
    },
    {
      name: 'Marrone',
      shades: [
        { hex: '#D2B48C', label: 'Chiaro' },
        { hex: '#A0522D', label: 'Normale' },
        { hex: '#8B4513', label: 'Scuro' }
      ]
    }
  ];
  
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
    section: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: theme.typography.fontSizes.medium,
      fontWeight: theme.typography.fontWeights.bold,
      color: theme.colors.text,
      marginBottom: 10,
    },
    // Contenitore per le righe di gruppi di colori (per 3 colonne di gruppi)
    colorGroupsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    colorGroupContainer: {
      marginBottom: 15,
      padding: 10,
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
      width: '32%', // Per avere 3 colonne con un po' di margine
      marginHorizontal: '0.6%', // Margine per separare le colonne
    },
    colorGroupName: {
      fontSize: theme.typography.fontSizes.small,
      fontWeight: theme.typography.fontWeights.bold,
      color: theme.colors.textSecondary,
      marginBottom: 8,
      textAlign: 'center', // Centra il nome del gruppo
    },
    paletteContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center', // Centra i campioni di colore all'interno del gruppo
    },
    colorSwatch: {
      width: 38, // Circa 1cm
      height: 38, // Circa 1cm
      borderRadius: 19, // Per renderlo un cerchio
      margin: 4, // Spazio tra i campioni
      borderWidth: 2,
      borderColor: 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
    },
    selectedSwatch: {
      borderColor: theme.colors.primary, // Usa il colore primario del tema per l'indicatore di selezione
    },
    swatchLabel: {
      fontSize: 8, // Dimensione più piccola per la label
      color: '#FFFFFF', // Colore del testo sulla swatch
      fontWeight: 'bold',
      textShadowColor: 'rgba(0, 0, 0, 0.75)', // Ombra per migliore leggibilità
      textShadowOffset: { width: -1, height: 1 },
      textShadowRadius: 2,
    },
    previewContainer: {
      padding: 20,
      borderRadius: 10,
      marginTop: 20,
      alignItems: 'center',
      backgroundColor: currentCustomColors.background, // Sfondo della preview
      borderColor: theme.colors.cardBorder, // Bordo della preview
      borderWidth: 1,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 5,
    },
    previewText: {
      color: currentCustomColors.text, // Testo della preview
      fontSize: theme.typography.fontSizes.medium,
      fontWeight: theme.typography.fontWeights.bold,
    },
    previewButton: {
      backgroundColor: currentCustomColors.primary, // Pulsante nella preview
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
      marginTop: 10,
    },
    previewButtonText: {
      color: currentCustomColors.text, // Modificato per usare il colore del testo personalizzato
      fontWeight: 'bold',
    },
    saveButton: {
      backgroundColor: theme.colors.primary,
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 30,
      width: '60%', // Riduci la larghezza del pulsante
      alignSelf: 'center', // Centra il pulsante
    },
    saveButtonText: {
      color: theme.colors.headerText,
      fontWeight: 'bold',
      fontSize: theme.typography.fontSizes.medium,
    },
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Personalizza Tema</Text>

      {/* Sezione per la scelta del colore di sfondo */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Colore di Sfondo</Text>
        <View style={styles.colorGroupsRow}> {/* Nuovo contenitore per le 3 colonne */}
          {colorPalette.map((colorGroup) => (
            <View key={colorGroup.name} style={styles.colorGroupContainer}>
              <Text style={styles.colorGroupName}>{colorGroup.name}</Text>
              <View style={styles.paletteContainer}>
                {colorGroup.shades.map((shade) => (
                  <TouchableOpacity
                    key={shade.hex}
                    style={[
                      styles.colorSwatch,
                      { backgroundColor: shade.hex },
                      currentCustomColors.background === shade.hex && styles.selectedSwatch,
                    ]}
                    onPress={() => setBackgroundColor(shade.hex)}
                  >
                    {/* Puoi mostrare un'iniziale o un'indicazione sulla swatch */}
                    <Text style={styles.swatchLabel}>{shade.label.charAt(0)}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Sezione per la scelta del colore primario */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Colore Primario</Text>
        <View style={styles.colorGroupsRow}> {/* Nuovo contenitore per le 3 colonne */}
          {colorPalette.map((colorGroup) => (
            <View key={colorGroup.name} style={styles.colorGroupContainer}>
              <Text style={styles.colorGroupName}>{colorGroup.name}</Text>
              <View style={styles.paletteContainer}>
                {colorGroup.shades.map((shade) => (
                  <TouchableOpacity
                    key={shade.hex}
                    style={[
                      styles.colorSwatch,
                      { backgroundColor: shade.hex },
                      currentCustomColors.primary === shade.hex && styles.selectedSwatch,
                    ]}
                    onPress={() => setPrimaryColor(shade.hex)}
                  >
                    <Text style={styles.swatchLabel}>{shade.label.charAt(0)}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </View>
      </View>
      
      {/* Sezione per la scelta del colore del testo */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Colore Testo</Text>
        <View style={styles.colorGroupsRow}> {/* Nuovo contenitore per le 3 colonne */}
          {colorPalette.map((colorGroup) => (
            <View key={colorGroup.name} style={styles.colorGroupContainer}>
              <Text style={styles.colorGroupName}>{colorGroup.name}</Text>
              <View style={styles.paletteContainer}>
                {colorGroup.shades.map((shade) => (
                  <TouchableOpacity
                    key={shade.hex}
                    style={[
                      styles.colorSwatch,
                      { backgroundColor: shade.hex },
                      currentCustomColors.text === shade.hex && styles.selectedSwatch,
                    ]}
                    onPress={() => setTextColor(shade.hex)}
                  >
                    <Text style={styles.swatchLabel}>{shade.label.charAt(0)}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Preview */}
      <View style={styles.previewContainer}>
        <Text style={styles.previewText}>Anteprima del testo</Text>
        <TouchableOpacity style={styles.previewButton}>
          <Text style={styles.previewButtonText}>Pulsante di esempio</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Salva Personalizzazioni</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
