import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useTheme } from '../contexts/theme';

interface LoginFormProps {
  email: string;
  setEmail: (text: string) => void;
  password: string;
  setPassword: (text: string) => void;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  isLoading: boolean;
  error: string; // Ora gestisce anche l'errore di login
  focusedInput: string;
  setFocusedInput: (field: string) => void;
  isEmailValid: (email: string) => boolean;
  isFormValid: boolean;
  handleLogin: () => void;
}

const LoginForm = ({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  isLoading,
  error,
  focusedInput,
  setFocusedInput,
  isEmailValid,
  isFormValid,
  handleLogin,
}: LoginFormProps) => {
  const { theme } = useTheme();
  const { colors, typography } = theme;

  const styles = StyleSheet.create({
    formContainer: {
      width: '100%',
    },
    label: {
      marginTop: 15,
      marginBottom: 5,
      color: colors.text,
      fontSize: typography.fontSizes.default,
    },
    input: {
      height: 50,
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 15,
      color: colors.text,
      fontSize: typography.fontSizes.default,
    },
    inputError: {
      fontSize: 12,
      marginTop: 5,
      color: colors.error,
    },
    passwordContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    inputPassword: {
      flex: 1,
      height: 50,
      borderWidth: 1,
      borderRadius: 8,
      paddingLeft: 15,
      paddingRight: 50,
      color: colors.text,
      fontSize: typography.fontSizes.default,
    },
    eyeIcon: {
      position: 'absolute',
      right: 15,
      padding: 10,
    },
    button: {
      height: 50,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
    },
    buttonText: {
      color: colors.headerText,
      fontSize: typography.fontSizes.medium,
    },
    loadingOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
    },
    // Nuovo stile per il messaggio di errore
    errorText: {
      textAlign: 'center',
      marginBottom: 10,
      color: colors.error,
    },
  });

  const getBorderColor = (field: string, isValid: boolean) => {
    if (focusedInput === field) {
      return isValid ? colors.primary : colors.error;
    }
    return 'gray';
  };

  return (
    <View style={styles.formContainer}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
      
      {/* Visualizza il messaggio di errore se presente */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={[styles.input, {
          borderColor: getBorderColor('email', isEmailValid(email)),
        }]}
        value={email}
        onChangeText={setEmail}
        placeholder="email@example.com"
        placeholderTextColor={colors.textSecondary}
        keyboardType="email-address"
        autoCapitalize="none"
        onFocus={() => setFocusedInput('email')}
        onBlur={() => setFocusedInput('')}
      />
      {!isEmailValid(email) && email.length > 0 && (
        <Text style={styles.inputError}>Inserisci un&apos;email valida.</Text>
      )}

      <Text style={styles.label}>Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.inputPassword, {
            borderColor: getBorderColor('password', password.length > 0),
          }]}
          value={password}
          onChangeText={setPassword}
          placeholder="Inserisci la password"
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={!showPassword}
          onFocus={() => setFocusedInput('password')}
          onBlur={() => setFocusedInput('')}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
          <Ionicons
            name={showPassword ? 'eye-off' : 'eye'}
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: isFormValid ? colors.primary : colors.cardBorder },
        ]}
        onPress={handleLogin}
        disabled={!isFormValid}
      >
        <Text style={styles.buttonText}>Accedi</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginForm;



/*
// /components/LoginForms.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useTheme } from '../contexts/theme';

interface LoginFormProps {
  email: string;
  setEmail: (text: string) => void;
  password: string;
  setPassword: (text: string) => void; // Aggiornato
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  isLoading: boolean;
  error: string;
  focusedInput: string;
  setFocusedInput: (field: string) => void;
  isEmailValid: (email: string) => boolean;
  isFormValid: boolean;
  handleLogin: () => void;
}

const LoginForm = ({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  isLoading,
  error,
  focusedInput,
  setFocusedInput,
  isEmailValid,
  isFormValid,
  handleLogin,
}: LoginFormProps) => {
  const { theme } = useTheme();
  const { colors, typography } = theme;

  const styles = StyleSheet.create({
    formContainer: {
      width: '100%',
    },
    label: {
      marginTop: 15,
      marginBottom: 5,
      color: colors.text,
      fontSize: typography.fontSizes.default,
    },
    input: {
      height: 50,
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 15,
      color: colors.text,
      fontSize: typography.fontSizes.default,
    },
    inputError: {
      fontSize: 12,
      marginTop: 5,
      color: colors.error,
    },
    passwordContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    inputPassword: {
      flex: 1,
      height: 50,
      borderWidth: 1,
      borderRadius: 8,
      paddingLeft: 15,
      paddingRight: 50,
      color: colors.text,
      fontSize: typography.fontSizes.default,
    },
    eyeIcon: {
      position: 'absolute',
      right: 15,
      padding: 10,
    },
    button: {
      height: 50,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
    },
    buttonText: {
      color: colors.headerText,
      fontSize: typography.fontSizes.medium,
    },
    loadingOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
    },
    errorText: {
      textAlign: 'center',
      marginBottom: 10,
      color: colors.error,
    },
  });

  const getBorderColor = (field: string, isValid: boolean) => {
    if (focusedInput === field) {
      return isValid ? colors.primary : colors.error;
    }
    return 'gray';
  };

  return (
    <View style={styles.formContainer}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={[styles.input, {
          borderColor: getBorderColor('email', isEmailValid(email)),
        }]}
        value={email}
        onChangeText={setEmail}
        placeholder="email@example.com"
        placeholderTextColor={colors.textSecondary}
        keyboardType="email-address"
        autoCapitalize="none"
        onFocus={() => setFocusedInput('email')}
        onBlur={() => setFocusedInput('')}
      />
      {!isEmailValid(email) && email.length > 0 && (
        <Text style={styles.inputError}>Inserisci un&apos;email valida.</Text>
      )}

      <Text style={styles.label}>Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.inputPassword, {
            borderColor: getBorderColor('password', password.length > 0),
          }]}
          value={password}
          onChangeText={setPassword}
          placeholder="Inserisci la password"
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={!showPassword}
          onFocus={() => setFocusedInput('password')}
          onBlur={() => setFocusedInput('')}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
          <Ionicons
            name={showPassword ? 'eye-off' : 'eye'}
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: isFormValid ? colors.primary : colors.cardBorder },
        ]}
        onPress={handleLogin}
        disabled={!isFormValid}
      >
        <Text style={styles.buttonText}>Accedi</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginForm;
*/