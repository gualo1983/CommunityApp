// File: interfaces/request.ts

export interface Request {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  createdAt: Date;
  expiresAt: Date;
}

// Nuova interfaccia per i dati che arrivano dal database
// I campi jsonb sono mappati come string
export interface SupabaseRequestResponse {
  id: string;
  titolo: string;
  descrizione_breve: string;
  descrizione_estesa: {
    dettagli: string;
  };
//  parrocchia_id: string;
//  utente_id: string;
  data_creazione: string;
  data_scadenza: string;
}