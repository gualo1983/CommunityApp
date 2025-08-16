import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useTheme } from "../contexts/theme";

interface PasswordValidation {
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSymbol: boolean;
}

interface PasswordInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  passwordValidation?: PasswordValidation;
  isPasswordValid?: boolean;
  isConfirm?: boolean;
  isPasswordMatch?: boolean;
}

const PasswordInput = ({
  label,
  value,
  onChangeText,
  showPassword,
  setShowPassword,
  passwordValidation,
  isPasswordValid = false,
  isConfirm = false,
  isPasswordMatch = true,
}: PasswordInputProps) => {
  const { theme } = useTheme();
  const { colors, typography } = theme;

  const [isFocused, setIsFocused] = useState(false);

  const getBorderColor = () => {
    if (isFocused) {
      return colors.primary;
    }
    if (isConfirm) {
      return value.length > 0 && !isPasswordMatch
        ? colors.error
        : colors.cardBorder;
    }
    return value.length > 0 && !isPasswordValid
      ? colors.error
      : colors.cardBorder;
  };

  const styles = StyleSheet.create({
    eyeIcon: {
      padding: 10,
      position: "absolute",
      right: 15,
    },
    inputPassword: {
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
    matchErrorContainer: {
      marginTop: 10,
    },
    passwordContainer: {
      alignItems: "center",
      borderColor: getBorderColor(),
      borderRadius: 8,
      borderWidth: 1,
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
      marginBottom: 2,
    },
    validationSection: {
      marginTop: 5,
    },
    validationText: {
      fontSize: typography.fontSizes.small,
      marginLeft: 5,
    },
  });

  const renderValidationItem = (isValid: boolean, text: string) => (
    <View style={styles.validationItem}>
      <Ionicons
        name={isValid ? "checkmark-circle" : "close-circle"}
        size={12}
        color={isValid ? colors.primary : colors.error}
      />
      <Text
        style={[
          styles.validationText,
          { color: isValid ? colors.text : colors.textSecondary },
        ]}
      >
        {text}
      </Text>
    </View>
  );

  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[styles.passwordContainer, { borderColor: getBorderColor() }]}
      >
        <TextInput
          style={styles.inputPassword}
          value={value}
          onChangeText={onChangeText}
          placeholder="Minimo 8 caratteri"
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={!showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
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

      {/* Sezione di validazione per la password */}
      {!isConfirm && passwordValidation && (
        <>
          <View style={styles.passwordValidationContainer}>
            {renderValidationItem(
              passwordValidation.hasMinLength,
              "Almeno 8 caratteri",
            )}
            <Text style={styles.passwordCounter}>{value.length}</Text>
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
        </>
      )}

      {/* Sezione di validazione per la conferma password */}
      {isConfirm && value.length > 0 && !isPasswordMatch && (
        <View style={styles.matchErrorContainer}>
          {renderValidationItem(false, "Le password non corrispondono.")}
        </View>
      )}
    </View>
  );
};

export default PasswordInput;
