// File: contexts/SupabaseProvider.tsx

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import React, { createContext, ReactNode, useContext, useState } from 'react';

// --- CONTESTO PER SUPABASE ---
interface SupabaseContextProps {
  supabase: SupabaseClient;
}

const SupabaseContext = createContext<SupabaseContextProps | undefined>(undefined);

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
}

// ⚠️ PER PRIMA COSA, DEVI INSTALLARE IL PACCHETTO SUPABASE
// Esegui questo comando nel terminale del tuo progetto:
// npm install @supabase/supabase-js

// ⚠️ DEVI SOSTITUIRE QUESTI VALORI CON IL TUO ENDPOINT E ID PROGETTO REALI DI SUPABASE ⚠️
// Li trovi nel tuo dashboard di Supabase, in Project Settings > API
const SUPABASE_URL = 'https://ybvcdsiaqixizmgujnqh.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlidmNkc2lhcWl4aXptZ3VqbnFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5OTY3MjgsImV4cCI6MjA3MDU3MjcyOH0.izbcjD3k8Xk4u1jfWbsvCgKR0Nm3B4p8wg5WUAKrXeg';

export const SupabaseProvider = ({ children }: { children: ReactNode }) => {
  const [supabase] = useState(() => createClient(SUPABASE_URL, SUPABASE_KEY));
  const value = { supabase };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
};
