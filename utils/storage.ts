// File: utils/storage.ts

import AsyncStorage from '@react-native-async-storage/async-storage';

// Verifica se stiamo eseguendo l'app sul web
const isWeb = typeof window !== 'undefined';

// Wrapper per getItem
export const getItem = async (key: string): Promise<string | null> => {
  if (isWeb) {
    // Sul web, usiamo localStorage
    return window.localStorage.getItem(key);
  } else {
    // Su React Native, usiamo AsyncStorage
    return AsyncStorage.getItem(key);
  }
};

// Wrapper per setItem
export const setItem = async (key: string, value: string): Promise<void> => {
  if (isWeb) {
    // Sul web, usiamo localStorage
    window.localStorage.setItem(key, value);
  } else {
    // Su React Native, usiamo AsyncStorage
    await AsyncStorage.setItem(key, value);
  }
};

// Wrapper per removeItem
export const removeItem = async (key: string): Promise<void> => {
  if (isWeb) {
    // Sul web, usiamo localStorage
    window.localStorage.removeItem(key);
  } else {
    // Su React Native, usiamo AsyncStorage
    await AsyncStorage.removeItem(key);
  }
};
