// File: hooks/useCustomThemeLogic.ts

import { useCallback, useEffect, useState } from 'react';
import { getContrastRatio, useTheme } from '../contexts/theme';

export const useCustomThemeLogic = () => {
  const { customColors, setCustomColors, setTheme } = useTheme();
  const [selectedPrimaryColor, setSelectedPrimaryColor] = useState(customColors.primary);
  const [selectedBackgroundColor, setSelectedBackgroundColor] = useState(customColors.background);
  const [selectedTextColor, setSelectedTextColor] = useState(customColors.text);
  const [isSaveEnabled, setIsSaveEnabled] = useState(true);
  const [validationMessage, setValidationMessage] = useState('');

  useEffect(() => {
    setSelectedPrimaryColor(customColors.primary);
    setSelectedBackgroundColor(customColors.background);
    setSelectedTextColor(customColors.text);
  }, [customColors]);

  const validateColors = useCallback(() => {
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