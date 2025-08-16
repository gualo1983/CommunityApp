// /app/(auth)/login.tsx
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import LoginForm from "../../components/LoginForm";
import SocialLoginButtons from "../../components/SocialLoginButtons";
import { useTheme } from "../../contexts/theme";
import { useLoginLogic } from "../../hooks/useLoginLogic";

const LoginScreen = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const { colors, typography } = theme;

  const {
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
    handleRegisterRedirect,
  } = useLoginLogic();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      flex: 1,
    },
    forgotPasswordLink: {
      alignSelf: "flex-end",
      marginTop: 10,
    },
    forgotPasswordText: {
      color: colors.primary,
      fontSize: typography.fontSizes.small,
      fontWeight: typography.fontWeights.bold,
    },
    headerBackButton: {
      marginLeft: 10,
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
    registerLink: {
      alignSelf: "center",
      marginTop: 20,
    },
    registerLinkText: {
      color: colors.primary,
      fontWeight: typography.fontWeights.bold,
    },
    registerText: {
      color: colors.textSecondary,
      fontSize: typography.fontSizes.default,
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
          title: "Login",
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
          <LoginForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            isLoading={isLoading}
            error={error}
            focusedInput={focusedInput}
            setFocusedInput={setFocusedInput}
            isEmailValid={isEmailValid}
            isFormValid={isFormValid}
            handleLogin={handleLogin}
          />
          <TouchableOpacity
            style={styles.forgotPasswordLink}
            onPress={() => router.push("/forgot_password_screen")}
          >
            <Text style={styles.forgotPasswordText}>Password dimenticata?</Text>
          </TouchableOpacity>
          <View style={styles.orContainer}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>o</Text>
            <View style={styles.orLine} />
          </View>
          <SocialLoginButtons />
          <TouchableOpacity
            style={styles.registerLink}
            onPress={handleRegisterRedirect}
          >
            <Text style={styles.registerText}>
              Non hai un account?{" "}
              <Text style={styles.registerLinkText}>Registrati</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
};

export default LoginScreen;

/*
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LoginForm from '../../components/LoginForm';
import SocialLoginButtons from '../../components/SocialLoginButtons';
import { useTheme } from '../../contexts/theme';
import { useLoginLogic } from '../../hooks/useLoginLogic';

const LoginScreen = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const { colors, typography } = theme;

  const {
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
    handleRegisterRedirect,
  } = useLoginLogic();

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
    forgotPasswordLink: {
      alignSelf: 'flex-end',
      marginTop: 10,
    },
    forgotPasswordText: {
      color: colors.primary,
      fontSize: typography.fontSizes.small,
      fontWeight: typography.fontWeights.bold,
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
    registerLink: {
      alignSelf: 'center',
      marginTop: 20,
    },
    registerText: {
      color: colors.textSecondary,
      fontSize: typography.fontSizes.default,
    },
  });

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Login',
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
          <LoginForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            isLoading={isLoading}
            error={error}
            focusedInput={focusedInput}
            setFocusedInput={setFocusedInput}
            isEmailValid={isEmailValid}
            isFormValid={isFormValid}
            handleLogin={handleLogin}
          />
          <TouchableOpacity
            style={styles.forgotPasswordLink}
            onPress={() => router.push('/forgot_password_screen')}
          >
            <Text style={styles.forgotPasswordText}>Password dimenticata?</Text>
          </TouchableOpacity>
          <View style={styles.orContainer}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>o</Text>
            <View style={styles.orLine} />
          </View>
          <SocialLoginButtons />
          <TouchableOpacity style={styles.registerLink} onPress={handleRegisterRedirect}>
            <Text style={styles.registerText}>
              Non hai un account?{' '}
              <Text style={{ color: colors.primary, fontWeight: typography.fontWeights.bold }}>Registrati</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
};

export default LoginScreen;
*/
