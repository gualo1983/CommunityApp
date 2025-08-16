// File: hooks/useLoginLogic.tsx

import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";

import { useAuth } from "../contexts/AuthProvider";
import { useSupabase } from "../contexts/SupabaseProvider";

/**
 * Hook personalizzato per gestire la logica della pagina di login.
 * Si occupa dello stato dei form, della validazione e delle chiamate API.
 */
export const useLoginLogic = () => {
  const router = useRouter();
  const { signIn, user } = useAuth(); // Ottiene la funzione di login e l'oggetto utente dal contesto
  const { supabase } = useSupabase(); // Ottiene il client Supabase dal contesto

  // Stato per i campi del modulo
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Stato per la UI
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [focusedInput, setFocusedInput] = useState("");
  const [hasLoggedIn, setHasLoggedIn] = useState(false);

  // Funzione di validazione dell'email
  const isEmailValid = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  // Memoizza la validità del form per evitare ricalcoli non necessari
  const isFormValid = useMemo(() => {
    return isEmailValid(email) && password.length > 0;
  }, [email, password]);

  /**
   * Gestisce il processo di login.
   * Ora si occupa solo di avviare il processo di autenticazione e di gestire gli errori iniziali.
   */
  const handleLogin = async () => {
    if (!isFormValid) {
      setError("Inserisci email e password validi.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const { error: signInError } = await signIn(email, password);

      if (signInError) {
        console.log(
          "useLoginLogic: Errore ricevuto da AuthProvider",
          signInError,
        );
        // Cattura l'errore di Supabase per credenziali non valide
        if (
          typeof signInError === "object" &&
          signInError !== null &&
          "message" in signInError &&
          typeof signInError.message === "string" &&
          signInError.message.includes("Invalid login credentials")
        ) {
          setError("Email o password non validi. Riprova.");
        } else {
          setError("Si è verificato un errore inaspettato. Riprova.");
        }
        setIsLoading(false); // Assicurati di fermare il caricamento anche in caso di errore
        setHasLoggedIn(false);
      } else {
        setHasLoggedIn(true);
      }
    } catch (err: unknown) {
      // Modificato il tipo da `any` a `unknown` per una gestione più sicura
      console.error("useLoginLogic: Errore nel try/catch", err);
      if (err instanceof Error) {
        // Controlla se l'errore è un'istanza di Error prima di accedere a 'message'
        setError(
          err.message || "Si è verificato un errore inaspettato. Riprova.",
        );
      } else {
        setError("Si è verificato un errore sconosciuto. Riprova.");
      }
      setIsLoading(false);
      setHasLoggedIn(false);
    }
  };

  /**
   * Usa un effetto collaterale per monitorare lo stato dell'utente.
   * Quando l'utente effettua il login con successo (cioè, `user` non è più `null`),
   * questa funzione si attiva e gestisce il reindirizzamento.
   */
  useEffect(() => {
    if (user?.id && hasLoggedIn) {
      console.log("useLoginLogic: Utente autenticato, controllo il profilo...");
      const checkFirstLogin = async () => {
        try {
          const { data: profileData, error: fetchError } = await supabase
            .from("utenti")
            .select("primo_login")
            .eq("id", user.id)
            .single();

          if (fetchError) throw fetchError;

          if (profileData.primo_login) {
            router.replace("/PersonalDataPage");
          } else {
            router.replace("/");
          }
        } catch (err: unknown) {
          // Modificato il tipo da `any` a `unknown`
          console.error("useLoginLogic: Errore nel recupero del profilo:", err);
          if (err instanceof Error) {
            // Controlla se l'errore è un'istanza di Error prima di accedere a 'message'
            setError(err.message || "Errore nel recupero dei dati utente.");
          } else {
            setError("Errore sconosciuto nel recupero dei dati utente.");
          }
        } finally {
          setIsLoading(false);
          setHasLoggedIn(false);
        }
      };

      checkFirstLogin();
    } else if (!user && !isLoading) {
      // Se l'utente non è loggato, assicurati che lo stato di caricamento sia falso.
      setIsLoading(false);
    }
  }, [
    user,
    hasLoggedIn,
    supabase,
    router,
    isLoading,
    setError,
    setIsLoading,
    setHasLoggedIn,
  ]);

  /**
   * Reindirizza l'utente alla schermata di registrazione.
   */
  const handleRegisterRedirect = () => {
    router.replace("/(auth)/registrazione");
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    isLoading,
    error,
    focusedInput,
    setFocusedInput,
    isEmailValid,
    isFormValid,
    handleLogin,
    handleRegisterRedirect,
  };
};

/*
// File: hooks/useLoginLogic.tsx

import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthProvider';

/**
 * Hook personalizzato per gestire la logica della pagina di login.
 * Si occupa dello stato dei form, della validazione e delle chiamate API.
 */
/*
export const useLoginLogic = () => {
  const router = useRouter();
  const { signIn } = useAuth(); // Ottiene la funzione di login dal contesto di autenticazione

  // Stato per i campi del modulo
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Stato per la UI
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>(''); // Corretto: inizializzato con una stringa vuota
  const [focusedInput, setFocusedInput] = useState('');

  // Funzione di validazione dell'email
  const isEmailValid = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  // Memoizza la validità del form per evitare ricalcoli non necessari
  const isFormValid = useMemo(() => {
    return isEmailValid(email) && password.length > 0;
  }, [email, password]);

  /**
   * Gestisce il processo di login.
   * Chiama la funzione signIn del provider di autenticazione.
   */
/*
  const handleLogin = async () => {
    if (!isFormValid) {
      setError('Inserisci email e password validi.');
      return;
    }

    setIsLoading(true);
    setError(''); // Corretto: azzera l'errore con una stringa vuota

    try {
      await signIn(email, password);
      // La navigazione viene gestita dal provider di autenticazione
      // o dal listener di stato del router, a seconda dell'implementazione.
    } catch (err: any) {
      console.error('Errore nel login:', err);
      setError(err.message || 'Credenziali non valide. Riprova.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Reindirizza l'utente alla schermata di registrazione.
   */
/*
  const handleRegisterRedirect = () => {
    router.replace('/(auth)/registrazione');
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    isLoading,
    error,
    focusedInput,
    setFocusedInput,
    isEmailValid,
    isFormValid,
    handleLogin,
    handleRegisterRedirect,
  };
};
*/
