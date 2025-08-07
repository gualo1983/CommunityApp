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