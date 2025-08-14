import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../contexts/AuthProvider';
import { useTheme } from '../contexts/theme';

// Aggiungiamo un'interfaccia per definire la struttura dell'oggetto utente
interface AuthUser {
  id: string;
  email?: string;
  // Aggiungi qui altre proprietà del tuo utente se necessario
}

// Interfaccia per il profilo utente con nome e cognome
interface UserProfile {
  id: string;
  nome?: string;
  cognome?: string;
  profilePicture?: string;
}

const DropdownMenu = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Ora destrutturiamo sia l'oggetto 'user' che l'oggetto 'profile'
  const { user, profile, signOut } = useAuth() as { user: AuthUser | null; profile: UserProfile | null; signOut: () => void };
  const { theme } = useTheme();

  // Determina il nome utente da visualizzare: prima l'utente autenticato, poi il mock user
  // Utilizziamo le proprietà corrette 'nome' e 'cognome' dall'oggetto 'profile'
  const userName = profile && profile.nome ? `${profile.nome} ${profile.cognome || ''}`.trim() : 'Ospite';
  const firstLetter = profile && profile.nome ? profile.nome.charAt(0).toUpperCase() : 'O';

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
    // Se l'utente è autenticato e ha una foto profilo, la mostriamo
    if (profile && profile.profilePicture) {
      return (
        <Image
          source={{ uri: profile.profilePicture }}
          style={styles.profileIcon}
        />
      );
    }
    // Altrimenti, mostriamo un'icona con la prima lettera del nome
    else {
      const backgroundColor = getRandomColor();
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

  const styles = StyleSheet.create({
    container: {
      position: 'relative',
      zIndex: 10,
    },
    dropdown: {
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 10,
      shadowColor: '#000', // Sostituisce box-shadow per React Native
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
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
      padding: 15,
    },
    menuItemText: {
      color: theme.colors.text,
      fontSize: 16,
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
      <Pressable
        onPress={toggleMenu}
        style={styles.menuButton}
      >
        {renderProfileIcon()}
      </Pressable>

      {isMenuOpen && (
        <View style={styles.dropdown}>
          <View style={styles.menuHeader}>
            <Text style={styles.menuHeaderText}>
              {userName}
            </Text>
          </View>
          
          {user ? (
            <>
              <Pressable
                style={styles.menuItem}
                onPress={() => {
                  router.push('/msg');
                  toggleMenu();
                }}
              >
                <Text style={styles.menuItemText}>Messaggi</Text>
              </Pressable>
            </>
          ) : (
            <Pressable
              style={styles.menuItem}
              onPress={() => {
                router.push('/login');
                toggleMenu();
              }}
            >
              <Text style={styles.menuItemText}>Accedi / Registrati</Text>
            </Pressable>
          )}

          {/* Il pulsante Impostazioni è ora fuori dal blocco condizionale e sempre visibile */}
          <Pressable
            style={styles.menuItem}
            onPress={() => {
              router.push('/settings');
              toggleMenu();
            }}
          >
            <Text style={styles.menuItemText}>Impostazioni</Text>
          </Pressable>

          {/* Il pulsante Logout è visibile solo se l'utente è autenticato */}
          {user && (
            <Pressable
              style={styles.menuItem}
              onPress={() => {
                signOut();
                router.push('/login');
                toggleMenu();
              }}
            >
              <Text style={styles.menuItemText}>Logout</Text>
            </Pressable>
          )}

        </View>
      )}
    </View>
  );
};

export default DropdownMenu;



/*
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../contexts/AuthProvider';
import { useTheme } from '../contexts/theme';

// Aggiungiamo un'interfaccia per definire la struttura dell'oggetto utente
interface AuthUser {
  id: string;
  nome?: string; // Corretto da 'name' a 'nome'
  cognome?: string; // Corretto da 'surname' a 'cognome'
  profilePicture?: string;
  // Aggiungi qui altre proprietà del tuo utente se necessario
}

const DropdownMenu = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth() as { user: AuthUser | null; signOut: () => void };
  const { theme } = useTheme();

  // Determina il nome utente da visualizzare: prima l'utente autenticato, poi il mock user
  // Utilizziamo le proprietà corrette 'nome' e 'cognome'
  const userName = user && user.nome ? `${user.nome} ${user.cognome || ''}`.trim() : 'Ospite';
  const firstLetter = user && user.nome ? user.nome.charAt(0).toUpperCase() : 'O';

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
    // Se l'utente è autenticato e ha una foto profilo, la mostriamo
    if (user && user.profilePicture) {
      return (
        <Image
          source={{ uri: user.profilePicture }}
          style={styles.profileIcon}
        />
      );
    }
    // Altrimenti, mostriamo un'icona con la prima lettera del nome
    else {
      const backgroundColor = getRandomColor();
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

  const styles = StyleSheet.create({
    container: {
      position: 'relative',
      zIndex: 10,
    },
    dropdown: {
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 10,
      shadowColor: '#000', // Sostituisce box-shadow per React Native
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
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
      padding: 15,
    },
    menuItemText: {
      color: theme.colors.text,
      fontSize: 16,
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
      <Pressable
        onPress={toggleMenu}
        style={styles.menuButton}
      >
        {renderProfileIcon()}
      </Pressable>

      {isMenuOpen && (
        <View style={styles.dropdown}>
          <View style={styles.menuHeader}>
            <Text style={styles.menuHeaderText}>
              {userName}
            </Text>
          </View>
          
          {user ? (
            <>
              <Pressable
                style={styles.menuItem}
                onPress={() => {
                  router.push('/msg');
                  toggleMenu();
                }}
              >
                <Text style={styles.menuItemText}>Messaggi</Text>
              </Pressable>
            </>
          ) : (
            <Pressable
              style={styles.menuItem}
              onPress={() => {
                router.push('/login');
                toggleMenu();
              }}
            >
              <Text style={styles.menuItemText}>Accedi / Registrati</Text>
            </Pressable>
          )}

          <Pressable
            style={styles.menuItem}
            onPress={() => {
              router.push('/settings');
              toggleMenu();
            }}
          >
            <Text style={styles.menuItemText}>Impostazioni</Text>

            </Pressable>
          {user && (
            <Pressable
              style={styles.menuItem}
              onPress={() => {
                signOut();
                router.push('/login');
                toggleMenu();
              }}
            >
              <Text style={styles.menuItemText}>Logout</Text>
            </Pressable>
          )}

        </View>
      )}
    </View>
  );
};

export default DropdownMenu;
*/