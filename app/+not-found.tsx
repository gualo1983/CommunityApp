import { Link, Stack } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useTheme } from "../contexts/theme";
import reactLogo from "../assets/images/react-logo.png";

export default function NotFoundScreen() {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      alignItems: "center",
      backgroundColor: theme.colors.background,
      flex: 1,
      justifyContent: "center",
      padding: 20,
    },
    homeButton: {
      alignItems: "center",
      backgroundColor: theme.colors.primary,
      borderRadius: 10,
      marginTop: 20,
      paddingHorizontal: 30,
      paddingVertical: 15,
    },
    homeButtonText: {
      color: theme.colors.headerText,
      fontSize: theme.typography.fontSizes.medium,
      fontWeight: theme.typography.fontWeights.bold,
    },
    image: {
      height: 250,
      marginBottom: 30,
      resizeMode: "contain",
      width: 250,
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
      textAlign: "center",
    },
  });

  return (
    <>
      <Stack.Screen
        options={{
          title: "Pagina non trovata",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: theme.colors.headerBackground,
          },
          headerTitleStyle: {
            color: theme.colors.headerText,
            fontSize: theme.typography.fontSizes.large,
            fontWeight: theme.typography.fontWeights.bold,
          },
          headerTintColor: theme.colors.headerText,
          // La riga `headerLeft` è stata rimossa
        }}
      />
      <View style={styles.container}>
        <Image source={reactLogo} style={styles.image} />
        <Text style={styles.title}>404 - Pagina non trovata</Text>
        <Text style={styles.subtitle}>
          Spiacenti, la pagina che stavi cercando non esiste.
        </Text>

        <Link href="/" asChild>
          <TouchableOpacity style={styles.homeButton}>
            <Text style={styles.homeButtonText}>Torna alla Home</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </>
  );
}
