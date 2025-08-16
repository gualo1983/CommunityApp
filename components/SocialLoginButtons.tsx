import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { useTheme } from "../contexts/theme";
import { useSocialAuth } from "../hooks/useSocialAuth"; // Importa il nuovo hook

const SocialLoginButtons = () => {
  const { theme } = useTheme();

  // Ottieni le funzioni per l'autenticazione dal tuo hook
  const { handleGoogleAuth, handleFacebookAuth, handleAppleAuth, isLoading } =
    useSocialAuth();
  
  const socialColors = {
    apple: "#000000",
    facebook: "#1877F2",
    google: "#DB4437",
    white: "#FFFFFF",
  };

  const styles = StyleSheet.create({
    appleBackgroundColor: {
      backgroundColor: socialColors.apple,
    },
    facebookBackgroundColor: {
      backgroundColor: socialColors.facebook,
    },
    googleBackgroundColor: {
      backgroundColor: socialColors.google,
    },
    socialIcon: {
      alignItems: "center",
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 25,
      height: 50,
      justifyContent: "center",
      width: 50,
    },
    socialIconsContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginBottom: 10,
      marginTop: 20,
      width: "100%",
    },
  });

  return (
    <View style={styles.socialIconsContainer}>
      <TouchableOpacity
        style={[styles.socialIcon, styles.googleBackgroundColor]}
        onPress={handleGoogleAuth}
        disabled={isLoading} // Disabilita il pulsante durante il caricamento
      >
        <Ionicons name="logo-google" size={24} color={socialColors.white} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.socialIcon, styles.facebookBackgroundColor]}
        onPress={handleFacebookAuth}
        disabled={isLoading}
      >
        <Ionicons name="logo-facebook" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.socialIcon, styles.appleBackgroundColor]}
        onPress={handleAppleAuth}
        disabled={isLoading}
      >
        <Ionicons name="logo-apple" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

export default SocialLoginButtons;
