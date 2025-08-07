// File: _layouts.tsx (Versione finale)

import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';

// Importa i provider e gli hook dal contesto centralizzato
import ErrorBoundary from '../components/ErrorBoundary';
import { AppwriteProvider } from '../contexts/AppwriteProvider';
import { AuthProvider } from '../contexts/AuthProvider';
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
    <AppwriteProvider>
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
    </AppwriteProvider>
  );
}