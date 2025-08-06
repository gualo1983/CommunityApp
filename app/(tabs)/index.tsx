// app/(tabs)/index.tsx
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { useTheme } from '../../contexts/theme'; // Importa useTheme

// Definiamo un'interfaccia per tipizzare i nostri oggetti evento.
interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  category: string;
}

// Dati fittizi per gli eventi, ora tipizzati con l'interfaccia Event.
const DUMMY_EVENTS: Event[] = [
  { id: '1', title: 'Messa Domenicale', date: '04 Agosto 2025', location: 'Parrocchia San Pietro', category: 'Parrocchiale' },
  { id: '2', title: 'Pellegrinaggio Diocesano', date: '10 Agosto 2025', location: 'Santuario di Loreto', category: 'Diocesano' },
  { id: '3', title: 'Conferenza Nazionale Giovani', date: '20 Settembre 2025', location: 'Roma', category: 'Nazionale' },
  { id: '4', title: 'Incontro Gruppo Caritas', date: '05 Agosto 2025', location: 'Parrocchia San Pietro', category: 'Parrocchiale' },
  { id: '5', title: 'Giornata Mondiale della Gioventù', date: 'Ottobre 2025', location: 'Lisbona', category: 'Internazionale' },
  { id: '6', title: 'Corso Prematrimoniale', date: 'Settembre 2025', location: 'Diocesi di Milano', category: 'Diocesano' },
];

// Funzione per renderizzare un singolo evento, ora con un tipo esplicito 'Event'.
const renderEventCard = (event: Event, themeColors: any) => ( // Passa themeColors
  <View key={event.id} style={[styles.eventCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.cardBorder }]}>
    <Text style={[styles.eventTitle, { color: themeColors.text }]}>{event.title}</Text>
    <Text style={[styles.eventDetails, { color: themeColors.textSecondary }]}>{event.date} - {event.location}</Text>
    <Text style={[styles.eventCategory, { color: themeColors.primary }]}>{event.category}</Text>
  </View>
);

const EventsScreen = () => {
  const { theme } = useTheme(); // Accedi al tema

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* L'intestazione è ora gestita dal file app/(tabs)/_layout.tsx */}
      <ScrollView style={styles.eventsList}>
        {DUMMY_EVENTS.map(event => renderEventCard(event, theme.colors))} {/* Passa i colori del tema */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor gestito dinamicamente
  },
  eventsList: {
    padding: 10,
  },
  eventCard: {
    // backgroundColor e borderColor gestiti dinamicamente
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    // color gestito dinamicamente
    marginBottom: 5,
  },
  eventDetails: {
    fontSize: 14,
    // color gestito dinamicamente
    marginBottom: 3,
  },
  eventCategory: {
    fontSize: 12,
    // color gestito dinamicamente
    fontWeight: '500',
    alignSelf: 'flex-end',
    marginTop: 5,
  },
});

export default EventsScreen;
