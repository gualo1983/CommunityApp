// File: components/EventCard.tsx

import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/theme';
import { Evento } from '../hooks/useEvents'; // Importa l'interfaccia corretta

interface EventCardProps {
  event: Evento; // Usa la nuova interfaccia Evento
  onPress: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onPress  }) => {
  const { theme } = useTheme();

  // Formatta la data per renderla leggibile
  const formattedDate = new Date(event.data).toLocaleDateString('it-IT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const styles = StyleSheet.create({
    eventCard: {
      backgroundColor: theme.colors.cardBackground,
      borderColor: theme.colors.cardBorder,
      borderRadius: 10,
      boxShadow: '0px 1px 1.41px rgba(0, 0, 0, 0.20)',
      elevation: 2,
      marginBottom: 10,
      padding: 15,
      width: '100%',
    },
    eventCategory: {
      alignSelf: 'flex-end',
      color: theme.colors.text,
      fontSize: theme.typography.fontSizes.small,
      fontWeight: '500',
      marginTop: 5,
    },
    eventDetails: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSizes.default,
      marginBottom: 3,
    },
    eventTitle: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSizes.medium,
      fontWeight: 'bold',
      marginBottom: 5,
    },
  });

  return (
    <TouchableOpacity style={styles.eventCard} onPress={onPress}>
      <Text style={styles.eventTitle}>{event.title}</Text>
      {/* Utilizziamo event.data e event.parrocchie.name per visualizzare i dati corretti */}
      <Text style={styles.eventDetails}>{formattedDate} - {event.parrocchie.name}</Text>
      <Text style={styles.eventCategory}>{event.category}</Text>
    </TouchableOpacity>
  );
};

export default EventCard;


/*
// File: components/EventCard.tsx

import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/theme';
import { Event } from '../interfaces/dummyData';

interface EventCardProps {
  event: Event;
  onPress: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onPress  }) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    eventCard: {
      backgroundColor: theme.colors.cardBackground,
      borderColor: theme.colors.cardBorder,
      borderRadius: 10,
      boxShadow: '0px 1px 1.41px rgba(0, 0, 0, 0.20)',
      elevation: 2,
      marginBottom: 10,
      padding: 15,
      width: '100%',
    },
    eventCategory: {
      alignSelf: 'flex-end',
      color: theme.colors.text,
      fontSize: theme.typography.fontSizes.small,
      fontWeight: '500',
      marginTop: 5,
    },
    eventDetails: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSizes.default,
      marginBottom: 3,
    },
    eventTitle: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSizes.medium,
      fontWeight: 'bold',
      marginBottom: 5,
    },
  });

  return (
    <TouchableOpacity style={styles.eventCard} onPress={onPress}>
      <Text style={styles.eventTitle}>{event.title}</Text>
      <Text style={styles.eventDetails}>{event.date} - {event.location}</Text>
      <Text style={styles.eventCategory}>{event.category}</Text>
    </TouchableOpacity>
  );
};

export default EventCard;
*/