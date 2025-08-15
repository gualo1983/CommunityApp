// File: msg.tsx

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import ConversationCard from '../components/ConversationCard';
import ConversationDetailModal from '../components/ConversationDetailModal';
import { useTheme } from '../contexts/theme';
import { useMessagesLogic } from '../hooks/useMessagesLogic';

const MessagesScreen = () => {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;
  const router = useRouter();

  const {
    sortedConversations,
    modalVisible,
    selectedConversation,
    openConversation,
    closeConversationModal,
    handleReply,
    isLoading,
  } = useMessagesLogic();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      flex: 1,
    },
    content: {
      flex: 1,
      padding: 20,
      ...(isLargeScreen && {
        alignItems: 'center',
      }),
    },
    headerBackButton: {
      marginLeft: 10,
    },
    placeholderText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSizes.medium,
      textAlign: 'center',
    },
    scrollContent: {
      maxWidth: isLargeScreen ? 400 : '100%',
      paddingHorizontal: isLargeScreen ? 0 : 10,
      width: '100%',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Messaggi',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: theme.colors.headerBackground,
          },
          headerTitleStyle: {
            color: theme.colors.headerText,
            fontSize: theme.typography.fontSizes.large,
            fontWeight: theme.typography.fontWeights.bold,
          },
          headerTintColor: theme.colors.headerText,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.headerBackButton}>
              <MaterialCommunityIcons name="arrow-left" size={24} color={theme.colors.headerText} />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.content}>
        {isLoading ? (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.placeholderText}>Caricamento messaggi...</Text>
            </View>
        ) : sortedConversations.length > 0 ? (
            <ScrollView contentContainerStyle={styles.scrollContent}>
              {sortedConversations.map((conv) => (
                <ConversationCard
                  key={conv.id}
                  conversation={conv}
                  onPress={() => openConversation(conv)}
                />
              ))}
            </ScrollView>
        ) : (
            <View style={styles.loadingContainer}>
                <Text style={styles.placeholderText}>Nessun messaggio ricevuto.</Text>
            </View>
        )}
      </View>
      <ConversationDetailModal
        visible={modalVisible}
        onClose={closeConversationModal}
        conversation={selectedConversation}
        onReply={handleReply}
      />
    </SafeAreaView>
  );
};

export default MessagesScreen;



/*
// File: msg.tsx

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import ConversationCard from '../components/ConversationCard';
import ConversationDetailModal from '../components/ConversationDetailModal';
import { useTheme } from '../contexts/theme';
import { useMessagesLogic } from '../hooks/useMessagesLogic';

const MessagesScreen = () => {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;
  const router = useRouter();

  const {
    sortedConversations,
    modalVisible,
    selectedConversation,
    openConversation,
    closeConversationModal,
    handleReply,
  } = useMessagesLogic();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      flex: 1,
    },
    content: {
      flex: 1,
      padding: 20,
      ...(isLargeScreen && {
        alignItems: 'center',
      }),
    },
    headerBackButton: {
      marginLeft: 10,
    },
    placeholderText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSizes.medium,
      textAlign: 'center',
    },
    scrollContent: {
      maxWidth: isLargeScreen ? 400 : '100%',
      paddingHorizontal: isLargeScreen ? 0 : 10,
      width: '100%',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Messaggi',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: theme.colors.headerBackground,
          },
          headerTitleStyle: {
            color: theme.colors.headerText,
            fontSize: theme.typography.fontSizes.large,
            fontWeight: theme.typography.fontWeights.bold,
          },
          headerTintColor: theme.colors.headerText,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.headerBackButton}>
              <MaterialCommunityIcons name="arrow-left" size={24} color={theme.colors.headerText} />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.content}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {sortedConversations.length > 0 ? (
            sortedConversations.map((conv) => (
              <ConversationCard
                key={conv.id}
                conversation={conv}
                onPress={() => openConversation(conv)}
              />
            ))
          ) : (
            <Text style={styles.placeholderText}>Nessun messaggio ricevuto.</Text>
          )}
        </ScrollView>
      </View>
      <ConversationDetailModal
        visible={modalVisible}
        onClose={closeConversationModal}
        conversation={selectedConversation}
        onReply={handleReply}
      />
    </SafeAreaView>
  );
};

export default MessagesScreen;
*/