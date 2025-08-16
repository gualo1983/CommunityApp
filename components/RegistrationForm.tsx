import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useTheme } from "../contexts/theme";

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
    if (
      field === "passwordConfirm" &&
      confirmPassword.length > 0 &&
      password !== confirmPassword
    ) {
      return colors.error;
    }
    return "gray";
  };

  const renderValidationItem = (isValid: boolean, label: string) => (
    <View style={styles.validationItem}>
      <Ionicons
        name={isValid ? "checkmark-circle" : "close-circle"}
        size={16}
        color={isValid ? "green" : "red"}
      />
      <Text
        style={[
          styles.validationText,
          { color: isValid ? colors.text : colors.error },
        ]}
      >
        {label}
      </Text>
    </View>
  );

  const styles = StyleSheet.create({
    button: {
      alignItems: "center",
      borderRadius: 8,
      height: 50,
      justifyContent: "center",
      marginTop: 20,
    },
    buttonText: {
      color: colors.text,
      fontSize: typography.fontSizes.medium,
    },
    confirmPasswordLabel: {
      marginTop: 20,
    },
    errorText: {
      color: colors.error,
      marginBottom: 10,
      textAlign: "center",
    },
    eyeIcon: {
      padding: 10,
      position: "absolute",
      right: 15,
    },
    formContainer: {
      flex: 1,
      width: "100%",
    },
    input: {
      borderRadius: 8,
      borderWidth: 1,
      color: colors.text,
      fontSize: typography.fontSizes.default,
      height: 50,
      paddingHorizontal: 15,
    },
    inputError: {
      color: colors.error,
      fontSize: 12,
      marginTop: 5,
    },
    inputPassword: {
      borderRadius: 8,
      borderWidth: 1,
      color: colors.text,
      flex: 1,
      fontSize: typography.fontSizes.default,
      height: 50,
      paddingLeft: 15,
      paddingRight: 50,
    },
    label: {
      color: colors.text,
      fontSize: typography.fontSizes.default,
      marginBottom: 5,
      marginTop: 15,
    },
    loadingOverlay: {
      ...StyleSheet.absoluteFillObject,
      alignItems: "center",
      backgroundColor: theme.colors.headerText,
      justifyContent: "center",
      zIndex: 10,
    },
    passwordContainer: {
      alignItems: "center",
      flexDirection: "row",
    },
    passwordCounter: {
      color: colors.textSecondary,
      fontSize: typography.fontSizes.small,
    },
    passwordValidationContainer: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 5,
    },
    validationItem: {
      alignItems: "center",
      flexDirection: "row",
      marginBottom: 5,
    },
    validationSection: {},
    validationText: {
      marginLeft: 10,
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
        style={[
          styles.input,
          {
            borderColor: getBorderColor(
              "name",
              isNameValid(name) && name.length > 0,
            ),
          },
        ]}
        value={name}
        onChangeText={setName}
        placeholder="Inserisci il tuo nome"
        placeholderTextColor={colors.textSecondary}
        onFocus={() => setFocusedInput("name")}
        onBlur={() => setFocusedInput("")}
      />
      {!isNameValid(name) && name.length > 0 && (
        <Text style={styles.inputError}>
          Il nome non può contenere numeri o caratteri speciali.
        </Text>
      )}

      {/* ... altri campi come Cognome, Email, Password, Conferma Password ... */}
      <Text style={styles.label}>Cognome</Text>
      <TextInput
        style={[
          styles.input,
          {
            borderColor: getBorderColor(
              "surname",
              isNameValid(surname) && surname.length > 0,
            ),
          },
        ]}
        value={surname}
        onChangeText={setSurname}
        placeholder="Inserisci il tuo cognome"
        placeholderTextColor={colors.textSecondary}
        onFocus={() => setFocusedInput("surname")}
        onBlur={() => setFocusedInput("")}
      />
      {!isNameValid(surname) && surname.length > 0 && (
        <Text style={styles.inputError}>
          Il cognome non può contenere numeri o caratteri speciali.
        </Text>
      )}

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={[
          styles.input,
          {
            borderColor: getBorderColor("email", isEmailValid(email)),
          },
        ]}
        value={email}
        onChangeText={setEmail}
        placeholder="email@example.com"
        placeholderTextColor={colors.textSecondary}
        keyboardType="email-address"
        autoCapitalize="none"
        onFocus={() => setFocusedInput("email")}
        onBlur={() => setFocusedInput("")}
      />
      {!isEmailValid(email) && email.length > 0 && (
        <Text style={styles.inputError}>Inserisci un&apos;email valida.</Text>
      )}

      <Text style={styles.label}>Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={[
            styles.inputPassword,
            {
              borderColor: getBorderColor(
                "password",
                Object.values(passwordValidation).every(Boolean),
              ),
            },
          ]}
          value={password}
          onChangeText={validatePassword}
          placeholder="Almeno 8 caratteri"
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={!showPassword}
          onFocus={() => setFocusedInput("password")}
          onBlur={() => setFocusedInput("")}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeIcon}
        >
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.passwordValidationContainer}>
        {renderValidationItem(
          passwordValidation.hasMinLength,
          "Almeno 8 caratteri",
        )}
        <Text style={styles.passwordCounter}>{password.length}</Text>
      </View>

      <View style={styles.validationSection}>
        {renderValidationItem(
          passwordValidation.hasUppercase,
          "Una lettera maiuscola",
        )}
        {renderValidationItem(
          passwordValidation.hasLowercase,
          "Una lettera minuscola",
        )}
        {renderValidationItem(passwordValidation.hasNumber, "Un numero")}
        {renderValidationItem(
          passwordValidation.hasSymbol,
          "Un carattere speciale",
        )}
      </View>

      <Text style={[styles.label, styles.confirmPasswordLabel]}>
        Conferma Password
      </Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={[
            styles.inputPassword,
            {
              borderColor: getBorderColor(
                "passwordConfirm",
                confirmPassword.length > 0 && password === confirmPassword,
              ),
            },
          ]}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Ripeti la password"
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={!showConfirmPassword}
          onFocus={() => setFocusedInput("passwordConfirm")}
          onBlur={() => setFocusedInput("")}
        />
        <TouchableOpacity
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          style={styles.eyeIcon}
        >
          <Ionicons
            name={showConfirmPassword ? "eye-off" : "eye"}
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
