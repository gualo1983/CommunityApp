import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthProvider';
import { useSupabase } from '../contexts/SupabaseProvider';

// Interfaccia per le parrocchie
interface Parrocchia {
  id: string;
  name: string;
  citta: string;
}

/**
 * Hook personalizzato per gestire la logica della pagina dati personali.
 * Gestisce il caricamento, il salvataggio dei dati e lo stato del form.
 */
export const usePersonalDataLogic = () => {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const router = useRouter();

  // Stato per i dati del profilo
  const [primoLogin, setPrimoLogin] = useState(true);
  const [nome, setNome] = useState('');
  const [cognome, setCognome] = useState('');
  const [email, setEmail] = useState('');
  const [comuneResidenza, setComuneResidenza] = useState('');
  const [dataNascita, setDataNascita] = useState('');
  const [parrocchiaRiferimentoId, setParrocchiaRiferimentoId] = useState<string>('');

  // Stato per le opzioni delle parrocchie
  const [parrocchie, setParrocchie] = useState<Parrocchia[]>([]);

  // Stati per la UI
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [error, setError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isDataFetched, setIsDataFetched] = useState(false);

  // Validazione del formato email
  const isEmailValid = (email: string) => /\S+@\S+\.\S+/.test(email);

  // Fetch dei dati dell'utente e delle parrocchie. Esegue solo una volta o quando l'utente cambia.
  useEffect(() => {
    const fetchData = async () => {
      if (!user || isDataFetched) {
        setIsFetchingData(false);
        return;
      }
      
      setIsFetchingData(true);
      try {
        // Recupera i dati dell'utente
        const { data: userData, error: userError } = await supabase
          .from('utenti')
          .select('nome, cognome, email, comune_residenza, data_nascita, primo_login, parrocchia_riferimento_id')
          .eq('id', user.id)
          .single();

        if (userError) throw userError;

        if (userData) {
          setNome(userData.nome || '');
          setCognome(userData.cognome || '');
          setEmail(userData.email || '');
          setComuneResidenza(userData.comune_residenza || '');
          setDataNascita(userData.data_nascita || '');
          setPrimoLogin(userData.primo_login);
          setParrocchiaRiferimentoId(userData.parrocchia_riferimento_id || '');
        }

        // Recupera tutte le parrocchie
        const { data: parrocchieData, error: parrocchieError } = await supabase
          .from('parrocchie')
          .select('id, name, citta');

        if (parrocchieError) throw parrocchieError;
        
        setParrocchie(parrocchieData);
        setIsDataFetched(true);

      } catch (err) {
        console.error("Errore nel recupero dei dati:", err);
        setError("Impossibile caricare i dati. Riprova.");
      } finally {
        setIsFetchingData(false);
      }
    };
    
    fetchData();
  }, [user, supabase, isDataFetched]);

  // Usa useMemo per ordinare le parrocchie solo quando cambia il comune di residenza o l'elenco delle parrocchie
  const sortedParrocchie = useMemo(() => {
    return [...parrocchie].sort((a, b) => {
      if (a.citta === comuneResidenza && b.citta !== comuneResidenza) {
        return -1;
      }
      if (a.citta !== comuneResidenza && b.citta === comuneResidenza) {
        return 1;
      }
      return 0;
    });
  }, [parrocchie, comuneResidenza]);

  // Funzione per il salvataggio dei dati
  const handleSave = async () => {
    if (!user) {
      setError("Utente non autenticato. Riprova il login.");
      return;
    }
    
    setIsLoading(true);
    setError(''); // Pulisce l'errore all'inizio del salvataggio

    try {
      if (!comuneResidenza || !dataNascita || !isEmailValid(email)) {
        setError('Si prega di compilare tutti i campi obbligatori e inserire un\'email valida.');
        setIsLoading(false);
        return;
      }

      // 1. Aggiorna l'email nel sistema di autenticazione Supabase se è cambiata
      // Confronta la nuova email con quella attuale dell'utente loggato
      if (email !== user.email) {
        // Logga l'email che viene inviata per debugging
        console.log("Tentativo di aggiornare l'email a:", email);
        
        const { error: authUpdateError } = await supabase.auth.updateUser({ email });
        if (authUpdateError) {
          // Logga l'intero oggetto errore per debugging
          console.error("Errore completo da Supabase:", authUpdateError);
          // Gestione specifica dell'errore di validazione dell'email di Supabase
          setError(`L'indirizzo email non è valido per il sistema di autenticazione di Supabase: ${authUpdateError.message}`);
          setIsLoading(false);
          return;
        }

        // Ricarica esplicitamente la sessione dell'utente dopo l'aggiornamento
        await supabase.auth.refreshSession();
      }

      // 2. Aggiorna gli altri dati nella tua tabella personalizzata 'utenti'
      const { error: updateError } = await supabase
        .from('utenti')
        .update({
          email: email,
          comune_residenza: comuneResidenza,
          data_nascita: dataNascita,
          primo_login: false, 
          parrocchia_riferimento_id: parrocchiaRiferimentoId,
        })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      console.log('Profilo utente aggiornato con successo!');
      setShowConfirmation(true); // Mostra il popup di conferma
    } catch (err) {
      console.error('Errore nel salvataggio dei dati personali:', err);
      setError('Si è verificato un errore nel salvataggio. Riprova.');
    } finally {
      setIsLoading(false);
    }
  };

  // Funzione per gestire la chiusura del modal e il reindirizzamento
  const handleModalClose = () => {
    setShowConfirmation(false);
    router.push('/');
  };

  return {
    // Stati e funzioni per la UI
    primoLogin,
    nome,
    cognome,
    email,
    setEmail,
    comuneResidenza,
    setComuneResidenza,
    dataNascita,
    setDataNascita,
    parrocchiaRiferimentoId,
    setParrocchiaRiferimentoId,
    parrocchie: sortedParrocchie, // Espone l'array di parrocchie ordinato
    isEmailValid,
    isLoading,
    isFetchingData,
    error,
    handleSave,
    showConfirmation,
    handleModalClose,
  };
};



