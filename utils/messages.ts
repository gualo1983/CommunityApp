// File: utils/messages.ts

import { Conversation } from '../interfaces/message';

export const DUMMY_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv1',
    requestTitle: 'Richiesta di aiuto per trasloco',
    messages: [
      {
        id: 'msg1',
        senderName: 'Mario Rossi',
        content: 'Ciao, sono interessato alla richiesta di trasloco. Ho esperienza e sono disponibile il giorno 8 agosto. Fammi sapere!',
        timestamp: new Date('2025-08-06T15:00:00Z'),
        isRead: false,
        isMe: false,
      },
      {
        id: 'msg2',
        senderName: 'Tu',
        content: 'Ciao Mario, grazie per il tuo interesse! Puoi darmi maggiori dettagli sulla tua disponibilità oraria?',
        timestamp: new Date('2025-08-06T15:05:00Z'),
        isRead: true,
        isMe: true,
      },
    ],
    isUnread: true,
  },
  {
    id: 'conv2',
    requestTitle: 'Volontari per mensa Caritas',
    messages: [
      {
        id: 'msg3',
        senderName: 'Giulia Verdi',
        content: 'Buonasera, mi sono appena trasferita in zona e vorrei rendermi utile. Sono disponibile il mercoledì sera.',
        timestamp: new Date('2025-08-05T18:30:00Z'),
        isRead: false,
        isMe: false,
      },
    ],
    isUnread: true,
  },
  {
    id: 'conv3',
    requestTitle: 'Supporto per doposcuola',
    messages: [
      {
        id: 'msg4',
        senderName: 'Marco Bianchi',
        content: 'Buongiorno, ho letto l\'annuncio per il doposcuola. Ho una laurea in scienze dell\'educazione. Avete ancora bisogno di aiuto?',
        timestamp: new Date('2025-08-04T09:10:00Z'),
        isRead: true,
        isMe: false,
      },
      {
        id: 'msg5',
        senderName: 'Tu',
        content: 'Buongiorno Marco, si abbiamo ancora bisogno. Saremmo felici di fare un colloquio conoscitivo. Che giorno saresti libero?',
        timestamp: new Date('2025-08-04T10:00:00Z'),
        isRead: true,
        isMe: true,
      },
      {
        id: 'msg6',
        senderName: 'Marco Bianchi',
        content: 'Sono libero venerdì pomeriggio alle 15:00. Ti va bene?',
        timestamp: new Date('2025-08-05T11:20:00Z'),
        isRead: true,
        isMe: false,
      },
    ],
    isUnread: false,
  },
];