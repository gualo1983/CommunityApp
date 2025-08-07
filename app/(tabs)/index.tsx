// File: app/(tabs)/index.tsx (versione aggiornata)

import React, { useState } from 'react'; // Importa useState
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import EventCard from '../../components/EventCard';
import EventDetailModal from '../../components/EventDetailModal'; // Importa il nuovo componente
import { useTheme } from '../../contexts/theme';
import { DUMMY_EVENTS, Event } from '../../interfaces/dummyData'; // Importa anche Event

const EventsScreen = () => {
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false); // Stato per la visibilità del modal
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null); // Stato per l'evento selezionato

  const openEventModal = (event: Event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const closeEventModal = () => {
    setSelectedEvent(null);
    setModalVisible(false);
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      flex: 1,
    },
    eventsList: {
      padding: 10,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.eventsList}>
        {DUMMY_EVENTS.map(event => (
          <EventCard
            key={event.id}
            event={event}
            onPress={() => openEventModal(event)} // Aggiungi la prop onPress
          />
        ))}
      </ScrollView>
      <EventDetailModal
        isVisible={modalVisible}
        onClose={closeEventModal}
        event={selectedEvent}
      />
    </SafeAreaView>
  );
};

export default EventsScreen;