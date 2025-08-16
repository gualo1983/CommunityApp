import { useState } from "react";

//import { useRouter } from 'expo-router';
import { useSupabase } from "../contexts/SupabaseProvider"; // Assumendo che esista un SupabaseProvider

/**
 * Hook personalizzato per gestire la logica di autenticazione (login e registrazione)
 * tramite provider social di Supabase.
 */
export const useSocialAuth = () => {
  //const router = useRouter();
  const { supabase } = useSupabase();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Gestisce l'autenticazione con un provider social.
   * Questo metodo gestisce sia il login che la registrazione di nuovi utenti.
   * @param provider Il nome del provider (es. 'google', 'facebook', 'apple').
   */
  const handleSocialAuth = async (
    provider: "google" | "facebook" | "apple",
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      // Supabase gestisce automaticamente se l'utente è nuovo (registrazione)
      // o se esiste già (login).
      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: provider,
      });

      if (signInError) {
        throw signInError;
      }

      // La chiamata a signInWithOAuth reindirizzerà l'utente al provider.
      // Dopo l'autenticazione, l'utente tornerà alla tua app.
      // Non è necessario gestire la navigazione qui.
    } catch (err) {
      console.error(`Errore durante l'autenticazione con ${provider}:`, err);
      setError(
        `Si è verificato un errore durante l'autenticazione con ${provider}.`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = () => handleSocialAuth("google");
  const handleFacebookAuth = () => handleSocialAuth("facebook");
  const handleAppleAuth = () => handleSocialAuth("apple");

  return {
    isLoading,
    error,
    handleGoogleAuth,
    handleFacebookAuth,
    handleAppleAuth,
  };
};
