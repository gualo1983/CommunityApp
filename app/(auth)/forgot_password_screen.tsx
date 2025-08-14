import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useTheme } from '../../contexts/theme';
import { useForgotPassword } from '../../hooks/useForgotPassword';

const ForgotPasswordScreen = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const { colors, typography } = theme;

  const {
    email,
    setEmail,
    isLoading,
    error,
    isEmailValid,
    isEmailSent,
    handleRequestPasswordReset,
  } = useForgotPassword();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    title: {
      fontSize: typography.fontSizes.large,
      fontWeight: typography.fontWeights.bold,
      color: colors.text,
      marginBottom: 20,
      textAlign: 'center',
    },
    message: {
      fontSize: typography.fontSizes.default,
      color: colors.text,
      textAlign: 'center',
      marginBottom: 20,
    },
    input: {
      height: 50,
      width: '100%',
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 8,
      paddingHorizontal: 15,
      color: colors.text,
      fontSize: typography.fontSizes.default,
      marginBottom: 10,
    },
    button: {
      height: 50,
      width: '100%',
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
    },
    buttonText: {
      color: colors.headerText,
      fontSize: typography.fontSizes.medium,
    },
    errorText: {
      textAlign: 'center',
      marginBottom: 10,
      color: colors.error,
    },
  });

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Password Dimenticata',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: colors.headerBackground,
          },
          headerTitleStyle: {
            color: colors.headerText,
            fontSize: typography.fontSizes.large,
            fontWeight: typography.fontWeights.bold,
          },
          headerTintColor: colors.headerText,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={{ width: '100%', maxWidth: 400 }}>
        {isEmailSent ? (
          <View>
            <Text style={styles.title}>Email inviata!</Text>
            <Text style={styles.message}>
              Controlla la tua casella di posta per un link per reimpostare la password.
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.title}>Hai dimenticato la password?</Text>
            <Text style={styles.message}>
              Inserisci la tua email per ricevere un link per reimpostare la password.
            </Text>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <TextInput
              style={[styles.input, { borderColor: isEmailValid(email) || email.length === 0 ? 'gray' : colors.error }]}
              value={email}
              onChangeText={setEmail}
              placeholder="email@example.com"
              placeholderTextColor={colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
            />
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: isEmailValid(email) ? colors.primary : colors.cardBorder },
              ]}
              onPress={handleRequestPasswordReset}
              disabled={!isEmailValid(email) || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.headerText} />
              ) : (
                <Text style={styles.buttonText}>Invia link</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

export default ForgotPasswordScreen;
