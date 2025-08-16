// File: components/SettingsOption.tsx

import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useTheme } from "../contexts/theme";

interface SettingsOptionProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

const SettingsOption = ({
  label,
  isSelected,
  onPress,
}: SettingsOptionProps) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    checkbox: {
      alignItems: "center",
      borderColor: theme.colors.text,
      borderRadius: 12,
      borderWidth: 2,
      height: 24,
      justifyContent: "center",
      width: 24,
    },
    checkboxSelected: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    checkmark: {
      color: theme.colors.headerText,
      fontSize: 18,
    },
    option: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 15,
    },
    optionText: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSizes.default,
    },
  });

  return (
    <TouchableOpacity style={styles.option} onPress={onPress}>
      <Text style={styles.optionText}>{label}</Text>
      <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
        {isSelected && <Text style={styles.checkmark}>✓</Text>}
      </View>
    </TouchableOpacity>
  );
};

export default SettingsOption;
