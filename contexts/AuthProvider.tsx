// File: contexts/AuthProvider.tsx

import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { useAppwrite } from './AppwriteProvider';

// --- CONTESTO PER L'AUTENTICAZIONE ---
interface AuthContextProps {
  isAuthenticated: boolean;
  user: any; // User object from Appwrite
  isLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  client: any; // Aggiungiamo il client Appwrite al contesto di autenticazione
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve essere usato all\'interno di un AuthProvider');
  }
  return context;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
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