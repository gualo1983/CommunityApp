import { Account, Client, Databases } from 'appwrite';
import { useFonts } from 'expo-font';
import * as Notifications from 'expo-notifications';
import { Notification, NotificationResponse } from 'expo-notifications';
import { Slot, SplashScreen, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Importa i provider e gli hook del tema dal contesto centralizzato
import { ThemeProvider, useTheme } from '../contexts/theme';

SplashScreen.preventAutoHideAsync();

// --- Componente funzionale per l'UI di fallback dell'errore ---
// Questo componente può usare il contesto del tema
const ErrorFallbackUI = () => {
  const { theme } = useTheme(); // Accede al tema dal contesto
  const router = useRouter();

  // Stili dinamici che usano i colori del tema
  const dynamicErrorStyles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background, // Colore di sfondo dinamico
      padding: 20,
    },
    title: {
      fontSize: theme.typography.fontSizes.large,
      fontWeight: theme.typography.fontWeights.bold,
      color: theme.colors.text, // Colore del testo dinamico
      marginBottom: 10,
    },
    subtitle: {
      fontSize: theme.typography.fontSizes.medium,
      color: theme.colors.textSecondary, // Colore del testo secondario dinamico
      marginBottom: 20,
      textAlign: 'center',
    },
    button: {
      backgroundColor: theme.colors.primary, // Colore primario dinamico
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      elevation: 5, // Ombra per Android
    },
    buttonText: {
      color: theme.colors.headerText, // Colore del testo del pulsante dinamico (contrasto con il primario)
      fontWeight: 'bold',
    },
  });

  return (
    <View style={dynamicErrorStyles.container}>
      <Text style={dynamicErrorStyles.title}>Qualcosa è andato storto!</Text>
      <Text style={dynamicErrorStyles.subtitle}>Siamo spiacenti per l&apos;inconveniente.</Text>
      <TouchableOpacity 
        style={dynamicErrorStyles.button}
        onPress={() => router.replace('/(tabs)')}
      >
        <Text style={dynamicErrorStyles.buttonText}>Torna alla Home</Text>
      </TouchableOpacity>
    </View>
  );
};

// --- GESTIONE DEGLI ERRORI CON ErrorBoundary (Classe per componentDidCatch) ---
// Questa classe cattura gli errori e renderizza l'UI di fallback
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
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


// --- CONTESTO PER APPWRITE ---
interface AppwriteContextProps {
  client: Client;
  account: Account;
  databases: Databases;
}

const AppwriteContext = createContext<AppwriteContextProps | undefined>(undefined);

export function useAppwrite() {
  const context = useContext(AppwriteContext);
  if (!context) {
    throw new Error('useAppwrite must be used within an AppwriteProvider');
  }
  return context;
}

const AppwriteProvider = ({ children }: { children: React.ReactNode }) => {
  const [client] = useState(() => new Client()
    // ⚠️ DEVI SOSTITUIRE QUESTI VALORI CON IL TUO ENDPOINT E ID PROGETTO REALI DI APPWRITE ⚠️
    .setEndpoint('https://[YOUR-APPWRITE-ENDPOINT]/v1')
    .setProject('[YOUR-APPWRITE-PROJECT-ID]')
  );
  const [account] = useState(() => new Account(client));
  const [databases] = useState(() => new Databases(client));

  const value = { client, account, databases };

  return (
    <AppwriteContext.Provider value={value}>
      {children}
    </AppwriteContext.Provider>
  );
};


// --- CONTESTO PER L'AUTENTICAZIONE ---
interface AuthContextProps {
  isAuthenticated: boolean;
  user: any; // User object from Appwrite
  isLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  client: Client; // Aggiungiamo il client Appwrite al contesto di autenticazione
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve essere usato all\'interno di un AuthProvider');
  }
  return context;
}

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { account, client } = useAppwrite();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const signIn = useCallback(async () => {
    console.log('Chiamata a signIn');
    setIsAuthenticated(true);
  }, []);

  const signOut = useCallback(async () => {
    console.log('Chiamata a signOut');
    setIsAuthenticated(false);
    setUser(null);
  }, []);
  
  const checkSession = useCallback(async () => {
    try {
      const currentUser = await account.get();
      if (currentUser) {
        setIsAuthenticated(true);
        setUser(currentUser);
      }
    } catch (error) {
      console.error("Errore nel controllo della sessione", error);
    } finally {
      setIsLoading(false);
    }
  }, [account]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const value = {
    isAuthenticated,
    user,
    isLoading,
    signIn,
    signOut,
    client,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


// --- HOOK PER LE NOTIFICHE PUSH ---
async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    console.error('Failed to get push token for push notification!');
    return;
  }
  
  token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log("Push token:", token);

  return token;
}

export function usePushNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>('');

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    const notificationListener = Notifications.addNotificationReceivedListener((notification: Notification) => {
      console.log("Notifica ricevuta:", notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener((response: NotificationResponse) => {
      console.log("Interazione con notifica:", response);
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  const sendNotification = async (title: string, body: string) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 1,
      },
    });
  };

  return { expoPushToken, sendNotification };
}

// --- COMPONENTE LAYOUT PRINCIPALE ---
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
      <ThemeProvider> {/* Il ThemeProvider deve avvolgere ErrorBoundary per fornire il contesto */}
        <ErrorBoundary>
          <AuthProvider>
            <Slot />
            <StatusBar style="auto" />
          </AuthProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </AppwriteProvider>
  );
}
