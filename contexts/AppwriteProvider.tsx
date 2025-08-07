// File: contexts/AppwriteProvider.tsx

import { Account, Client, Databases } from 'appwrite';
import React, { createContext, ReactNode, useContext, useState } from 'react';

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
//const APPWRITE_PROJECT_ID = "6894b0ae0034f9497a7a";
//const APPWRITE_PUBLIC_ENDPOINT = "http://192.168.10.6:6880/v1";

export const AppwriteProvider = ({ children }: { children: ReactNode }) => {
  const [client] = useState(() => new Client()
    // ⚠️ DEVI SOSTITUIRE QUESTI VALORI CON IL TUO ENDPOINT E ID PROGETTO REALI DI APPWRITE ⚠️
    .setEndpoint('http://192.168.10.6:6880/v1')
    .setProject('6894b0ae0034f9497a7a')
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