// File: _layouts.tsx

import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useContext, useEffect, useState } from "react";

// Importa i wrapper per lo storage
import { getItem } from "../utils/storage";
// Importa i provider e gli hook dal contesto centralizzato
import ErrorBoundary from "../components/ErrorBoundary";
import { AuthProvider } from "../contexts/AuthProvider";
import { SupabaseProvider } from "../contexts/SupabaseProvider";
import { ThemeContext, ThemeProvider } from "../contexts/theme";

// Impedisci allo splash screen di nascondersi automaticamente
SplashScreen.preventAutoHideAsync();

function RootLayoutContent() {
  const { setTheme, setFontSizeOption, setCustomColors } =
    useContext(ThemeContext)!;
  const [isLoaded, setIsLoaded] = useState(false);
  const [fontsLoaded, fontError] = useFonts({
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // Questo useEffect ora ha un array di dipendenze vuoto `[]`.
  // Questo assicura che il codice all'interno venga eseguito SOLO una volta,
  // quando il componente viene montato per la prima volta.
  // In questo modo, evitiamo il ciclo infinito di aggiornamenti.
  useEffect(() => {
    async function initializeApp() {
      try {
        // Usa il wrapper getItem per leggere i dati
        const storedTheme = await getItem("appTheme");
        const storedFontSize = await getItem("appFontSize");
        const storedCustomColors = await getItem("customColors");

        // Applica le impostazioni caricate.
        if (storedTheme) {
          setTheme(storedTheme as "light" | "dark" | "custom");
        }
        if (storedFontSize) {
          setFontSizeOption(storedFontSize as "small" | "medium" | "large");
        }
        if (storedCustomColors) {
          try {
            setCustomColors(JSON.parse(storedCustomColors));
          } catch (e) {
            console.warn("Errore nel parsing dei colori personalizzati:", e);
          }
        }
      } catch (e) {
        console.warn("Errore nel caricamento delle impostazioni iniziali:", e);
      } finally {
        setIsLoaded(true);
      }
    }
    initializeApp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Array di dipendenze vuoto per eseguire l'effetto una sola volta.

  useEffect(() => {
    if (fontsLoaded || fontError || isLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, isLoaded]);

  if (!isLoaded || (!fontsLoaded && !fontError)) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="msg" options={{ title: "Messaggi" }} />
      <Stack.Screen
        name="PersonalDataPage"
        options={{ title: "Dati Personali" }}
      />
      <Stack.Screen name="settings" options={{ title: "Impostazioni" }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SupabaseProvider>
      <ThemeProvider>
        <ErrorBoundary>
          <AuthProvider>
            <RootLayoutContent />
            <StatusBar style="auto" />
          </AuthProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </SupabaseProvider>
  );
}

/*
// File: _layouts.tsx

import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';

// Importa i provider e gli hook dal contesto centralizzato
import ErrorBoundary from '../components/ErrorBoundary';
import { AuthProvider } from '../contexts/AuthProvider';
import { SupabaseProvider } from '../contexts/SupabaseProvider';
import { ThemeProvider } from '../contexts/theme';

SplashScreen.preventAutoHideAsync();

// --- COMPONENTE LAYOUT PRINCIPALE RIFATTORIZZATO ---
export default function RootLayout() {
  // usePushNotifications(); // Commentato a causa delle limitazioni di Expo Go

  const [fontsLoaded, fontError] = useFonts({
    'SpaceMono': require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SupabaseProvider>
      <ThemeProvider>
        <ErrorBoundary>
          <AuthProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="msg" options={{ title: 'Messaggi' }} />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
          </AuthProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </SupabaseProvider>
  );
}
*/
