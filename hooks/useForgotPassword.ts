import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { useSupabase } from '../contexts/SupabaseProvider';

/**
 * Hook personalizzato per gestire il flusso di recupero e aggiornamento della password.
 */
export const useForgotPassword = () => {
  const router = useRouter();
  const { supabase } = useSupabase();

  // Stati per la fase 1: richiesta via email
  const [email, setEmail] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  
  // Stati per la fase 2: aggiornamento password
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Funzioni di validazione
  const isEmailValid = (input: string) => /^\S+@\S+\.\S+$/.test(input);
  
  // Logica di validazione della password
  const passwordValidation = useMemo(() => ({
    hasMinLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSymbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password),
  }), [password]);

  const isPasswordValid = Object.values(passwordValidation).every(Boolean);

  /**
   * Invia l'email per il recupero password.
   */
  const handleRequestPasswordReset = async () => {
    setError('');
    if (!isEmailValid(email)) {
      setError('Inserisci un\'email valida.');
      return;
    }

    setIsLoading(true);
    try {
      const redirectToUrl = 'http://localhost:8081/new_password_form';
      
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectToUrl,
      });

      if (resetError) {
        throw resetError;
      }
      
      setIsEmailSent(true);
      setError('');

    } catch (err) {
      console.error(err);
      setError('Si è verificato un errore. Assicurati che l\'email sia corretta.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Aggiorna la password dell'utente dopo aver cliccato sul link.
   */
  const handleUpdatePassword = async () => {
    setError('');
    if (!isPasswordValid || password !== confirmPassword) {
      setError('Le password non corrispondono o non sono valide.');
      return;
    }

    setIsLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password: password });

      if (updateError) {
        // Gestione specifica dell'errore per password vecchia
        if (updateError.message.includes('New password is too similar to old password.')) {
            throw new Error('La nuova password non può essere uguale alla vecchia.');
        }
        throw updateError;
      }

      setPasswordResetSuccess(true);
      router.replace('/login'); // Reindirizza l'utente alla schermata di login

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Si è verificato un errore durante l\'aggiornamento della password.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    isLoading,
    error,
    isEmailValid,
    isPasswordValid,
    passwordValidation,
    isEmailSent,
    passwordResetSuccess,
    handleRequestPasswordReset,
    handleUpdatePassword,
  };
};
