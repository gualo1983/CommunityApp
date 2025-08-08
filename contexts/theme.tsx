import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

// Definisci la struttura del tuo tema
export interface Theme {
  colors: {
    primary: string;
    background: string;
    text: string;
    textSecondary: string;
    headerBackground: string;
    headerText: string;
    tabBarBackground: string;
    tabBarActive: string;
    tabBarInactive: string;
    cardBackground: string;
    cardBorder: string;
  };
  typography: {
    fontSizes: {
      default: number; // Dimensione predefinita per il testo generale
      small: number;
      medium: number;
      large: number;
    };
    fontWeights: {
      bold: 'bold';
      normal: 'normal';
    };
  };
}

// Interfaccia per i colori personalizzati che l'utente può scegliere
interface CustomColors {
  primary: string;
  background: string;
  text: string;
}

// Funzioni di utilità per la manipolazione dei colori
// Converte HEX in RGB
const hexToRgb = (hex: string) => {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
};

// Schiarisce o scurisce un colore HEX
const lightenDarkenColor = (col: string, amt: number) => {
  let usePound = false;
  if (col[0] === "#") {
    col = col.slice(1);
    usePound = true;
  }
  const num = parseInt(col, 16);
  let r = (num >> 16) + amt;
  if (r > 255) r = 255;
  else if (r < 0) r = 0;

  let b = ((num >> 8) & 0x00FF) + amt;
  if (b > 255) b = 255;
  else if (b < 0) b = 0;

  let g = (num & 0x0000FF) + amt;
  if (g > 255) g = 255;
  else if (g < 0) g = 0;

  return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
};

// Calcola la luminanza relativa di un colore HEX (per WCAG)
export const getLuminance = (hexcolor: string) => {
  const { r, g, b } = hexToRgb(hexcolor);
  const sR = r / 255;
  const sG = g / 255;
  const sB = b / 255;

  const R = sR <= 0.03928 ? sR / 12.92 : Math.pow((sR + 0.055) / 1.055, 2.4);
  const G = sG <= 0.03928 ? sG / 12.92 : Math.pow((sG + 0.055) / 1.055, 2.4);
  const B = sB <= 0.03928 ? sB / 12.92 : Math.pow((sB + 0.055) / 1.055, 2.4);

  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
};

// Calcola il rapporto di contrasto tra due colori HEX (per WCAG)
export const getContrastRatio = (color1: string, color2: string) => {
  const L1 = getLuminance(color1);
  const L2 = getLuminance(color2);

  const brighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);

  return (brighter + 0.05) / (darker + 0.05);
};


// Temi predefiniti
export const lightTheme: Theme = {
  colors: {
    primary: '#004d40', // Verde scuro, usato per bottoni e accenti
    background: '#e0f2f1', // Sfondo leggermente verdastro
    text: '#212121', // Testo scuro per massima leggibilità
    textSecondary: '#616161', // Un grigio scuro per il testo secondario
    headerBackground: '#004d40', // Lo stesso verde scuro del primary
    headerText: '#FFFFFF', // Testo bianco su sfondo scuro
    tabBarBackground: '#FFFFFF', // Sfondo della tab bar chiaro
    tabBarActive: '#004d40', // Verde scuro per l'icona attiva
    tabBarInactive: '#9e9e9e', // Grigio per le icone inattive
    cardBackground: '#f5f5f5', // Un grigio molto chiaro per le card
    cardBorder: '#e0e0e0', // Un bordo leggero per le card
  },
  typography: {
    // Le dimensioni del carattere 'default', 'small', 'medium', 'large'
    // verranno impostate dinamicamente in applyTheme
    fontSizes: {
      default: 16, // Valore placeholder, verrà sovrascritto
      large: 20,
      medium: 16,
      small: 12,
    },
    fontWeights: {
      bold: 'bold',
      normal: 'normal',
    },
  },
};

export const darkTheme: Theme = {
  colors: {
    primary: '#004d40', // Nuovo colore primario scuro. Garantisce un buon contrasto con il testo chiaro.
    background: '#212121', // Sfondo scuro quasi nero
    text: '#e0f2f1', // Un bianco sporco per il testo principale
    textSecondary: '#9e9e9e', // Un grigio chiaro per il testo secondario
    headerBackground: '#263238', // Un grigio molto scuro per l'header
    headerText: '#e0f2f1', // Testo chiaro su sfondo scuro
    tabBarBackground: '#263238', // Sfondo della tab bar scuro
    tabBarActive: '#80cbc4', // Un verde chiaro come accento per l'icona attiva
    tabBarInactive: '#616161', // Grigio scuro per le icone inattive
    cardBackground: '#424242', // Un grigio scuro per le card
    cardBorder: '#616161', // Un bordo più scuro per le cardù scuro per le card
  },
  typography: {
    // Le dimensioni del carattere 'default', 'small', 'medium', 'large'
    // verranno impostate dinamicamente in applyTheme
    fontSizes: {
      default: 16, // Valore placeholder, verrà sovrascritto
      large: 20,
      medium: 16,
      small: 12,
    },
    fontWeights: {
      bold: 'bold',
      normal: 'normal',
    },
  },
};

