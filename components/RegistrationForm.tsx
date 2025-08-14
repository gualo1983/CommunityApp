import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useTheme } from '../contexts/theme';

interface RegistrationFormProps {
  // Progettazione delle prop basata sul custom hook
  name: string;
  setName: (text: string) => void;
  surname: string;
  setSurname: (text: string) => void;
  email: string;
  setEmail: (text: string) => void;
  password: string;
  validatePassword: (text: string) => void;
  confirmPassword: string;
  setConfirmPassword: (text: string) => void;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (value: boolean) => void;
  isLoading: boolean;
  error: string;
  focusedInput: string;
  setFocusedInput: (field: string) => void;
  passwordValidation: {
    hasMinLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSymbol: boolean;
  };
  isEmailValid: (email: string) => boolean;
  isNameValid: (name: string) => boolean;
  isFormValid: boolean;
  handleRegister: () => void;
}

const RegistrationForm = ({
  name,
  setName,
  surname,
  setSurname,
  email,
  setEmail,
  password,
  validatePassword,
  confirmPassword,
  setConfirmPassword,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  isLoading,
  error,
  focusedInput,
  setFocusedInput,
  passwordValidation,
  isEmailValid,
  isNameValid,
  isFormValid,
  handleRegister,
}: RegistrationFormProps) => {
  const { theme } = useTheme();
  const { colors, typography } = theme;

  const getBorderColor = (field: string, isValid: boolean) => {
    if (focusedInput === field) {
      return isValid ? colors.primary : colors.error;
    }
    if (field === 'passwordConfirm' && confirmPassword.length > 0 && password !== confirmPassword) {
      return colors.error;
    }
    return 'gray';
  };

  const renderValidationItem = (isValid: boolean, label: string) => (
    <View style={styles.validationItem}>
      <Ionicons
        name={isValid ? 'checkmark-circle' : 'close-circle'}
        size={16}
        color={isValid ? 'green' : 'red'}
      />
      <Text style={[styles.validationText, { color: isValid ? colors.text : colors.error }]}>
        {label}
      </Text>
    </View>
  );

  const styles = StyleSheet.create({
    formContainer: {
      flex: 1,
      width: '100%',
    },
    // ... tutti gli stili specifici del form ...
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
    passwordValidationContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 5,
    },
    passwordCounter: {
      color: colors.textSecondary,
      fontSize: typography.fontSizes.small,
    },
    validationSection: {},
    validationItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 5,
    },
    validationText: {
      marginLeft: 10,
    },
    button: {
      height: 50,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
    },
    buttonText: {
      color: colors.text,
      fontSize: typography.fontSizes.medium,
    },
    errorText: {
      textAlign: 'center',
      marginBottom: 10,
      color: colors.error,
    },
    loadingOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
    },
  });

  return (
    <View style={styles.formContainer}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={[styles.input, {
          borderColor: getBorderColor('name', isNameValid(name) && name.length > 0),
        }]}
        value={name}
        onChangeText={setName}
        placeholder="Inserisci il tuo nome"
        placeholderTextColor={colors.textSecondary}
        onFocus={() => setFocusedInput('name')}
        onBlur={() => setFocusedInput('')}
      />
      {!isNameValid(name) && name.length > 0 && (
        <Text style={styles.inputError}>Il nome non può contenere numeri o caratteri speciali.</Text>
      )}

      {/* ... altri campi come Cognome, Email, Password, Conferma Password ... */}
       <Text style={styles.label}>Cognome</Text>
            <TextInput
              style={[styles.input, {
                borderColor: getBorderColor('surname', isNameValid(surname) && surname.length > 0),
              }]}
              value={surname}
              onChangeText={setSurname}
              placeholder="Inserisci il tuo cognome"
              placeholderTextColor={colors.textSecondary}
              onFocus={() => setFocusedInput('surname')}
              onBlur={() => setFocusedInput('')}
            />
            {!isNameValid(surname) && surname.length > 0 && (
              <Text style={styles.inputError}>Il cognome non può contenere numeri o caratteri speciali.</Text>
            )}

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
                  borderColor: getBorderColor('password', Object.values(passwordValidation).every(Boolean)),
                }]}
                value={password}
                onChangeText={validatePassword}
                placeholder="Almeno 8 caratteri"
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

            <View style={styles.passwordValidationContainer}>
                {renderValidationItem(passwordValidation.hasMinLength, 'Almeno 8 caratteri')}
                <Text style={styles.passwordCounter}>{password.length}</Text>
            </View>
            
            <View style={styles.validationSection}>
              {renderValidationItem(passwordValidation.hasUppercase, 'Una lettera maiuscola')}
              {renderValidationItem(passwordValidation.hasLowercase, 'Una lettera minuscola')}
              {renderValidationItem(passwordValidation.hasNumber, 'Un numero')}
              {renderValidationItem(passwordValidation.hasSymbol, 'Un carattere speciale')}
            </View>

            <Text style={[styles.label, { marginTop: 20 }]}>Conferma Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.inputPassword, {
                  borderColor: getBorderColor('passwordConfirm', confirmPassword.length > 0 && password === confirmPassword),
                }]}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Ripeti la password"
                placeholderTextColor={colors.textSecondary}
                secureTextEntry={!showConfirmPassword}
                onFocus={() => setFocusedInput('passwordConfirm')}
                onBlur={() => setFocusedInput('')}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                <Ionicons
                  name={showConfirmPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
            {confirmPassword.length > 0 && password !== confirmPassword && (
                <Text style={styles.inputError}>Le password non coincidono.</Text>
            )}


      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: isFormValid ? colors.primary : colors.cardBorder },
        ]}
        onPress={handleRegister}
        disabled={!isFormValid}
      >
        <Text style={styles.buttonText}>Crea Account</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegistrationForm;