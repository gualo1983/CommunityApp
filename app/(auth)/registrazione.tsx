import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import ConfirmationPopup from "../../components/ConfirmationPopup";
import PasswordInput from "../../components/PasswordInput";
import SocialLoginButtons from "../../components/SocialLoginButtons";
import { useTheme } from "../../contexts/theme";
import { useRegistrationLogic } from "../../hooks/useRegistrationLogic";

const RegistrationScreen = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const { colors, typography } = theme;

  const {
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
    handleLoginRedirect,
    showConfirmationPopup,
    setShowConfirmationPopup,
  } = useRegistrationLogic();

  // Funzione per chiudere il popup e reindirizzare
  const handleClosePopup = () => {
    setShowConfirmationPopup(false);
    handleLoginRedirect();
  };

  const isPasswordMatch = password === confirmPassword;

  const styles = StyleSheet.create({
    button: {
      alignItems: "center",
      borderRadius: 8,
      height: 50,
      justifyContent: "center",
      marginTop: 20,
      width: "100%",
    },
    buttonText: {
      color: colors.headerText,
      fontSize: typography.fontSizes.medium,
    },
    container: {
      backgroundColor: colors.background,
      flex: 1,
    },
    errorText: {
      color: colors.error,
      marginBottom: 10,
      textAlign: "center",
    },
    headerBackButton: {
      marginLeft: 10,
    },
    input: {
      borderColor: colors.cardBorder,
      borderRadius: 8,
      borderWidth: 1,
      color: colors.text,
      fontSize: typography.fontSizes.default,
      height: 50,
      paddingLeft: 15,
    },
    label: {
      color: colors.text,
      fontSize: typography.fontSizes.default,
      marginBottom: 5,
      marginTop: 15,
    },
    loginLink: {
      alignSelf: "center",
      marginTop: 20,
    },
    loginLinkText: {
      color: colors.primary,
      fontWeight: typography.fontWeights.bold,
    },
    loginText: {
      color: colors.textSecondary,
      fontSize: typography.fontSizes.default,
    },
    orContainer: {
      alignItems: "center",
      flexDirection: "row",
      marginBottom: 20,
      marginTop: 20,
    },
    orLine: {
      backgroundColor: colors.cardBorder,
      flex: 1,
      height: 1,
    },
    orText: {
      color: colors.textSecondary,
      paddingHorizontal: 10,
    },
    popupContainer: {
      alignSelf: "center",
      backgroundColor: colors.cardBackground,
      borderRadius: 15,
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      elevation: 8,
      flex: 1,
      marginVertical: 20,
      maxWidth: 400,
      overflow: "hidden",
    },
    scrollContent: {
      flexGrow: 1,
      padding: 20,
    },
  });

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Registrazione",
          headerTitleAlign: "center",
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
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.headerBackButton}
            >
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.popupContainer}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={[
              styles.input,
              {
                borderColor:
                  focusedInput === "Nome"
                    ? colors.primary
                    : name.length > 0 && !isNameValid(name)
                      ? colors.error
                      : colors.cardBorder,
              },
            ]}
            value={name}
            onChangeText={setName}
            placeholder="Nome"
            placeholderTextColor={colors.textSecondary}
            onFocus={() => setFocusedInput("Nome")}
            onBlur={() => setFocusedInput("")}
          />
          <Text style={styles.label}>Cognome</Text>
          <TextInput
            style={[
              styles.input,
              {
                borderColor:
                  focusedInput === "Cognome"
                    ? colors.primary
                    : surname.length > 0 && !isNameValid(surname)
                      ? colors.error
                      : colors.cardBorder,
              },
            ]}
            value={surname}
            onChangeText={setSurname}
            placeholder="Cognome"
            placeholderTextColor={colors.textSecondary}
            onFocus={() => setFocusedInput("Cognome")}
            onBlur={() => setFocusedInput("")}
          />
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[
              styles.input,
              {
                borderColor:
                  focusedInput === "Email"
                    ? colors.primary
                    : email.length > 0 && !isEmailValid(email)
                      ? colors.error
                      : colors.cardBorder,
              },
            ]}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor={colors.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
            onFocus={() => setFocusedInput("Email")}
            onBlur={() => setFocusedInput("")}
          />
          <PasswordInput
            label="Password"
            value={password}
            onChangeText={validatePassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            passwordValidation={passwordValidation}
            isPasswordValid={Object.values(passwordValidation).every(Boolean)}
          />

          <PasswordInput
            label="Conferma Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            showPassword={showConfirmPassword}
            setShowPassword={setShowConfirmPassword}
            isConfirm={true}
            isPasswordMatch={isPasswordMatch}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: isFormValid
                  ? colors.primary
                  : colors.cardBorder,
              },
            ]}
            onPress={handleRegister}
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.headerText} />
            ) : (
              <Text style={styles.buttonText}>Registrati</Text>
            )}
          </TouchableOpacity>
          <View style={styles.orContainer}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>o</Text>
            <View style={styles.orLine} />
          </View>
          <SocialLoginButtons />
          <TouchableOpacity
            style={styles.loginLink}
            onPress={handleLoginRedirect}
          >
            <Text style={styles.loginText}>
              Hai già un account?{" "}
              <Text style={styles.loginLinkText}>Accedi</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Popup di conferma per la verifica email */}
      <ConfirmationPopup
        isVisible={showConfirmationPopup}
        onClose={handleClosePopup}
      />
    </View>
  );
};

