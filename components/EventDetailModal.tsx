// File: components/EventDetailModal.tsx (versione aggiornata)

import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react'; // Importa useState
import { Image, Linking, Modal, Platform, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native'; // Importa Share e Platform
import { useTheme } from '../contexts/theme';
import { Evento } from '../hooks/useEvents'; // Importa la nuova interfaccia Evento

interface EventDetailModalProps {
  isVisible: boolean;
  onClose: () => void;
  event: Evento | null; // Aggiorna il tipo a Evento
}

const EventDetailModal: React.FC<EventDetailModalProps> = ({ isVisible, onClose, event }) => {
  const { theme } = useTheme();

  // Stato per il pulsante "Mi piace"
  const [isLiked, setIsLiked] = useState(false);

  if (!event) {
    return null;
  }

  // Formatta la data per renderla leggibile
  const formattedDate = new Date(event.data).toLocaleDateString('it-IT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  
  // Gestisce il click sul link esterno
  const handleLinkPress = () => {
    if (event.external_link) {
      // Controlla se l'URL ha già un protocollo e lo aggiunge se manca
      const url = event.external_link.startsWith('http://') || event.external_link.startsWith('https://')
        ? event.external_link
        : `https://${event.external_link}`;
        
      Linking.openURL(url).catch(err => console.error('Failed to open link:', err));
    }
  };

  // Funzione per aggiungere l'evento al calendario del dispositivo (o del web)
  const addToCalendar = () => {
    // Logica specifica per il web
    if (Platform.OS === 'web') {
      const eventStart = new Date(event.data);
      const eventEnd = new Date(eventStart.getTime() + 60 * 60 * 1000); // Durata evento di 1 ora
      
      const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//My App//NONSGML v1.0//EN
BEGIN:VEVENT
UID:${event.id}
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${eventStart.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTEND:${eventEnd.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
SUMMARY:${event.title}
DESCRIPTION:${event.description || ''}
LOCATION:${event.parrocchie.name}
END:VEVENT
END:VCALENDAR`;

      const blob = new Blob([icsContent], { type: 'text/calendar' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${event.title}.ics`;
      a.click();
      URL.revokeObjectURL(url);
      
      alert('Il file del calendario è stato scaricato. Aprilo per aggiungere l\'evento.');
      return;
    }

    // Logica nativa per iOS e Android
    // ... La logica originale rimane invariata per le app native
    
    // La logica qui varia in base alla piattaforma (iOS/Android)
    // const eventStartDate = new Date(event.data).toISOString();
    // const eventEndDate = new Date(new Date(event.data).getTime() + 60 * 60 * 1000).toISOString(); // L'evento dura un'ora

    let url = '';
    if (Platform.OS === 'ios') {
      // iOS non ha un'API Linking standard per il calendario
      // Si può usare un servizio esterno o una libreria dedicata
      alert('Questa funzionalità non è ancora supportata su iOS.');
      return;
    } else { // Android
      url = `content://com.android.calendar/events?title=${encodeURIComponent(event.title)}&description=${encodeURIComponent(event.description || '')}&eventLocation=${encodeURIComponent(event.parrocchie.name)}&beginTime=${new Date(event.data).getTime()}&endTime=${new Date(event.data).getTime() + 60*60*1000}`;
    }
    
    Linking.openURL(url)
      .catch(err => console.error('Failed to open calendar:', err));
  };

  // Funzione per condividere l'evento (o del web)
  const shareEvent = async () => {
    // Messaggio di default per la condivisione
    const shareMessage = `Ciao, ho trovato un evento interessante: ${event.title}!\n\n` +
          `Quando: ${formattedDate}\n` +
          `Dove: ${event.parrocchie.name}\n\n` +
          `Scopri di più qui: ${event.external_link || 'Nessun link disponibile'}`;

    // Logica specifica per il web
    if (Platform.OS === 'web') {
      try {
        if (navigator.share) {
          await navigator.share({
            title: event.title,
            text: shareMessage,
            url: event.external_link || window.location.href,
          });
        } else {
          // Fallback se l'API Web Share non è disponibile: copia negli appunti
          await navigator.clipboard.writeText(shareMessage);
          alert('Dettagli dell\'evento copiati negli appunti!');
        }
      } catch (error) {
        console.error('Errore durante la condivisione web:', error);
      }
      return;
    }

    // Logica nativa per iOS e Android
    try {
      const result = await Share.share({
        message: shareMessage,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Condiviso con successo
        } else {
          // Condivisione annullata
        }
      } else if (result.action === Share.dismissedAction) {
        // Condivisione annullata
      }
    } catch (error: any) {
      alert(error.message);
    }
  };


  const styles = StyleSheet.create({
    actionButton: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
    },
    actionText: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSizes.small,
      marginTop: 5,
    },
    actionsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 20,
    },
    bottomCloseButton: {
      alignSelf: 'center',
      marginTop: 20,
      padding: 5,
    },
    closeButton: {
      padding: 5,
    },
    closeButtonText: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSizes.medium,
      fontWeight: theme.typography.fontWeights.bold,
    },
    details: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSizes.default,
      marginBottom: 20,
    },
    header: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 15,
    },
    image: {
      borderRadius: 10,
      height: 200,
      marginBottom: 15,
      width: '100%',
    },
    linkButton: {
      alignItems: 'center',
      backgroundColor: theme.colors.primary,
      borderRadius: 8,
      marginTop: 10,
      padding: 10,
    },
    linkText: {
      color: theme.colors.headerText,
      fontSize: theme.typography.fontSizes.medium,
      fontWeight: theme.typography.fontWeights.bold,
    },
    modalContainer: {
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 15,
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
      elevation: 8,
      maxWidth: 400,
      padding: 20,
      width: '90%',
    },
    modalOverlay: {
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      flex: 1,
      justifyContent: 'center',
    },
    title: {
      color: theme.colors.text,
      flex: 1,
      fontSize: theme.typography.fontSizes.large,
      fontWeight: theme.typography.fontWeights.bold,
      marginRight: 10,
    },
  });

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <ScrollView>
            <View style={styles.header}>
              <Text style={styles.title}>{event.title}</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>
            {/* Utilizziamo event.image_url e event.image_text */}
            {event.image_url && (
              <Image source={{ uri: event.image_url }} style={styles.image} onError={(e) => console.log('Errore nel caricamento dell\'immagine:', e.nativeEvent.error)}/>
            )}
            {/* Utilizziamo event.data e event.parrocchie.name */}
            <Text style={styles.details}>{formattedDate} - {event.parrocchie.name}</Text>
            <Text style={styles.details}>{event.category}</Text>
            {event.description && (
              <Text style={styles.details}>{event.description}</Text>
            )}
            {/* Utilizziamo event.external_link */}
            {event.external_link && (
              <TouchableOpacity style={styles.linkButton} onPress={handleLinkPress}>
                <Text style={styles.linkText}>Visita il sito web</Text>
              </TouchableOpacity>
            )}
            <View style={styles.actionsContainer}>
              <TouchableOpacity style={styles.actionButton} onPress={() => setIsLiked(!isLiked)}>
                <Ionicons name={isLiked ? 'heart' : 'heart-outline'} size={24} color={theme.colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={addToCalendar}>
                <Ionicons name="calendar-outline" size={24} color={theme.colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={shareEvent}>
                <Ionicons name="share-outline" size={24} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
          </ScrollView>
          <TouchableOpacity onPress={onClose} style={styles.bottomCloseButton}>
            <Text style={styles.closeButtonText}>Chiudi</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default EventDetailModal;



/*
// File: components/EventDetailModal.tsx (versione aggiornata)

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Linking, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'; // Importa Image e Linking
import { useTheme } from '../contexts/theme';
import { Event } from '../interfaces/dummyData';

interface EventDetailModalProps {
  isVisible: boolean;
  onClose: () => void;
  event: Event | null;
}

const EventDetailModal: React.FC<EventDetailModalProps> = ({ isVisible, onClose, event }) => {
  const { theme } = useTheme();

  if (!event) {
    return null;
  }

  const handleLinkPress = () => {
    if (event.externalLink) {
      Linking.openURL(event.externalLink).catch(err => console.error('Failed to open link:', err));
    }
  };

  const styles = StyleSheet.create({
    actionButton: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
    },
    actionText: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSizes.small,
      marginTop: 5,
    },
    actionsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 20,
    },
    bottomCloseButton: {
      alignSelf: 'center',
      marginTop: 20,
      padding: 5,
    },
    closeButton: {
      padding: 5,
    },
    closeButtonText: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSizes.medium,
      fontWeight: theme.typography.fontWeights.bold,
    },
    details: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSizes.default,
      marginBottom: 20,
    },
    header: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 15,
    },
    image: {
      borderRadius: 10,
      height: 200,
      marginBottom: 15,
      width: '100%',
    },
    linkButton: {
      alignItems: 'center',
      backgroundColor: theme.colors.primary,
      borderRadius: 8,
      marginTop: 10,
      padding: 10,
    },
    linkText: {
      color: theme.colors.headerText,
      fontSize: theme.typography.fontSizes.medium,
      fontWeight: theme.typography.fontWeights.bold,
    },
    modalContainer: {
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 15,
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
      elevation: 8,
      maxWidth: 400,
      padding: 20,
      width: '90%',
    },
    modalOverlay: {
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      flex: 1,
      justifyContent: 'center',
    },
    title: {
      color: theme.colors.text,
      flex: 1,
      fontSize: theme.typography.fontSizes.large,
      fontWeight: theme.typography.fontWeights.bold,
      marginRight: 10,
    },
  });

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <ScrollView>
            <View style={styles.header}>
              <Text style={styles.title}>{event.title}</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>
            {event.imageUrl && (
              <Image source={{ uri: event.imageUrl }} style={styles.image} onError={(e) => console.log('Errore nel caricamento dell\'immagine:', e.nativeEvent.error)}/>
            )}
            <Text style={styles.details}>{event.date} - {event.location}</Text>
            <Text style={styles.details}>{event.category}</Text>
            {event.description && (
              <Text style={styles.details}>{event.description}</Text>
            )}
            {event.externalLink && (
              <TouchableOpacity style={styles.linkButton} onPress={handleLinkPress}>
                <Text style={styles.linkText}>Visita il sito web</Text>
              </TouchableOpacity>
            )}
            <View style={styles.actionsContainer}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="heart-outline" size={24} color={theme.colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="calendar-outline" size={24} color={theme.colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="share-outline" size={24} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
          </ScrollView>
          <TouchableOpacity onPress={onClose} style={styles.bottomCloseButton}>
            <Text style={styles.closeButtonText}>Chiudi</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default EventDetailModal;
*/