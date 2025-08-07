// File: components/RequestCard.tsx

import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/theme';
import { Request } from '../interfaces/request';
import { getUrgency } from '../utils/requests';

interface RequestCardProps {
  request: Request;
  onPress: () => void;
}

const RequestCard = ({ request, onPress }: RequestCardProps) => {
  const { theme } = useTheme();
  const urgency = getUrgency(request.expiresAt);
  const [urgencyColor, setUrgencyColor] = useState(theme.colors.cardBorder);
  const blinkingAnimation = useRef(new Animated.Value(1)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    let color = theme.colors.cardBorder;
    if (urgency === 'red') color = '#dc3545';
    else if (urgency === 'yellow') color = '#ffc107';
    else if (urgency === 'green') color = '#28a745';
    setUrgencyColor(color);
  }, [urgency, theme.colors]);

  useEffect(() => {
    if (urgency === 'red') {
      if (animationRef.current) {
        animationRef.current.stop();
      }
      animationRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(blinkingAnimation, {
            toValue: 0.2,
            duration: 800,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(blinkingAnimation, {
            toValue: 1,
            duration: 800,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      );
      animationRef.current.start();
    } else {
      if (animationRef.current) {
        animationRef.current.stop();
      }
      blinkingAnimation.setValue(1);
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, [urgency, blinkingAnimation]);

  const styles = StyleSheet.create({
    card: {
      backgroundColor: theme.colors.cardBackground,
      borderColor: urgencyColor,
      borderRadius: 10,
      borderWidth: 2,
      boxShadow: '0px 1px 1.41px rgba(0, 0, 0, 0.20)',
      elevation: 2,
      marginBottom: 10,
      padding: 15,
      position: 'relative',
      width: '100%',
    },
    dateText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSizes.small,
      marginTop: 10,
    },
    description: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSizes.small,
      marginTop: 5,
    },
    idText: {
      bottom: 15,
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSizes.small,
      position: 'absolute',
      right: 15,
    },
    title: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSizes.medium,
      fontWeight: theme.typography.fontWeights.bold,
    },
    urgencyIcon: {
      position: 'absolute',
      top: 15,
      right: 15,
      opacity: urgency === 'red' ? blinkingAnimation : 1,
    } as any,
  });

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Animated.View style={styles.urgencyIcon}>
        <MaterialCommunityIcons name="circle" size={24} color={urgencyColor} />
      </Animated.View>
      <Text style={styles.title}>{request.title}</Text>
      <Text style={styles.description} numberOfLines={2}>{request.shortDescription}</Text>
      <Text style={styles.dateText}>Scade il: {request.expiresAt.toLocaleDateString()}</Text>
      <Text style={styles.idText}>ID: {request.id}</Text>
    </TouchableOpacity>
  );
};

export default RequestCard;