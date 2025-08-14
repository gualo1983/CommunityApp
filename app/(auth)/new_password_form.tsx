import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import PasswordInput from '../../components/PasswordInput';
import { useTheme } from '../../contexts/theme';
import { useForgotPassword } from '../../hooks/useForgotPassword';

const NewPasswordForm = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const { colors, typography } = theme;

  const {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    isLoading,
    error,
    isPasswordValid,
    passwordValidation,
    passwordResetSuccess,
    handleUpdatePassword,
  } = useForgotPassword();

  const isPasswordMatch = password === confirmPassword;
  const isFormValid = isPasswordValid && isPasswordMatch;

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
    successMessage: {
      fontSize: typography.fontSizes.large,
      fontWeight: typography.fontWeights.bold,
      color: colors.primary,
      textAlign: 'center',
      marginBottom: 20,
    },
  });

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Nuova Password',
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
        {passwordResetSuccess ? (
          <View>
            <Text style={styles.successMessage}>Password aggiornata!</Text>
            <Text style={styles.message}>
              Ora puoi accedere con la tua nuova password.
            </Text>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={() => router.replace('/login')}
            >
              <Text style={styles.buttonText}>Torna al login</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.title}>Scegli una nuova password</Text>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <PasswordInput
              label="Nuova password"
              value={password}
              onChangeText={setPassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              passwordValidation={passwordValidation}
              isPasswordValid={isPasswordValid}
            />
            
            <PasswordInput
              label="Conferma password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              showPassword={showConfirmPassword}
              setShowPassword={setShowConfirmPassword}
              isConfirm={true}
              isPasswordMatch={isPasswordMatch}
            />
            
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: isFormValid ? colors.primary : colors.cardBorder },
              ]}
              onPress={handleUpdatePassword}
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.headerText} />
              ) : (
                <Text style={styles.buttonText}>Aggiorna password</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

export default NewPasswordForm;
