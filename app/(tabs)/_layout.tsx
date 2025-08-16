// app/(tabs)/_layout.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

import DropdownMenu from "../../components/DropdownMenu"; // Importa il DropdownMenu
import { useTheme } from "../../contexts/theme"; // Importa l'hook useTheme

// Questo file definisce il layout della barra di navigazione inferiore.
// Expo Router userà automaticamente i file in questa directory per creare le tab.

export default function TabLayout() {
  const { theme } = useTheme(); // Accedi al tema dal contesto

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.headerBackground, // Usa il colore del tema
        },
        headerTitleStyle: {
          color: theme.colors.headerText, // Usa il colore del tema
          fontSize: 24,
          fontWeight: "bold",
        },
        headerTitleAlign: "center", // Centra il titolo dell'header
        tabBarStyle: {
          backgroundColor: theme.colors.tabBarBackground, // Usa il colore del tema
          borderTopWidth: 1,
          borderTopColor: theme.colors.cardBorder, // Usa un colore dal tema per il bordo
          paddingBottom: 5,
          paddingTop: 5,
        },
        tabBarActiveTintColor: theme.colors.tabBarActive, // Usa il colore del tema
        tabBarInactiveTintColor: theme.colors.tabBarInactive, // Usa il colore del tema
      }}
    >
      <Tabs.Screen
        name="index" // Rinominiamo la prima tab in 'index'
        options={{
          title: "Eventi",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="calendar" size={24} color={color} />
          ),
          headerShown: true, // Riabilita l'intestazione per questa pagina
          headerRight: () => <DropdownMenu />, // Aggiungi il DropdownMenu a destra dell'header
        }}
      />
      <Tabs.Screen
        name="requests"
        options={{
          title: "Richieste",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="hand-heart" size={24} color={color} />
          ),
          headerRight: () => <DropdownMenu />, // Aggiungi il DropdownMenu anche qui
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: "Comunità",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="account-group"
              size={24}
              color={color}
            />
          ),
          headerRight: () => <DropdownMenu />, // E anche qui
        }}
      />
    </Tabs>
  );
}