/*
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthProvider';
import { useSupabase } from '../contexts/SupabaseProvider';

// Hook personalizzato per gestire la logica della pagina dati personali.
//  Gestisce il caricamento, il salvataggio dei dati e lo stato del form.

export const usePersonalDataLogic = () => {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const router = useRouter();

  // Stati per i campi del form
  const [comuneResidenza, setComuneResidenza] = useState('');
  const [dataNascita, setDataNascita] = useState('');
  
  // Stati per la UI
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [error, setError] = useState('');

  // Fetch dei dati dell'utente al caricamento della pagina
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setIsFetchingData(false);
        return;
      }
      
      setIsFetchingData(true);
      try {
        const { data, error } = await supabase
          .from('utenti')
          .select('comune_residenza, data_nascita')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        
        if (data) {
          setComuneResidenza(data.comune_residenza || '');
          setDataNascita(data.data_nascita || '');
        }
      } catch (err) {
        console.error("Errore nel recupero dei dati utente:", err);
        setError("Impossibile caricare i dati utente.");
      } finally {
        setIsFetchingData(false);
      }
    };
    
    fetchUserData();
  }, [user, supabase]);

  const handleSave = async () => {
    if (!user) {
      setError("Utente non autenticato. Riprova il login.");
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      if (!comuneResidenza || !dataNascita) {
        setError('Si prega di compilare tutti i campi obbligatori.');
        setIsLoading(false);
        return;
      }

      const { error: updateError } = await supabase
        .from('utenti')
        .update({
          comune_residenza: comuneResidenza,
          data_nascita: dataNascita,
          primo_login: false, 
        })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      console.log('Profilo utente aggiornato con successo!');
      // Reindirizziamo l'utente alla home page
      router.push('/');
    } catch (err) {
      console.error('Errore nel salvataggio dei dati personali:', err);
      setError('Si è verificato un errore nel salvataggio. Riprova.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    comuneResidenza,
    setComuneResidenza,
    dataNascita,
    setDataNascita,
    isLoading,
    isFetchingData,
    error,
    handleSave,
  };
};
*/
