// File: hooks/useEvents.ts

import { useEffect, useState } from 'react';
import { useSupabase } from '../contexts/SupabaseProvider';
import { getItem, setItem } from '../utils/storage'; // Importa i nuovi wrapper

// Interfaccia per i dati della parrocchia recuperati dalla join
export interface Parrocchia {
  id: string;
  name: string;
  citta: string;
}

// Interfaccia per la struttura completa di un evento, inclusi i dati della parrocchia
export interface Evento {
  id: string;
  title: string;
  data: string;
  location: string;
  category: string;
  image_url?: string;
  image_text?: string;
  description?: string;
  external_link?: string;
  parrocchie: Parrocchia; 
  isLiked: boolean;
}

// Hook personalizzato per recuperare gli eventi dal database Supabase con caching
export const useEvents = () => {
  const { supabase } = useSupabase();
  const [events, setEvents] = useState<Evento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndCacheEvents = async () => {
      setIsLoading(true);

      try {
        // 1. Tenta di caricare gli eventi dalla cache usando il wrapper
        const cachedEvents = await getItem('events');
        if (cachedEvents) {
          setEvents(JSON.parse(cachedEvents) as Evento[]);
          setError(null);
        } else {
          setEvents([]);
        }

        // 2. Recupera i dati aggiornati dal database
        const { data, error } = await supabase
          .from('eventi')
          .select('*, parrocchie(name, citta)')
          .order('data', { ascending: true });

        if (error) {
          throw error;
        }

        // 3. Salva i nuovi dati in cache usando il wrapper
        if (data) {
          await setItem('events', JSON.stringify(data));
          setEvents(data as Evento[]);
        }
        
        setError(null);
      } catch (err: any) {
        console.error("Errore nel recupero degli eventi:", err.message);
        setError("Impossibile caricare gli eventi.");
        
        const cachedEvents = await getItem('events');
        if (!cachedEvents) {
          setEvents([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndCacheEvents();
  }, [supabase]);

  return { events, isLoading, error };
};



/*
// File: hooks/useEvents.ts

import { useEffect, useState } from 'react';
import { useSupabase } from '../contexts/SupabaseProvider';

// Interfaccia per i dati della parrocchia recuperati dalla join
export interface Parrocchia {
  id: string;
  name: string;
  citta: string;
}

// Interfaccia per la struttura completa di un evento, inclusi i dati della parrocchia
export interface Evento {
  id: string;
  title: string;
  data: string;
  location: string;
  category: string;
  image_url?: string;
  image_text?: string;
  description?: string;
  external_link?: string;
  parrocchie: Parrocchia; 
  isLiked: boolean;
}

// Hook personalizzato per recuperare gli eventi dal database Supabase
export const useEvents = () => {
  const { supabase } = useSupabase();
  const [events, setEvents] = useState<Evento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Funzione asincrona per recuperare i dati
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        // La query usa '*, parrocchie(name, citta)' per fare una JOIN implicita
        // e recuperare i campi 'name' e 'citta' dalla tabella 'parrocchie'.
        const { data, error } = await supabase
          .from('eventi')
          .select('*, parrocchie(name, citta)')
          .order('data', { ascending: true }); // Ordina gli eventi per data

        if (error) {
          throw error;
        }

        // Imposta i dati e il caricamento a falso
        setEvents(data as Evento[]);
        setError(null);
      } catch (err: any) {
        // Gestisce gli errori
        console.error("Errore nel recupero degli eventi:", err.message);
        setError("Impossibile caricare gli eventi.");
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [supabase]);

  // Restituisce lo stato corrente dell'operazione
  return { events, isLoading, error };
};
*/