// Definiamo il tipo di context che esporteremo
interface ThemeContextType {
  theme: Theme;
  themeName: 'light' | 'dark' | 'custom';
  setTheme: (name: 'light' | 'dark' | 'custom') => void;
  setCustomColors: (colors: CustomColors) => void;
  customColors: CustomColors;
  // Nuove proprietà per la gestione della dimensione del carattere
  fontSizeOption: 'small' | 'medium' | 'large';
  setFontSizeOption: (option: 'small' | 'medium' | 'large') => void;
}

// Creiamo un contesto con un valore di default
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Props per il ThemeProvider
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeName, setThemeName] = useState<'light' | 'dark' | 'custom'>('light');
  const [currentTheme, setCurrentTheme] = useState<Theme>(lightTheme);
  // Nuovo stato per la dimensione del carattere scelta dall'utente
  const [fontSizeOption, setFontSizeOption] = useState<'small' | 'medium' | 'large'>('medium');

  // Unico stato per i colori personalizzati
  const [customColors, setCustomColors] = useState<CustomColors>({
    primary: lightTheme.colors.primary,
    background: lightTheme.colors.background,
    text: lightTheme.colors.text,
  });
  
  // Funzione che aggiorna il tema corrente in base al nome e alla dimensione del carattere
  const applyTheme = useCallback((name: 'light' | 'dark' | 'custom') => {
    let newTheme: Theme;
    let defaultSize: number;
    let smallSize: number;
    let mediumSize: number;
    let largeSize: number;

    // Definisci le dimensioni del carattere in base all'opzione scelta
    if (fontSizeOption === 'small') {
      defaultSize = 12; // Carattere base più piccolo
      smallSize = 10;
      mediumSize = 12;
      largeSize = 16;
    } else if (fontSizeOption === 'large') {
      defaultSize = 20; // Carattere base più grande
      smallSize = 16;
      mediumSize = 20;
      largeSize = 24;
    } else { // 'medium' come default
      defaultSize = 16; // Carattere base medio
      smallSize = 12;
      mediumSize = 16;
      largeSize = 20;
    }

    // Crea l'oggetto fontSizes dinamico
    const dynamicFontSizes = {
      default: defaultSize,
      small: smallSize,
      medium: mediumSize,
      large: largeSize,
    };

    switch (name) {
      case 'light':
        newTheme = {
          ...lightTheme,
          typography: {
            ...lightTheme.typography,
            fontSizes: dynamicFontSizes, // Applica le dimensioni dinamiche
          },
        };
        break;
      case 'dark':
        newTheme = {
          ...darkTheme,
          typography: {
            ...darkTheme.typography,
            fontSizes: dynamicFontSizes, // Applica le dimensioni dinamiche
          },
        };
        break;
      case 'custom':
        // Deriviamo tutti i colori del tema dai colori personalizzati scelti dall'utente
        const derivedColors = {
          primary: customColors.primary,
          background: customColors.background,
          text: customColors.text,
          textSecondary: lightenDarkenColor(customColors.text, getLuminance(customColors.text) > 0.5 ? -50 : 50),
          cardBackground: lightenDarkenColor(customColors.background, getLuminance(customColors.background) > 0.5 ? -10 : 10),
          cardBorder: lightenDarkenColor(customColors.background, getLuminance(customColors.background) > 0.5 ? -20 : 20),
          headerBackground: customColors.primary,
          headerText: customColors.text, // headerText segue direttamente customColors.text
          tabBarBackground: lightenDarkenColor(customColors.background, getLuminance(customColors.background) > 0.5 ? -5 : 5),
          tabBarActive: customColors.primary,
          tabBarInactive: customColors.text, // tabBarInactive segue direttamente customColors.text
        };
        newTheme = {
          ...lightTheme, // Partiamo da un tema base per ereditare tipografia, ecc.
          colors: derivedColors,
          typography: {
            ...lightTheme.typography,
            fontSizes: dynamicFontSizes, // Applica le dimensioni dinamiche
          },
        };
        break;
      default:
        newTheme = lightTheme;
        break;
    }
    setCurrentTheme(newTheme);
  }, [customColors, fontSizeOption]); // applyTheme dipende da customColors e fontSizeOption

  // Funzione esposta che cambia solo il nome del tema
  const setTheme = (name: 'light' | 'dark' | 'custom') => {
    setThemeName(name);
  };

  // Aggiorna il tema corrente ogni volta che themeName o i colori personalizzati cambiano
  useEffect(() => {
    applyTheme(themeName);
  }, [themeName, applyTheme]); // Dipendenze corrette: themeName e applyTheme

  const value = {
    theme: currentTheme,
    themeName,
    setTheme,
    setCustomColors,
    customColors,
    fontSizeOption, // Esponi lo stato della dimensione del carattere
    setFontSizeOption, // Esponi la funzione per impostare la dimensione del carattere
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook per usare il tema in qualsiasi componente
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
