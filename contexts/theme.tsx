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
      large: number;
      medium: number;
      small: number;
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

// Determina il colore del testo (bianco o nero) che contrasta meglio con un dato colore di sfondo
const getContrastColor = (hexcolor: string) => {
  const { r, g, b } = hexToRgb(hexcolor);
  // Calcola la luminanza relativa
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

// Temi predefiniti
export const lightTheme: Theme = {
  colors: {
    primary: '#6200EE',
    background: '#F0F2F5',
    text: '#000000',
    textSecondary: '#666666',
    headerBackground: '#6200EE',
    headerText: '#FFFFFF',
    tabBarBackground: '#FFFFFF',
    tabBarActive: '#6200EE',
    tabBarInactive: '#999999',
    cardBackground: '#F0F0F0',
    cardBorder: '#E0E0E0',
  },
  typography: {
    fontSizes: {
      large: 24,
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
    primary: '#BB86FC',
    background: '#121212',
    text: '#FFFFFF',
    textSecondary: '#888888',
    headerBackground: '#1E1E1E',
    headerText: '#BB86FC',
    tabBarBackground: '#1E1E1E',
    tabBarActive: '#BB86FC',
    tabBarInactive: '#888888',
    cardBackground: '#2A2A2A',
    cardBorder: '#3A3A3A',
  },
  typography: {
    fontSizes: {
      large: 24,
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
  themeName: 'light' | 'dark' | 'custom'; // Semplificato a 3 temi
  setTheme: (name: 'light' | 'dark' | 'custom') => void; // Semplificato a 3 temi
  setCustomColors: (colors: CustomColors) => void; // Un'unica funzione per i colori personalizzati
  customColors: CustomColors; // Un unico stato per i colori personalizzati
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

  // Unico stato per i colori personalizzati
  const [customColors, setCustomColors] = useState<CustomColors>({
    primary: lightTheme.colors.primary,
    background: lightTheme.colors.background,
    text: lightTheme.colors.text,
  });
  
  // Funzione che aggiorna il tema corrente in base al nome, avvolta in useCallback
  const applyTheme = useCallback((name: 'light' | 'dark' | 'custom') => {
    let newTheme: Theme;
    switch (name) {
      case 'light':
        newTheme = lightTheme;
        break;
      case 'dark':
        newTheme = darkTheme;
        break;
      case 'custom':
        // Deriviamo tutti i colori del tema dai colori personalizzati scelti dall'utente
        const derivedColors = {
          primary: customColors.primary,
          background: customColors.background,
          text: customColors.text,
          // Deriviamo colori secondari per coerenza
          textSecondary: getContrastColor(customColors.background) === '#FFFFFF'
                         ? lightenDarkenColor(customColors.text, 50)  // Più chiaro per sfondi scuri
                         : lightenDarkenColor(customColors.text, -50), // Più scuro per sfondi chiari
          cardBackground: lightenDarkenColor(customColors.background, getContrastColor(customColors.background) === '#FFFFFF' ? 10 : -10),
          cardBorder: lightenDarkenColor(customColors.background, getContrastColor(customColors.background) === '#FFFFFF' ? 20 : -20),
          headerBackground: customColors.primary,
          headerText: getContrastColor(customColors.primary),
          tabBarBackground: lightenDarkenColor(customColors.background, getContrastColor(customColors.background) === '#FFFFFF' ? 5 : -5),
          tabBarActive: customColors.primary,
          tabBarInactive: lightenDarkenColor(customColors.text, getContrastColor(customColors.background) === '#FFFFFF' ? 30 : -30),
        };
        newTheme = {
          ...lightTheme, // Partiamo da un tema base per ereditare tipografia, ecc.
          colors: derivedColors,
        };
        break;
      default:
        newTheme = lightTheme;
        break;
    }
    setCurrentTheme(newTheme);
  }, [customColors]); // applyTheme dipende solo da customColors ora.

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
    setCustomColors, // Unica funzione per impostare i colori personalizzati
    customColors, // Unico stato per i colori personalizzati
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
