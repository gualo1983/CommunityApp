// File: components/DropdownMenu.tsx
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../app/_layout'; // Importiamo il nostro hook useAuth
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

  // Colore di sfondo casuale per l'icona con la lettera, generato solo una volta.
  const [randomColor] = useState(getRandomColor());

  // Funzione per mostrare/nascondere il menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Funzione per il rendering dell'icona del profilo
  const renderProfileIcon = () => {
    // Se c'è un'immagine profilo, usala.
    if (displayUser.profilePicture) {
      return (
        <Image source={{ uri: displayUser.profilePicture }} style={styles.profileImage} />
      );
    }
    // Altrimenti, usa la prima lettera del nome con un colore di sfondo casuale.
    return (
      <View style={[styles.profileCircle, { backgroundColor: randomColor }]}>
        <Text style={[styles.profileText, { color: '#FFFFFF' }]}> {/* Colore del testo fisso a bianco per visibilità */}
          {displayUser.name ? displayUser.name.charAt(0).toUpperCase() : ''}
        </Text>
      </View>
    );
  };

  // Stili del componente che usano i valori del tema
  const styles = StyleSheet.create({
    container: {
      position: 'relative',
      zIndex: 100,
    },
    menuButton: {
      marginRight: 15,
    },
    profileCircle: {
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
    },
    profileImage: {
      width: 36,
      height: 36,
      borderRadius: 18,
    },
    profileText: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    dropdown: {
      position: 'absolute',
      top: 50,
      right: 15,
      backgroundColor: theme.colors.cardBackground, // Sfondo del dropdown dal tema
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      width: 200,
      zIndex: 101,
    },
    menuHeader: {
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.cardBorder, // Bordo dal tema
      backgroundColor: theme.colors.cardBackground, // Sfondo dell'header del menu dal tema
    },
    menuHeaderText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.colors.text, // Colore del testo dal tema
    },
    menuItem: {
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.cardBorder, // Bordo dal tema
    },
    menuItemText: {
      fontSize: 16,
      color: theme.colors.text, // Colore del testo dal tema
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
