// File: hooks/useRegistrationLogic.ts

import { useRouter } from "expo-router";
import { useMemo, useState } from "react";

import { useAuth } from "../contexts/AuthProvider"; // Importa il contesto di autenticazione

// Interfaccia per la validazione della password
interface PasswordValidation {
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSymbol: boolean;
}

// Hook personalizzato per la logica di registrazione
export const useRegistrationLogic = () => {
  const router = useRouter();
  const { signUp } = useAuth(); // Utilizza la funzione di registrazione dal tuo AuthProvider

  // Stato per i campi del form
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Stato per la UI
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);

  // Stato per la validazione della password
  const [passwordValidation, setPasswordValidation] =
    useState<PasswordValidation>({
      hasMinLength: false,
      hasUppercase: false,
      hasLowercase: false,
      hasNumber: false,
      hasSymbol: false,
    });

  // Funzioni di validazione
  const validatePassword = (text: string) => {
    setPassword(text);
    setPasswordValidation({
      hasMinLength: text.length >= 8,
      hasUppercase: /[A-Z]/.test(text),
      hasLowercase: /[a-z]/.test(text),
      hasNumber: /[0-9]/.test(text),
      hasSymbol: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(text),
    });
  };

  const isEmailValid = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const isNameValid = (name: string) => {
    return name.trim().length > 0;
  };

  const isFormValid = useMemo(() => {
    const isPasswordMatch = password === confirmPassword;
    const isPasswordStrong = Object.values(passwordValidation).every(Boolean);
    return (
      isEmailValid(email) &&
      isNameValid(name) &&
      isNameValid(surname) &&
      isPasswordMatch &&
      isPasswordStrong
    );
  }, [email, name, surname, password, confirmPassword, passwordValidation]);

  // Gestione della registrazione
  const handleRegister = async () => {
    if (!isFormValid) {
      setError("Compila tutti i campi correttamente.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Chiama la funzione di registrazione dal provider
      await signUp(email, password, { nome: name, cognome: surname });

      // Se la registrazione ha successo, mostra il popup di conferma
      setShowConfirmationPopup(true);
    } catch (err: unknown) {
      // Cattura gli errori di Supabase
      if (err instanceof Error) {
        setError(err.message || "Errore durante la registrazione. Riprova.");
      } else {
        setError(
          "Si è verificato un errore sconosciuto durante la registrazione. Riprova.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Reindirizzamento alla pagina di login
  const handleLoginRedirect = () => {
    router.replace("/(auth)/login");
  };

  return {
    name,
    setName,
    surname,
    setSurname,
    email,
    setEmail,
    password,
    validatePassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    isLoading,
    error,
    focusedInput,
    setFocusedInput,
    passwordValidation,
    isEmailValid,
    isNameValid,
    isFormValid,
    handleRegister,
    handleLoginRedirect,
    showConfirmationPopup,
    setShowConfirmationPopup,
  };
};

/*
// File: hooks/useRegistrationLogic.ts

import { useRouter } from "expo-router";
import { useMemo, useState } from "react";

import { useAuth } from "../contexts/AuthProvider"; // Importa il contesto di autenticazione

// Interfaccia per la validazione della password
interface PasswordValidation {
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSymbol: boolean;
}

// Hook personalizzato per la logica di registrazione
export const useRegistrationLogic = () => {
  const router = useRouter();
  const { signUp } = useAuth(); // Utilizza la funzione di registrazione dal tuo AuthProvider

  // Stato per i campi del form
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Stato per la UI
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);

  // Stato per la validazione della password
  const [passwordValidation, setPasswordValidation] =
    useState<PasswordValidation>({
      hasMinLength: false,
      hasUppercase: false,
      hasLowercase: false,
      hasNumber: false,
      hasSymbol: false,
    });

  // Funzioni di validazione
  const validatePassword = (text: string) => {
    setPassword(text);
    setPasswordValidation({
      hasMinLength: text.length >= 8,
      hasUppercase: /[A-Z]/.test(text),
      hasLowercase: /[a-z]/.test(text),
      hasNumber: /[0-9]/.test(text),
      hasSymbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(text),
    });
  };

  const isEmailValid = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const isNameValid = (name: string) => {
    return name.trim().length > 0;
  };

  const isFormValid = useMemo(() => {
    const isPasswordMatch = password === confirmPassword;
    const isPasswordStrong = Object.values(passwordValidation).every(Boolean);
    return (
      isEmailValid(email) &&
      isNameValid(name) &&
      isNameValid(surname) &&
      isPasswordMatch &&
      isPasswordStrong
    );
  }, [email, name, surname, password, confirmPassword, passwordValidation]);

  // Gestione della registrazione
  const handleRegister = async () => {
    if (!isFormValid) {
      setError("Compila tutti i campi correttamente.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Chiama la funzione di registrazione dal provider
      await signUp(email, password, { nome: name, cognome: surname });

      // Se la registrazione ha successo, mostra il popup di conferma
      setShowConfirmationPopup(true);
    } catch (err: any) {
      // Cattura gli errori di Supabase
      setError(err.message || "Errore durante la registrazione. Riprova.");
    } finally {
      setIsLoading(false);
    }
  };

  // Reindirizzamento alla pagina di login
  const handleLoginRedirect = () => {
    router.replace("/(auth)/login");
  };

  return {
    name,
    setName,
    surname,
    setSurname,
    email,
    setEmail,
    password,
    validatePassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    isLoading,
    error,
    focusedInput,
    setFocusedInput,
    passwordValidation,
    isEmailValid,
    isNameValid,
    isFormValid,
    handleRegister,
    handleLoginRedirect,
    showConfirmationPopup,
    setShowConfirmationPopup,
  };
};
*/
