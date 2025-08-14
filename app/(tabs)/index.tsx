import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';
import EventCard from '../../components/EventCard';
import EventDetailModal from '../../components/EventDetailModal';
import { useTheme } from '../../contexts/theme';
import { Evento, useEvents } from '../../hooks/useEvents';

export default function App() {
  const { theme } = useTheme();
  const { events, isLoading, error } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState<Evento | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState<Evento[]>([]);

  useEffect(() => {
    if (events && events.length > 0) {
      const sortedEvents = [...events].sort((a, b) => {
        // Ordina prima per stato "preferito" (isLiked: true va in cima)
        if (a.isLiked && !b.isLiked) {
          return -1;
        }
        if (!a.isLiked && b.isLiked) {
          return 1;
        }
        // Se lo stato di "preferito" è lo stesso, ordina per data
        const dateA = new Date(a.data).getTime();
        const dateB = new Date(b.data).getTime();
        return dateA - dateB;
      });
      setFilteredEvents(sortedEvents);
    }
  }, [events]);

  const handleCardPress = (event: Evento) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedEvent(null);
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      flex: 1,
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    errorText: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSizes.medium,
      textAlign: 'center',
    },
    header: {
      alignItems: 'center',
      backgroundColor: theme.colors.headerBackground,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 15,
    },
    headerTitle: {
      color: theme.colors.headerText,
      fontSize: theme.typography.fontSizes.large,
      fontWeight: theme.typography.fontWeights.bold,
    },
    loadingContainer: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
    },
    themeButton: {
      padding: 5,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Eventi</Text>
      </View>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>
            Errore nel caricamento degli eventi. Riprova più tardi.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredEvents}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <EventCard event={item} onPress={() => handleCardPress(item)} />
          )}
          contentContainerStyle={{ padding: 10 }}
        />
      )}
      <EventDetailModal
        isVisible={modalVisible}
        onClose={handleCloseModal}
        event={selectedEvent}
      />
    </SafeAreaView>
  );
}


/*
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
*/