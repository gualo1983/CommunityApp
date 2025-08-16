// File: requests.tsx

import React from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import MessageModal from "../../components/MessageModal";
import RequestCard from "../../components/RequestCard";
import RequestModal from "../../components/RequestModal";
import { useTheme } from "../../contexts/theme";
import { useRequestsLogic } from "../../hooks/useRequestsLogic";

const RequestsScreen = () => {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;

  const {
    sortedRequests,
    isLoading, // Aggiunto stato di caricamento
    error, // Aggiunto stato di errore
    modalVisible,
    isMessageModalVisible,
    selectedRequest,
    openRequestModal,
    closeRequestModal,
    handleSendMessage,
    handleMessageSend,
    setIsMessageModalVisible,
  } = useRequestsLogic();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      flex: 1,
    },
    content: {
      flex: 1,
      padding: 20,
      ...(isLargeScreen && {
        alignItems: "center",
        justifyContent: "center",
      }),
    },
    messageContainer: {
      alignItems: "center",
      flex: 1,
      justifyContent: "center",
    },
    messageText: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSizes.medium,
      textAlign: "center",
    },
    scrollView: {
      flex: 1, // Aggiunto per abilitare lo scrolling
    },
  });

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.messageContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.messageText}>Caricamento richieste...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          {sortedRequests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              onPress={() => openRequestModal(request)}
            />
          ))}
        </ScrollView>
      </View>
      <RequestModal
        visible={modalVisible}
        onClose={closeRequestModal}
        request={selectedRequest}
        onSendMessage={handleSendMessage}
      />
      <MessageModal
        visible={isMessageModalVisible}
        onClose={() => setIsMessageModalVisible(false)}
        requestTitle={selectedRequest?.title || null}
        onSend={handleMessageSend}
      />
    </SafeAreaView>
  );
};

export default RequestsScreen;

/*
// File: requests.tsx

import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import MessageModal from '../../components/MessageModal';
import RequestCard from '../../components/RequestCard';
import RequestModal from '../../components/RequestModal';
import { useTheme } from '../../contexts/theme';
import { useRequestsLogic } from '../../hooks/useRequestsLogic';

const RequestsScreen = () => {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;

  const {
    sortedRequests,
    modalVisible,
    isMessageModalVisible,
    selectedRequest,
    openRequestModal,
    closeRequestModal,
    handleSendMessage,
    handleMessageSend,
    setIsMessageModalVisible,
  } = useRequestsLogic();

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
        justifyContent: 'center',
      }),
    },
    scrollContent: {
      maxWidth: isLargeScreen ? 600 : '100%',
      paddingHorizontal: isLargeScreen ? 0 : 10,
      width: '100%',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {sortedRequests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              onPress={() => openRequestModal(request)}
            />
          ))}
        </ScrollView>
      </View>
      <RequestModal
        visible={modalVisible}
        onClose={closeRequestModal}
        request={selectedRequest}
        onSendMessage={handleSendMessage}
      />
      <MessageModal
        visible={isMessageModalVisible}
        onClose={() => setIsMessageModalVisible(false)}
        requestTitle={selectedRequest?.title || null}
        onSend={handleMessageSend}
      />
    </SafeAreaView>
  );
};

export default RequestsScreen;
*/
