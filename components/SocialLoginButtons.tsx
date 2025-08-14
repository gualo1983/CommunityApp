import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSocialAuth } from '../hooks/useSocialAuth'; // Importa il nuovo hook

const SocialLoginButtons = () => {
  // Ottieni le funzioni per l'autenticazione dal tuo hook
  const { handleGoogleAuth, handleFacebookAuth, handleAppleAuth, isLoading } = useSocialAuth();

  const styles = StyleSheet.create({
    socialIconsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 20,
      marginBottom: 10,
      width: '100%',
    },
    socialIcon: {
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#000000',
    },
  });

  return (
    <View style={styles.socialIconsContainer}>
      <TouchableOpacity
        style={[styles.socialIcon, { backgroundColor: '#DB4437' }]}
        onPress={handleGoogleAuth}
        disabled={isLoading} // Disabilita il pulsante durante il caricamento
      >
        <Ionicons name="logo-google" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.socialIcon, { backgroundColor: '#1877F2' }]}
        onPress={handleFacebookAuth}
        disabled={isLoading}
      >
        <Ionicons name="logo-facebook" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.socialIcon, { backgroundColor: '#000000' }]}
        onPress={handleAppleAuth}
        disabled={isLoading}
      >
        <Ionicons name="logo-apple" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

export default SocialLoginButtons;
