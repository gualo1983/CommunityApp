// File: components/ErrorBoundary.tsx

import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useTheme } from "../contexts/theme";

// --- Componente funzionale per l'UI di fallback dell'errore ---
const ErrorFallbackUI = () => {
  const { theme } = useTheme(); // Accede al tema dal contesto
  const router = useRouter();

  // Stili dinamici che usano i colori del tema
  const dynamicErrorStyles = StyleSheet.create({
    button: {
      backgroundColor: theme.colors.primary,
      borderRadius: 5,
      elevation: 5,
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    buttonText: {
      color: theme.colors.headerText,
      fontWeight: "bold",
    },
    container: {
      alignItems: "center",
      backgroundColor: theme.colors.background,
      flex: 1,
      justifyContent: "center",
      padding: 20,
    },
    subtitle: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSizes.medium,
      marginBottom: 20,
      textAlign: "center",
    },
    title: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSizes.large,
      fontWeight: theme.typography.fontWeights.bold,
      marginBottom: 10,
    },
  });

  return (
    <View style={dynamicErrorStyles.container}>
      <Text style={dynamicErrorStyles.title}>Qualcosa è andato storto!</Text>
      <Text style={dynamicErrorStyles.subtitle}>
        Siamo spiacenti per l&apos;inconveniente.
      </Text>
      <TouchableOpacity
        style={dynamicErrorStyles.button}
        onPress={() => router.replace("/(tabs)")}
      >
        <Text style={dynamicErrorStyles.buttonText}>Torna alla Home</Text>
      </TouchableOpacity>
    </View>
  );
};

// --- GESTIONE DEGLI ERRORI CON ErrorBoundary (Classe per componentDidCatch) ---
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary ha catturato un errore:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallbackUI />; // Renderizza il componente di fallback che usa il tema
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

/*
// File: components/ErrorBoundary.tsx

import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useTheme } from "../contexts/theme";

// --- Componente funzionale per l'UI di fallback dell'errore ---
const ErrorFallbackUI = () => {
  const { theme } = useTheme(); // Accede al tema dal contesto
  const router = useRouter();

  // Stili dinamici che usano i colori del tema
  const dynamicErrorStyles = StyleSheet.create({
    button: {
      backgroundColor: theme.colors.primary,
      borderRadius: 5,
      elevation: 5,
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    buttonText: {
      color: theme.colors.headerText,
      fontWeight: "bold",
    },
    container: {
      alignItems: "center",
      backgroundColor: theme.colors.background,
      flex: 1,
      justifyContent: "center",
      padding: 20,
    },
    subtitle: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSizes.medium,
      marginBottom: 20,
      textAlign: "center",
    },
    title: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSizes.large,
      fontWeight: theme.typography.fontWeights.bold,
      marginBottom: 10,
    },
  });

  return (
    <View style={dynamicErrorStyles.container}>
      <Text style={dynamicErrorStyles.title}>Qualcosa è andato storto!</Text>
      <Text style={dynamicErrorStyles.subtitle}>
        Siamo spiacenti per l&apos;inconveniente.
      </Text>
      <TouchableOpacity
        style={dynamicErrorStyles.button}
        onPress={() => router.replace("/(tabs)")}
      >
        <Text style={dynamicErrorStyles.buttonText}>Torna alla Home</Text>
      </TouchableOpacity>
    </View>
  );
};

// --- GESTIONE DEGLI ERRORI CON ErrorBoundary (Classe per componentDidCatch) ---
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("ErrorBoundary ha catturato un errore:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallbackUI />; // Renderizza il componente di fallback che usa il tema
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
*/
