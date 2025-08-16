// File: components/ConversationCard.tsx

import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useTheme } from "../contexts/theme";
import { Conversation } from "../interfaces/message";

interface ConversationCardProps {
  conversation: Conversation;
  onPress: () => void;
}

// Definiamo gli stili statici al di fuori del componente per motivi di performance
const staticStyles = StyleSheet.create({
  card: {
    borderRadius: 10,
    boxShadow: "0px 1px 1.41px rgba(0, 0, 0, 0.20)",
    elevation: 2,
    marginBottom: 10,
    padding: 15,
    width: "100%",
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  lastMessage: {
    marginTop: 5,
  },
  senderInfo: {
    alignItems: "center",
    flexDirection: "row",
  },
});

const ConversationCard = ({ conversation, onPress }: ConversationCardProps) => {
  const { theme } = useTheme();
  const lastMessage = conversation.messages[conversation.messages.length - 1];
  const isUnread = lastMessage
    ? !lastMessage.isRead && !lastMessage.isMe
    : false;

  // Definiamo gli stili dinamici basati sullo stato
  const dynamicCardStyle = isUnread
    ? {
        backgroundColor: theme.colors.cardBackground,
        borderWidth: 2,
        borderColor: theme.colors.primary,
      }
    : {
        backgroundColor: theme.colors.cardBackground,
        borderWidth: 2,
        borderColor: theme.colors.cardBorder,
      };

  const senderNameStyle = {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSizes.small,
    fontWeight: isUnread
      ? theme.typography.fontWeights.bold
      : theme.typography.fontWeights.normal,
    marginRight: 5,
  };

  const lastMessageStyle = {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSizes.small,
  };

  const titleStyle = {
    color: theme.colors.text,
    fontSize: theme.typography.fontSizes.medium,
    fontWeight: theme.typography.fontWeights.bold,
  };

  const timestampStyle = {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSizes.small,
  };

  if (!lastMessage) return null;

  return (
    <TouchableOpacity
      style={[staticStyles.card, dynamicCardStyle]}
      onPress={onPress}
    >
      <View style={staticStyles.header}>
        <View style={staticStyles.senderInfo}>
          <Text style={senderNameStyle}>{lastMessage.senderName}</Text>
          {isUnread && (
            <MaterialCommunityIcons
              name="circle"
              size={10}
              color={theme.colors.primary}
            />
          )}
        </View>
        <Text style={timestampStyle}>
          {lastMessage.timestamp.toLocaleDateString()}
        </Text>
      </View>
      <Text style={titleStyle} numberOfLines={1}>
        R: {conversation.requestTitle}
      </Text>
      <Text
        style={[staticStyles.lastMessage, lastMessageStyle]}
        numberOfLines={2}
      >
        {lastMessage.content}
      </Text>
    </TouchableOpacity>
  );
};

export default ConversationCard;

/*
// File: components/ConversationCard.tsx

import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../contexts/theme';
import { Conversation } from '../interfaces/message';

interface ConversationCardProps {
  conversation: Conversation;
  onPress: () => void;
}

const ConversationCard = ({ conversation, onPress }: ConversationCardProps) => {
  const { theme } = useTheme();
  const lastMessage = conversation.messages[conversation.messages.length - 1];
  const isUnread = lastMessage ? !lastMessage.isRead && !lastMessage.isMe : false;
  const cardStyle = isUnread ? { backgroundColor: theme.colors.cardBackground, borderWidth: 2, borderColor: theme.colors.primary } : { backgroundColor: theme.colors.cardBackground, borderWidth: 2, borderColor: theme.colors.cardBorder };

  const styles = StyleSheet.create({
    card: {
      ...cardStyle,
      borderRadius: 10,
      boxShadow: '0px 1px 1.41px rgba(0, 0, 0, 0.20)',
      elevation: 2,
      marginBottom: 10,
      padding: 15,
      width: '100%',
    },
    header: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    lastMessage: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSizes.small,
      marginTop: 5,
    },
    senderInfo: {
      alignItems: 'center',
      flexDirection: 'row',
    },
    senderName: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSizes.small,
      fontWeight: isUnread ? theme.typography.fontWeights.bold : theme.typography.fontWeights.normal,
      marginRight: 5,
    },
    timestamp: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSizes.small,
      textAlign: 'right',
    },
    title: {
      color: theme.colors.text,
      flexShrink: 1,
      fontSize: theme.typography.fontSizes.medium,
      fontWeight: theme.typography.fontWeights.bold,
    },
  });

  if (!lastMessage) return null;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.senderInfo}>
          <Text style={styles.senderName}>{lastMessage.senderName}</Text>
          {isUnread && <MaterialCommunityIcons name="circle" size={10} color={theme.colors.primary} />}
        </View>
        <Text style={styles.timestamp}>{lastMessage.timestamp.toLocaleDateString()}</Text>
      </View>
      <Text style={styles.title} numberOfLines={1}>R: {conversation.requestTitle}</Text>
      <Text style={styles.lastMessage} numberOfLines={2}>{lastMessage.content}</Text>
    </TouchableOpacity>
  );
};

export default ConversationCard;
*/

/*
// File: components/ConversationCard.tsx

import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../contexts/theme';
import { Conversation } from '../interfaces/message';

interface ConversationCardProps {
  conversation: Conversation;
  onPress: () => void;
}

const ConversationCard = ({ conversation, onPress }: ConversationCardProps) => {
  const { theme } = useTheme();
  const lastMessage = conversation.messages[conversation.messages.length - 1];
  const isUnread = lastMessage ? !lastMessage.isRead && !lastMessage.isMe : false;
  const cardStyle = isUnread ? { backgroundColor: theme.colors.cardBackground, borderWidth: 2, borderColor: theme.colors.primary } : { backgroundColor: theme.colors.cardBackground, borderWidth: 2, borderColor: theme.colors.cardBorder };

  const styles = StyleSheet.create({
    card: {
      ...cardStyle,
      borderRadius: 10,
      boxShadow: '0px 1px 1.41px rgba(0, 0, 0, 0.20)',
      elevation: 2,
      marginBottom: 10,
      padding: 15,
      width: '100%',
    },
    header: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    lastMessage: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSizes.small,
      marginTop: 5,
    },
    senderInfo: {
      alignItems: 'center',
      flexDirection: 'row',
    },
    senderName: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSizes.small,
      fontWeight: isUnread ? theme.typography.fontWeights.bold : theme.typography.fontWeights.normal,
      marginRight: 5,
    },
    timestamp: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSizes.small,
      textAlign: 'right',
    },
    title: {
      color: theme.colors.text,
      flexShrink: 1,
      fontSize: theme.typography.fontSizes.medium,
      fontWeight: theme.typography.fontWeights.bold,
    },
  });

  if (!lastMessage) return null;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.senderInfo}>
          <Text style={styles.senderName}>{lastMessage.senderName}</Text>
          {isUnread && <MaterialCommunityIcons name="circle" size={10} color={theme.colors.primary} />}
        </View>
        <Text style={styles.timestamp}>{lastMessage.timestamp.toLocaleDateString()}</Text>
      </View>
      <Text style={styles.title} numberOfLines={1}>R: {conversation.requestTitle}</Text>
      <Text style={styles.lastMessage} numberOfLines={2}>{lastMessage.content}</Text>
    </TouchableOpacity>
  );
};

export default ConversationCard;

*/