export default RegistrationScreen;

/*
/*
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ConfirmationPopup from '../../components/ConfirmationPopup';
import PasswordInput from '../../components/PasswordInput';
import SocialLoginButtons from '../../components/SocialLoginButtons';
import { useTheme } from '../../contexts/theme';
import { useRegistrationLogic } from '../../hooks/useRegistrationLogic';

const RegistrationScreen = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const { colors, typography } = theme;

  const {
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
    handleLoginRedirect,
    showConfirmationPopup,
    setShowConfirmationPopup,
  } = useRegistrationLogic();

  const handleClosePopup = () => {
    setShowConfirmationPopup(false);
    handleLoginRedirect();
  };
  
  const isPasswordMatch = password === confirmPassword;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    popupContainer: {
      flex: 1,
      backgroundColor: colors.cardBackground,
      borderRadius: 15,
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 10,
      elevation: 8,
      maxWidth: 400,
      alignSelf: 'center',
      marginVertical: 20,
      overflow: 'hidden',
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
      borderColor: colors.cardBorder,
      borderRadius: 8,
      paddingLeft: 15,
      color: colors.text,
      fontSize: typography.fontSizes.default,
    },
    orContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 20,
    },
    orLine: {
      flex: 1,
      height: 1,
      backgroundColor: colors.cardBorder,
    },
    orText: {
      paddingHorizontal: 10,
      color: colors.textSecondary,
    },
    loginLink: {
      alignSelf: 'center',
      marginTop: 20,
    },
    loginText: {
      color: colors.textSecondary,
      fontSize: typography.fontSizes.default,
    },
    errorText: {
      textAlign: 'center',
      marginBottom: 10,
      color: colors.error,
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
  });

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Registrazione',
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
      <View style={styles.popupContainer}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={[
              styles.input,
              {
                borderColor:
                  focusedInput === 'Nome'
                    ? colors.primary
                    : name.length > 0 && !isNameValid(name)
                    ? colors.error
                    : colors.cardBorder,
              },
            ]}
            value={name}
            onChangeText={setName}
            placeholder="Nome"
            placeholderTextColor={colors.textSecondary}
            onFocus={() => setFocusedInput('Nome')}
            onBlur={() => setFocusedInput('')}
          />
          <Text style={styles.label}>Cognome</Text>
          <TextInput
            style={[
              styles.input,
              {
                borderColor:
                  focusedInput === 'Cognome'
                    ? colors.primary
                    : surname.length > 0 && !isNameValid(surname)
                    ? colors.error
                    : colors.cardBorder,
              },
            ]}
            value={surname}
            onChangeText={setSurname}
            placeholder="Cognome"
            placeholderTextColor={colors.textSecondary}
            onFocus={() => setFocusedInput('Cognome')}
            onBlur={() => setFocusedInput('')}
          />
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[
              styles.input,
              {
                borderColor:
                  focusedInput === 'Email'
                    ? colors.primary
                    : email.length > 0 && !isEmailValid(email)
                    ? colors.error
                    : colors.cardBorder,
              },
            ]}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor={colors.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
            onFocus={() => setFocusedInput('Email')}
            onBlur={() => setFocusedInput('')}
          />
          <PasswordInput
              label="Password"
              value={password}
              onChangeText={validatePassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              passwordValidation={passwordValidation}
              isPasswordValid={Object.values(passwordValidation).every(Boolean)}
            />
            
            <PasswordInput
              label="Conferma Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              showPassword={showConfirmPassword}
              setShowPassword={setShowConfirmPassword}
              isConfirm={true}
              isPasswordMatch={isPasswordMatch}
            />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: isFormValid ? colors.primary : colors.cardBorder }]}
            onPress={handleRegister}
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.headerText} />
            ) : (
              <Text style={styles.buttonText}>Registrati</Text>
            )}
          </TouchableOpacity>
          <View style={styles.orContainer}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>o</Text>
            <View style={styles.orLine} />
          </View>
          <SocialLoginButtons />
          <TouchableOpacity style={styles.loginLink} onPress={handleLoginRedirect}>
            <Text style={styles.loginText}>
              Hai già un account?{' '}
              <Text style={{ color: colors.primary, fontWeight: typography.fontWeights.bold }}>Accedi</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ConfirmationPopup
        isVisible={showConfirmationPopup}
        onClose={handleClosePopup}
      />
    </View>
  );
};

export default RegistrationScreen;
*/
