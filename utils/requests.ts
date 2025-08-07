// File: utils/requests.ts

import { Request } from '../interfaces/request';

// Helper per calcolare l'urgenza di una richiesta
export const getUrgency = (expiresAt: Date): 'red' | 'yellow' | 'green' | 'expired' => {
  const remainingTime = expiresAt.getTime() - new Date().getTime();
  const remainingDays = remainingTime / (1000 * 60 * 60 * 24);

  if (remainingDays <= 0) return 'expired';
  if (remainingDays <= 5) return 'red';
  if (remainingDays <= 19) return 'yellow';
  return 'green';
};

// Dati fittizi (spostati qui per non appesantire il componente principale)
export const DUMMY_REQUESTS: Request[] = [
  {
    id: '1',
    title: 'Richiesta di aiuto per trasloco',
    shortDescription: 'Cercasi aiuto per il trasloco di una famiglia anziana. Necessari 2-3 volontari.',
    longDescription: 'Siamo una famiglia anziana che necessita di aiuto per un trasloco a breve. Chiediamo la disponibilità di 2-3 volontari per un paio d\'ore. La casa si trova in centro. Ringraziamo in anticipo per la disponibilità. Tutti gli attrezzi necessari saranno forniti. Il trasloco avverrà in un raggio di 2km.',
    createdAt: new Date('2025-07-01T10:00:00Z'),
    expiresAt: new Date('2025-08-08T10:00:00Z'),
  },
  {
    id: '2',
    title: 'Volontari per mensa Caritas',
    shortDescription: 'La mensa parrocchiale cerca volontari per il servizio serale del mercoledì.',
    longDescription: 'La mensa Caritas è un servizio vitale per la nostra comunità. Stiamo cercando volontari dedicati per aiutarci nel servizio dei pasti serali ogni mercoledì. Non è necessaria alcuna esperienza pregressa, solo un cuore generoso e la voglia di aiutare.',
    createdAt: new Date('2025-06-15T10:00:00Z'),
    expiresAt: new Date('2025-09-01T10:00:00Z'),
  },
  {
    id: '3',
    title: 'Supporto per doposcuola',
    shortDescription: 'Cercasi tutor volontario per supporto doposcuola per bambini della scuola elementare.',
    longDescription: 'L\'oratorio sta organizzando un servizio di doposcuola gratuito e ha bisogno di volontari per aiutare i bambini a fare i compiti. Cerchiamo persone pazienti e disponibili, con una buona conoscenza delle materie scolastiche di base. La frequenza è di 2 volte a settimana per 2 ore. Se interessati, potete contattarci per un breve colloquio conoscitivo.',
    createdAt: new Date('2025-05-10T10:00:00Z'),
    expiresAt: new Date('2025-10-15T10:00:00Z'),
  },
  {
    id: '4',
    title: 'Donazione di vestiti usati',
    shortDescription: 'Raccolta di vestiti usati in buono stato per i bisognosi. Servono soprattutto capi invernali.',
    longDescription: 'Organizziamo una raccolta di vestiti usati per le famiglie in difficoltà. Chiediamo in particolare capi invernali in buono stato. Le donazioni possono essere portate presso il salone parrocchiale durante gli orari indicati.',
    createdAt: new Date('2025-07-25T10:00:00Z'),
    expiresAt: new Date('2025-08-12T10:00:00Z'),
  },
  {
    id: '5',
    title: 'Manutenzione giardino parrocchiale',
    shortDescription: 'Aiuto per la potatura e pulizia del giardino parrocchiale. Attrezzatura fornita.',
    longDescription: 'Il giardino della parrocchia ha bisogno di un po\' di cure. Cerchiamo volontari per una giornata di manutenzione, per tagliare l\'erba e potare le siepi. Sarebbe un\'ottima occasione per socializzare e dare una mano alla comunità. Attrezzatura fornita dalla parrocchia. ',
    createdAt: new Date('2025-08-01T10:00:00Z'),
    expiresAt: new Date('2025-08-05T10:00:00Z'),
  },
];