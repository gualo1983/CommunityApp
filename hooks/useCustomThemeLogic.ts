import { useEffect, useState } from "react";

import { getContrastRatio, lightTheme, useTheme } from "../contexts/theme";

export const useCustomThemeLogic = () => {
  const { customColors, setCustomColors, setTheme } = useTheme();

  const [selectedPrimaryColor, setSelectedPrimaryColor] = useState(
    customColors.primary || lightTheme.colors.primary,
  );
  const [selectedBackgroundColor, setSelectedBackgroundColor] = useState(
    customColors.background || lightTheme.colors.background,
  );
  const [selectedTextColor, setSelectedTextColor] = useState(
    customColors.text || lightTheme.colors.text,
  );

  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  useEffect(() => {
    setSelectedPrimaryColor(customColors.primary);
    setSelectedBackgroundColor(customColors.background);
    setSelectedTextColor(customColors.text);
  }, [customColors]);

  useEffect(() => {
    // 1. Controlla il rapporto di contrasto tra testo e sfondo
    const contrastRatioBackground = getContrastRatio(
      selectedTextColor,
      selectedBackgroundColor,
    );

    // 2. Aggiungi il controllo tra testo e colore primario
    const contrastRatioPrimary = getContrastRatio(
      selectedTextColor,
      selectedPrimaryColor,
    );

    // 3. Controlla il tipo di colore
    const isPrimaryValid = /^#([0-9A-Fa-f]{3}){1,2}$/.test(
      selectedPrimaryColor,
    );
    const isBackgroundValid = /^#([0-9A-Fa-f]{3}){1,2}$/.test(
      selectedBackgroundColor,
    );
    const isTextValid = /^#([0-9A-Fa-f]{3}){1,2}$/.test(selectedTextColor);

    // 4. Imposta il messaggio di validazione e abilita il salvataggio
    if (!isPrimaryValid || !isBackgroundValid || !isTextValid) {
      setValidationMessage("Tutti i colori devono essere in formato HEX.");
      setIsSaveEnabled(false);
    } else if (contrastRatioBackground < 4.5) {
      setValidationMessage(
        "Contrasto del testo insufficiente. Scegli colori con un rapporto di almeno 4.5.",
      );
      setIsSaveEnabled(false);
    } else if (contrastRatioPrimary < 4.5) {
      // Aggiunto il nuovo controllo
      setValidationMessage(
        "Il testo non è leggibile sul colore primario. Aumenta il contrasto.",
      );
      setIsSaveEnabled(false);
    } else {
      setValidationMessage("");
      setIsSaveEnabled(true);
    }
  }, [selectedPrimaryColor, selectedBackgroundColor, selectedTextColor]);

  const handleSave = () => {
    if (isSaveEnabled) {
      setCustomColors({
        primary: selectedPrimaryColor,
        background: selectedBackgroundColor,
        text: selectedTextColor,
      });
      setTheme("custom");
    }
  };

  return {
    selectedPrimaryColor,
    setSelectedPrimaryColor,
    selectedBackgroundColor,
    setSelectedBackgroundColor,
    selectedTextColor,
    setSelectedTextColor,
    isSaveEnabled,
    validationMessage,
    handleSave,
  };
};

/*
// File: hooks/useCustomThemeLogic.ts

import { useCallback, useEffect, useState } from 'react';
import { getContrastRatio, useTheme } from '../contexts/theme';

export const useCustomThemeLogic = () => {
  const { customColors, setCustomColors, setTheme, theme } = useTheme();

  // ✨ Modifica qui: inizializza con un colore di fallback valido se customColors è undefined.
  const [selectedPrimaryColor, setSelectedPrimaryColor] = useState(customColors.primary || theme.colors.primary);
  const [selectedBackgroundColor, setSelectedBackgroundColor] = useState(customColors.background || theme.colors.background);
  const [selectedTextColor, setSelectedTextColor] = useState(customColors.text || theme.colors.text);
  
  const [isSaveEnabled, setIsSaveEnabled] = useState(true);
  const [validationMessage, setValidationMessage] = useState('');

  // Sincronizza gli stati con i customColors del contesto quando cambiano
  useEffect(() => {
    setSelectedPrimaryColor(customColors.primary);
    setSelectedBackgroundColor(customColors.background);
    setSelectedTextColor(customColors.text);
  }, [customColors]);

  const validateColors = useCallback(() => {
    // ✨ Aggiungi un controllo per assicurarti che i colori non siano undefined prima di chiamare getContrastRatio.
    if (!selectedTextColor || !selectedBackgroundColor || !selectedPrimaryColor) {
        setValidationMessage('I colori non possono essere vuoti.');
        return false;
    }

    const minContrastRatio = 4.5;
    const textBackgroundContrast = getContrastRatio(selectedTextColor, selectedBackgroundColor);
    if (textBackgroundContrast < minContrastRatio) {
      setValidationMessage(`Contrasto insufficiente tra testo e sfondo (${textBackgroundContrast.toFixed(2)}:1). Minimo raccomandato: ${minContrastRatio}:1.`);
      return false;
    }
    const buttonTextPrimaryContrast = getContrastRatio(selectedTextColor, selectedPrimaryColor);
    if (buttonTextPrimaryContrast < minContrastRatio) {
      setValidationMessage(`Contrasto insufficiente tra testo del pulsante e colore primario (${buttonTextPrimaryContrast.toFixed(2)}:1). Minimo raccomandato: ${minContrastRatio}:1.`);
      return false;
    }
    setValidationMessage('');
    return true;
  }, [selectedTextColor, selectedBackgroundColor, selectedPrimaryColor]);

  useEffect(() => {
    const isValid = validateColors();
    setIsSaveEnabled(isValid);
  }, [selectedPrimaryColor, selectedBackgroundColor, selectedTextColor, validateColors]);

  const handleSave = () => {
    if (!isSaveEnabled) {
      console.warn("Tentativo di salvare con colori non validi.");
      return;
    }
    setCustomColors({
      primary: selectedPrimaryColor,
      background: selectedBackgroundColor,
      text: selectedTextColor,
    });
    setTheme('custom');
  };

  return {
    selectedPrimaryColor,
    setSelectedPrimaryColor,
    selectedBackgroundColor,
    setSelectedBackgroundColor,
    selectedTextColor,
    setSelectedTextColor,
    isSaveEnabled,
    validationMessage,
    handleSave,
  };
};
*/
