// File: contexts/AuthProvider.tsx

import { Session, User } from "@supabase/supabase-js";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { useSupabase } from "./SupabaseProvider"; // Importa il client Supabase

// L'interfaccia per il profilo utente, personalizzata per la tabella 'utenti'.
interface UserProfile {
  id: string;
  nome: string;
  cognome: string;
  primo_login: boolean; // Aggiunto per risolvere l'errore in AuthRedirector
}

// L'interfaccia per il contesto di autenticazione
interface AuthContextProps {
  user: (User & { primo_login?: boolean }) | null; // Tipizzato per includere il campo opzionale
  profile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error: unknown }>;
  signUp: (
    email: string,
    password: string,
    data: { nome: string; cognome: string },
  ) => Promise<void>;
}

// Crea il contesto di autenticazione
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Hook personalizzato per accedere al contesto di autenticazione
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      "useAuth deve essere utilizzato all'interno di un AuthProvider",
    );
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { supabase } = useSupabase();
  const [user, setUser] = useState<(User & { primo_login?: boolean }) | null>(
    null,
  );
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Funzione per recuperare il profilo utente dalla tabella 'utenti'
  // Uso useCallback per evitare che la funzione venga ricreata ad ogni render
  const getProfile = useCallback(
    async (currentUserId: string) => {
      try {
        const { data, error } = await supabase
          .from("utenti") // Utilizza la tabella 'utenti'
          .select("id, nome, cognome, primo_login")
          .eq("id", currentUserId)
          .single();

        if (error) throw error;
        setProfile(data as UserProfile);
      } catch (error) {
        console.error("Errore nel recupero del profilo:", error);
        setProfile(null);
      }
    },
    [supabase],
  );

  // Gestisce la navigazione in base allo stato di autenticazione
  // Uso useCallback per evitare che la funzione venga ricreata ad ogni render
  const handleNavigation = useCallback(() => {
    // La logica di navigazione è gestita esternamente,
    // quindi questo provider si concentra solo sull'aggiornamento dello stato
    // e non sulla navigazione automatica al login.
    if (isLoading) {
      return; // Non navigare durante il caricamento
    }
    // L'app inizia sempre da /(tabs), quindi non è necessario reindirizzare.
    // L'utente andrà alla pagina di login solo manualmente.
  }, [isLoading]);

  // Funzione di login
  const signIn = async (email: string, password: string) => {
    console.log("AuthProvider: Tentativo di login...");
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        console.log("AuthProvider: Errore da Supabase", error);
      }
      return { error }; // Restituisce l'oggetto error
    } catch (error: unknown) {
      console.log("AuthProvider: Errore nel try/catch", error);
      return { error }; // Restituisce l'oggetto error
    }
  };

  // Funzione di registrazione
  const signUp = async (
    email: string,
    password: string,
    data: { nome: string; cognome: string },
  ) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            // Aggiungi qui i dati aggiuntivi da salvare
            nome: data.nome,
            cognome: data.cognome,
          },
        },
      });
      if (error) throw error;
    } catch (err: unknown) {
      console.error("Errore nella registrazione:", err);
      // Gestisci l'errore qui
    } finally {
      setIsLoading(false);
    }
  };

  // Funzione di logout
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      // onAuthStateChange gestirà l'aggiornamento dello stato
    } catch (error: unknown) {
      console.error("Errore nel logout:", error);
    }
  };

  useEffect(() => {
    // Iscriviti agli eventi di autenticazione di Supabase
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        handleNavigation(); // Chiamata senza parametri

        if (currentSession?.user) {
          getProfile(currentSession.user.id);
        } else {
          setProfile(null);
        }
      },
    );

    // Recupera la sessione iniziale
    const fetchSession = async () => {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) {
        await getProfile(currentSession.user.id);
      }
      setIsLoading(false);
    };

    fetchSession();

    // Rimuovi il listener al dismount del componente
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [getProfile, handleNavigation, supabase.auth]);

  const value: AuthContextProps = {
    user,
    profile,
    session,
    isLoading,
    signOut,
    signIn,
    signUp,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/*
// File: contexts/AuthProvider.tsx

import { Session, User } from "@supabase/supabase-js";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { useSupabase } from "./SupabaseProvider"; // Importa il client Supabase

// L'interfaccia per il profilo utente, personalizzata per la tabella 'utenti'.
interface UserProfile {
  id: string;
  nome: string;
  cognome: string;
  // Aggiungi altri campi della tua tabella 'utenti' se necessario
}

// L'interfaccia per il contesto di autenticazione
interface AuthContextProps {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, data: any) => Promise<void>;
}

// Crea il contesto di autenticazione
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Hook personalizzato per accedere al contesto di autenticazione
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      "useAuth deve essere utilizzato all'interno di un AuthProvider",
    );
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { supabase } = useSupabase();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Funzione per recuperare il profilo utente dalla tabella 'utenti'
  // Uso useCallback per evitare che la funzione venga ricreata ad ogni render
  const getProfile = useCallback(
    async (currentUserId: string) => {
      try {
        const { data, error } = await supabase
          .from("utenti") // Utilizza la tabella 'utenti'
          .select("id, nome, cognome")
          .eq("id", currentUserId)
          .single();

        if (error) throw error;
        setProfile(data as UserProfile);
      } catch (error) {
        console.error("Errore nel recupero del profilo:", error);
        setProfile(null);
      }
    },
    [supabase],
  );

  // Gestisce la navigazione in base allo stato di autenticazione
  // Uso useCallback per evitare che la funzione venga ricreata ad ogni render
  const handleNavigation = useCallback(() => {
    // La logica di navigazione è gestita esternamente,
    // quindi questo provider si concentra solo sull'aggiornamento dello stato
    // e non sulla navigazione automatica al login.
    if (loading) {
      return; // Non navigare durante il caricamento
    }
    // L'app inizia sempre da /(tabs), quindi non è necessario reindirizzare.
    // L'utente andrà alla pagina di login solo manualmente.
  }, [loading]);

  // Funzione di login
  const signIn = async (email: string, password: string) => {
    console.log("AuthProvider: Tentativo di login...");
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        console.log("AuthProvider: Errore da Supabase", error);
      }
      return { error }; // Restituisce l'oggetto error
    } catch (error) {
      console.log("AuthProvider: Errore nel try/catch", error);
      return { error }; // Restituisce l'oggetto error
    }
  };

  // Funzione di registrazione
  const signUp = async (email: string, password: string, data: any) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            // Aggiungi qui i dati aggiuntivi da salvare
            nome: data.nome,
            cognome: data.cognome,
          },
        },
      });
      if (error) throw error;
    } catch (err: any) {
      console.error("Errore nella registrazione:", err);
      // Gestisci l'errore qui
    } finally {
      setLoading(false);
    }
  };

  // Funzione di logout
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      // onAuthStateChange gestirà l'aggiornamento dello stato
    } catch (error) {
      console.error("Errore nel logout:", error);
    }
  };

  useEffect(() => {
    // Iscriviti agli eventi di autenticazione di Supabase
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        handleNavigation(); // Chiamata senza parametri

        if (currentSession?.user) {
          getProfile(currentSession.user.id);
        } else {
          setProfile(null);
        }
      },
    );

    // Recupera la sessione iniziale
    const fetchSession = async () => {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) {
        await getProfile(currentSession.user.id);
      }
      setLoading(false);
    };

    fetchSession();

    // Rimuovi il listener al dismount del componente
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [getProfile, handleNavigation, supabase.auth]);

  const value: AuthContextProps = {
    user,
    profile,
    session,
    loading,
    signOut,
    signIn,
    signUp,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
*/
/*
// File: contexts/AuthProvider.tsx

import { Session, User } from '@supabase/supabase-js';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useSupabase } from './SupabaseProvider'; // Importa il client Supabase

// L'interfaccia per il profilo utente, personalizzata per la tabella 'utenti'.
interface UserProfile {
  id: string;
  nome: string;
  cognome: string;
  // Aggiungi altri campi della tua tabella 'utenti' se necessario
}

// L'interfaccia per il contesto di autenticazione
interface AuthContextProps {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, data: any) => Promise<void>;
}

// Crea il contesto di autenticazione
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Hook personalizzato per accedere al contesto di autenticazione
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve essere utilizzato all\'interno di un AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { supabase } = useSupabase();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Funzione per recuperare il profilo utente dalla tabella 'utenti'
  // Uso useCallback per evitare che la funzione venga ricreata ad ogni render
  const getProfile = useCallback(async (currentUserId: string) => {
    try {
      const { data, error } = await supabase
        .from('utenti') // Utilizza la tabella 'utenti'
        .select('id, nome, cognome')
        .eq('id', currentUserId)
        .single();

      if (error) throw error;
      setProfile(data as UserProfile);
    } catch (error) {
      console.error('Errore nel recupero del profilo:', error);
      setProfile(null);
    }
  }, [supabase]);

  // Gestisce la navigazione in base allo stato di autenticazione
  // Uso useCallback per evitare che la funzione venga ricreata ad ogni render
  const handleNavigation = useCallback(() => {
    // La logica di navigazione è gestita esternamente,
    // quindi questo provider si concentra solo sull'aggiornamento dello stato
    // e non sulla navigazione automatica al login.
    if (loading) {
      return; // Non navigare durante il caricamento
    }
    // L'app inizia sempre da /(tabs), quindi non è necessario reindirizzare.
    // L'utente andrà alla pagina di login solo manualmente.
  }, [loading]);

  // Funzione di login
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error) {
      console.error('Errore nel login:', error);
      // Puoi gestire l'errore qui, ad esempio mostrando un messaggio all'utente
    } finally {
      setLoading(false);
    }
  };

  // Funzione di registrazione
  const signUp = async (email: string, password: string, data: any) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nome: data.nome,
            cognome: data.cognome,
          }
        }
      });
      if (error) throw error;      
    } catch (err: any) {
      console.error('Errore nella registrazione:', err);
      // Gestisci l'errore qui
    } finally {
      setLoading(false);
    }
  };

  // Funzione di logout
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      // onAuthStateChange gestirà l'aggiornamento dello stato
    } catch (error) {
      console.error('Errore nel logout:', error);
    }
  };

  useEffect(() => {
    // Iscriviti agli eventi di autenticazione di Supabase
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        handleNavigation(); // Chiamata senza parametri
        
        if (currentSession?.user) {
          getProfile(currentSession.user.id);
        } else {
          setProfile(null);
        }
      }
    );

    // Recupera la sessione iniziale
    const fetchSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) {
        await getProfile(currentSession.user.id);
      }
      setLoading(false);
    };

    fetchSession();

    // Rimuovi il listener al dismount del componente
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [getProfile, handleNavigation, supabase.auth]);

  const value: AuthContextProps = {
    user,
    profile,
    session,
    loading,
    signOut,
    signIn,
    signUp,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
*/
