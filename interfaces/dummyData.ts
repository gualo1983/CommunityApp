// File: data/dummyData.ts

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  category: string;
  imageUrl?: string;
  description?: string;
  externalLink?: string; 
}

export const DUMMY_EVENTS: Event[] = [
  { 
    id: '1', 
    title: 'Messa Domenicale', 
    date: '04 Agosto 2025', 
    location: 'Parrocchia San Pietro', 
    category: 'Parrocchiale',
    description: 'Partecipa alla messa domenicale nella nostra parrocchia. Un momento di preghiera e comunità.',
    imageUrl: 'https://images.pexels.com/photos/753639/pexels-photo-753639.jpeg',
    externalLink: 'https://www.google.com'
  },
  { 
    id: '2', 
    title: 'Pellegrinaggio Diocesano', 
    date: '10 Agosto 2025', 
    location: 'Santuario di Loreto', 
    category: 'Diocesano',
    description: 'Unisciti a noi per il pellegrinaggio annuale al Santuario di Loreto. Partenza alle ore 8:00.',
  },
  { id: '3', title: 'Conferenza Nazionale Giovani', date: '20 Settembre 2025', location: 'Roma', category: 'Nazionale' },
  { id: '4', title: 'Incontro Gruppo Caritas', date: '05 Agosto 2025', location: 'Parrocchia San Pietro', category: 'Parrocchiale' },
  { id: '5', title: 'Giornata Mondiale della Gioventù', date: 'Ottobre 2025', location: 'Lisbona', category: 'Internazionale' },
  { id: '6', title: 'Corso Prematrimoniale', date: 'Settembre 2025', location: 'Diocesi di Milano', category: 'Diocesano' },
];