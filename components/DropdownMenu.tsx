// File: components/DropdownMenu.tsx
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../contexts/AuthProvider'; // Importiamo il nostro hook useAuth
import { useTheme } from '../contexts/theme'; // Importa l'hook useTheme

const DropdownMenu = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth(); // Ottieni user e signOut dal contesto Auth
  const { theme } = useTheme(); // Accedi al tema dal contesto

  // Utente di prova (mock user) per garantire che ci sia sempre un nome per il testing
  const [mockUser] = useState({
    name: 'Santino',
    profilePicture: null,
  });

  // Determina il nome utente da visualizzare: prima l'utente autenticato, poi il mock user
  const displayUser = user && user.name ? user : mockUser;
  const userName = displayUser.name || 'Utente Sconosciuto';

  // Funzione per generare un colore casuale per lo sfondo dell'icona.
  // Questo è usato come fallback se non è disponibile un'immagine profilo.
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const renderProfileIcon = () => {
    if (displayUser.profilePicture) {
      return (
        <Image
          source={{ uri: displayUser.profilePicture }}
          style={styles.profileIcon}
        />
      );
    } else {
      const backgroundColor = getRandomColor();
      const firstLetter = userName.charAt(0).toUpperCase();
      return (
        <View style={[styles.profileIcon, { backgroundColor }]}>
          <Text style={styles.profileIconText}>{firstLetter}</Text>
        </View>
      );
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Stili del componente che usano i valori del tema
  const styles = StyleSheet.create({
    container: {
      position: 'relative',
      zIndex: 10,
    },
    dropdown: {
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 10,
      boxShadow: '0px 2px 3.84px rgba(0, 0, 0, 0.25)',
      elevation: 5,
      position: 'absolute',
      right: 10,
      top: 50,
      width: 200,
    },
    menuButton: {
      marginRight: 10,
      padding: 10,
    },
    menuHeader: {
      borderBottomColor: theme.colors.cardBorder,
      borderBottomWidth: 1,
      padding: 15,
    },
    menuHeaderText: {
      color: theme.colors.text,
      fontSize: 18,
      fontWeight: 'bold',
    },
    menuItem: {
      borderBottomColor: theme.colors.cardBorder,
      borderBottomWidth: 1,
      borderTopWidth: 0,
      padding: 15, // Aggiunto per evitare doppi bordi
    },
    menuItemText: {
      color: theme.colors.text,
      fontSize: 16, // Colore del testo dal tema
    },
    profileIcon: {
      alignItems: 'center',
      borderRadius: 20,
      height: 40,
      justifyContent: 'center',
      width: 40,
    },
    profileIconText: {
      color: theme.colors.headerText,
      fontSize: 18,
      fontWeight: 'bold',
    },
  });

  return (
    <View style={styles.container}>
      {/* Icona del profilo, che funge da pulsante per aprire il menu. */}
      <Pressable
        onPress={toggleMenu}
        style={styles.menuButton}
      >
        {renderProfileIcon()}
      </Pressable>

      {/* Il menu a tendina vero e proprio, visibile solo se isMenuOpen è true */}
      {isMenuOpen && (
        <View style={styles.dropdown}>
          {/* Voci del menu aggiornate */}
          <View style={styles.menuHeader}>
            <Text style={styles.menuHeaderText}>
              {userName}
            </Text>
          </View>
           {/* Nuovo collegamento per i Messaggi */}
          <Pressable
            style={styles.menuItem}
            onPress={() => {
              // Naviga alla pagina dei messaggi e chiudi il menu
              router.push('/msg');
              toggleMenu();
            }}
          >
            <Text style={styles.menuItemText}>Messaggi</Text>
          </Pressable>
          <Pressable
            style={styles.menuItem}
            onPress={() => {
              // Naviga alla pagina delle impostazioni e chiudi il menu
              router.push('/settings');
              toggleMenu();
            }}
          >
            <Text style={styles.menuItemText}>Impostazioni</Text>
          </Pressable>
          <Pressable
            style={styles.menuItem}
            onPress={() => {
              signOut(); // Usa la funzione signOut dal contesto Auth
              toggleMenu();
              // Aggiungi qui la logica per reindirizzare l'utente alla schermata di login
            }}
          >
            <Text style={styles.menuItemText}>Logout</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default DropdownMenu;