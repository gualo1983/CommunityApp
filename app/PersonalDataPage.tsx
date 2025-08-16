// File: app/PersonalDataPage.tsx

import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { Stack } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";

import { useTheme } from "../contexts/theme";
import { usePersonalDataLogic } from "../hooks/usePersonalDataLogic";

export default function PersonalDataPage() {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;

  const [showDatePicker, setShowDatePicker] = useState(false);

  // Colori extra per ESLint
  const colors = {
    red: "red",
    transparent: "transparent",
    overlay: "rgba(0, 0, 0, 0.5)",
  };

  const {
    primoLogin,
    nome,
    cognome,
    email,
    setEmail,
    comuneResidenza,
    setComuneResidenza,
    dataNascita,
    setDataNascita,
    parrocchiaRiferimentoId,
    setParrocchiaRiferimentoId,
    parrocchie,
    isEmailValid,
    isLoading,
    isFetchingData,
    error,
    handleSave,
    showConfirmation,
    handleModalClose,
  } = usePersonalDataLogic();

  // Funzione per mettere la prima lettera maiuscola
  const capitalize = (str: string) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  // Funzione per mostrare il DatePicker
  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  // Funzione per gestire il cambio di data (per React Native)
  const onDateChange = (event: unknown, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");
      const formattedDateForDB = `${year}-${month}-${day}`;
      setDataNascita(formattedDateForDB);
    }
  };

  // Funzione per gestire il cambio di data (per React Web)
  const onDateChangeWeb = (event: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = event.target.value;
    if (dateValue) {
      setDataNascita(dateValue);
    } else {
      setDataNascita("");
    }
  };

  // Gestisce il submit del form sulla versione web per prevenire il ricaricamento della pagina
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSave();
  };

  const styles = StyleSheet.create({
    commonInput: {
      backgroundColor: theme.colors.background,
      borderColor: theme.colors.cardBorder,
      borderRadius: 10,
      borderWidth: 1,
      fontSize: theme.typography.fontSizes.medium,
      height: 50,
      marginBottom: 15,
      paddingHorizontal: 15,
    },
    container: {
      backgroundColor: theme.colors.background,
      flex: 1,
      ...(isLargeScreen && {
        alignItems: "center",
        justifyContent: "center",
      }),
    },
    contentContainer: {
      alignItems: "center",
      flexGrow: 1,
      padding: 20,
    },
    dateInput: {
      justifyContent: "center",
      width: "100%",
    },
    datePickerInput: {
      backgroundColor: colors.transparent,
      borderWidth: 0,
      color: dataNascita ? theme.colors.text : theme.colors.textSecondary,
      fontSize: theme.typography.fontSizes.medium,
      height: "100%",
      padding: 0,
      width: "100%",
    },
    datePickerWebInput: {
      outline: "none",
    },
    datePickerWebInputContainer: {
      justifyContent: "center",
      width: "100%",
    },
    dateText: {
      color: dataNascita ? theme.colors.text : theme.colors.textSecondary,
      fontSize: theme.typography.fontSizes.medium,
    },
    emailInputInvalid: {
      borderColor: colors.red,
    },
    errorText: {
      color: colors.red,
      fontSize: theme.typography.fontSizes.small,
      marginBottom: 15,
      textAlign: "center",
    },
    input: {
      color: theme.colors.text,
      width: "100%",
    },
    label: {
      alignSelf: "flex-start",
      color: theme.colors.text,
      fontSize: theme.typography.fontSizes.medium,
      marginLeft: 15,
      marginTop: 10,
    },
    largeScreenWrapper: {
      flex: 1,
    },
    modalButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 20,
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    modalButtonText: {
      color: theme.colors.headerText,
      fontSize: theme.typography.fontSizes.medium,
      fontWeight: "bold",
    },
    modalContent: {
      alignItems: "center",
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 10,
      padding: 20,
      width: "80%",
    },
    modalOverlay: {
      alignItems: "center",
      backgroundColor: colors.overlay,
      flex: 1,
      justifyContent: "center",
    },
    modalText: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSizes.large,
      marginBottom: 20,
      textAlign: "center",
    },
    nameInput: {
      flex: 1,
      marginRight: 10,
    },
    nameLabel: {
      color: theme.colors.text,
      flex: 1,
      fontSize: theme.typography.fontSizes.medium,
      textAlign: "center",
    },
    nameSurnameContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
    },
    nameSurnameLabels: {
      flexDirection: "row",
      marginBottom: -5,
      width: "100%",
    },
    nonEditableInput: {
      justifyContent: "center",
    },
    nonEditableTextContent: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSizes.medium,
    },
    picker: {
      color: theme.colors.text,
    },
    pickerContainer: {
      justifyContent: "center",
      width: "100%",
    },
    popupContainer: {
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 15,
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      width: "90%",
    },
    saveButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 30,
      marginTop: 20,
      opacity: isLoading || isFetchingData || !isEmailValid(email) ? 0.7 : 1,
      paddingHorizontal: 40,
      paddingVertical: 15,
    },
    saveButtonText: {
      color: theme.colors.headerText,
      fontSize: theme.typography.fontSizes.large,
      fontWeight: "bold",
      textAlign: "center",
    },
    surnameInput: {
      flex: 1,
    },
    surnameLabel: {
      color: theme.colors.text,
      flex: 1,
      fontSize: theme.typography.fontSizes.medium,
      textAlign: "center",
    },
    title: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSizes.large,
      fontWeight: "bold",
      marginBottom: 20,
      textAlign: "center",
    },
  });

  // Funzione per formattare la data da AAAA-MM-GG a GG-MM-AAAA
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  // Ottiene la data odierna nel formato YYYY-MM-DD per l'attributo max dell'input
  const today = new Date().toISOString().split("T")[0];
  const minDate = "1900-01-01";

  // Sulla versione web, avvolgiamo gli input in un form per gestire il submit
  const FormWrapper = Platform.OS === "web" ? "form" : View;

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: primoLogin
            ? "Completa il tuo profilo"
            : "Modifica il tuo profilo",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: theme.colors.headerBackground,
          },
          headerTitleStyle: {
            color: theme.colors.headerText,
            fontSize: theme.typography.fontSizes.large,
            fontWeight: theme.typography.fontWeights.bold,
          },
          headerTintColor: theme.colors.headerText,
        }}
      />
      <View
        style={
          isLargeScreen ? styles.popupContainer : styles.largeScreenWrapper
        }
      >
        <ScrollView
          style={styles.largeScreenWrapper}
          contentContainerStyle={styles.contentContainer}
        >
          <Text style={styles.title}>
            {primoLogin ? "Completa il tuo profilo" : "Modifica il tuo profilo"}
          </Text>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {isFetchingData ? (
            <ActivityIndicator size="large" color={theme.colors.primary} />
          ) : (
            <FormWrapper
              onSubmit={Platform.OS === "web" ? handleFormSubmit : undefined}
            >
              {/* Nome e Cognome non editabili su due colonne */}
              <View style={styles.nameSurnameLabels}>
                <Text style={styles.nameLabel}>Nome</Text>
                <Text style={styles.surnameLabel}>Cognome</Text>
              </View>
              <View style={styles.nameSurnameContainer}>
                <View
                  style={[
                    styles.commonInput,
                    styles.nonEditableInput,
                    styles.nameInput,
                  ]}
                >
                  <Text style={styles.nonEditableTextContent}>
                    {capitalize(nome)}
                  </Text>
                </View>
                <View
                  style={[
                    styles.commonInput,
                    styles.nonEditableInput,
                    styles.surnameInput,
                  ]}
                >
                  <Text style={styles.nonEditableTextContent}>
                    {capitalize(cognome)}
                  </Text>
                </View>
              </View>

              {/* Email editabile con validazione */}
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[
                  styles.commonInput,
                  styles.input,
                  !isEmailValid(email) && styles.emailInputInvalid,
                ]}
                placeholder="Email"
                placeholderTextColor={theme.colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
              {!isEmailValid(email) && (
                <Text style={styles.errorText}>
                  Inserisci un&apos;email valida.
                </Text>
              )}

              {/* Comune di residenza */}
              <Text style={styles.label}>Comune di residenza</Text>
              <TextInput
                style={[styles.commonInput, styles.input]}
                placeholder="Comune di residenza"
                placeholderTextColor={theme.colors.textSecondary}
                value={comuneResidenza}
                onChangeText={(text) => {
                  console.log(
                    "Comune di residenza onChangeText called with:",
                    text,
                  );
                  setComuneResidenza(text);
                }}
              />

              {/* Data di nascita (DatePicker) */}
              <Text style={styles.label}>Data di nascita</Text>
              {Platform.OS === "web" ? (
                <View
                  style={[
                    styles.commonInput,
                    styles.datePickerWebInputContainer,
                  ]}
                >
                  <input
                    type="date"
                    value={dataNascita}
                    onChange={onDateChangeWeb}
                    min={minDate}
                    max={today}
                    style={{
                      ...styles.datePickerInput,
                      ...styles.datePickerWebInput,
                    }}
                  />
                </View>
              ) : (
                <Pressable
                  onPress={showDatepicker}
                  style={[styles.commonInput, styles.dateInput]}
                >
                  <Text style={styles.dateText}>
                    {dataNascita
                      ? formatDateForDisplay(dataNascita)
                      : "Seleziona la data di nascita"}
                  </Text>
                </Pressable>
              )}

              {showDatePicker && (
                <DateTimePicker
                  value={dataNascita ? new Date(dataNascita) : new Date()}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                />
              )}

              {/* Parrocchia di riferimento */}
              <Text style={styles.label}>Parrocchia di riferimento</Text>
              <View style={[styles.commonInput, styles.pickerContainer]}>
                <Picker
                  selectedValue={parrocchiaRiferimentoId}
                  onValueChange={(itemValue) =>
                    setParrocchiaRiferimentoId(itemValue)
                  }
                  style={styles.picker}
                >
                  <Picker.Item label="Seleziona una parrocchia..." value="" />
                  {parrocchie.map((parrocchia) => (
                    <Picker.Item
                      key={parrocchia.id}
                      label={parrocchia.name}
                      value={parrocchia.id}
                    />
                  ))}
                </Picker>
              </View>

              <Pressable
                style={styles.saveButton}
                onPress={handleSave}
                // @ts-expect-error type is a web-only prop
                type={Platform.OS === "web" ? "submit" : "button"}
                disabled={isLoading || isFetchingData || !isEmailValid(email)}
              >
                <Text style={styles.saveButtonText}>
                  {isLoading ? "Salvataggio..." : "Salva"}
                </Text>
              </Pressable>
            </FormWrapper>
          )}
        </ScrollView>
      </View>

      {/* Modal di conferma */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showConfirmation}
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Dati salvati con successo!</Text>
            <Pressable style={styles.modalButton} onPress={handleModalClose}>
              <Text style={styles.modalButtonText}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}


/*
// File: app/PersonalDataPage.tsx

import { Stack } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { useTheme } from '../contexts/theme';
import { usePersonalDataLogic } from '../hooks/usePersonalDataLogic';

export default function  PersonalDataPage() {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;

  const {
    comuneResidenza,
    setComuneResidenza,
    dataNascita,
    setDataNascita,
    isLoading,
    isFetchingData,
    error,
    handleSave,
  } = usePersonalDataLogic();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      flex: 1,
      ...(isLargeScreen && {
        alignItems: 'center',
        justifyContent: 'center',
      }),
    },
    contentContainer: {
      padding: 20,
      alignItems: 'center',
    },
    popupContainer: {
      backgroundColor: theme.colors.cardBackground,
      // @ts-ignore
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
      borderRadius: 15,
      elevation: 8,
      maxWidth: 400,
      width: '90%',
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 20,
    },
    input: {
      width: '100%',
      height: 50,
      borderColor: theme.colors.cardBorder,
      borderWidth: 1,
      borderRadius: 10,
      paddingHorizontal: 15,
      marginBottom: 15,
      color: theme.colors.text,
      backgroundColor: theme.colors.background,
      fontSize: 16,
    },
    errorText: {
      color: 'red',
      marginBottom: 15,
      textAlign: 'center',
    },
    saveButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 15,
      paddingHorizontal: 40,
      borderRadius: 30,
      marginTop: 20,
      opacity: isLoading || isFetchingData ? 0.7 : 1,
    },
    saveButtonText: {
      color: theme.colors.headerText,
      fontSize: 18,
      fontWeight: 'bold',
    },
  });

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Informazioni Personali',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: theme.colors.headerBackground,
          },
          headerTitleStyle: {
            color: theme.colors.headerText,
            fontSize: theme.typography.fontSizes.large,
            fontWeight: theme.typography.fontWeights.bold,
          },
          headerTintColor: theme.colors.headerText,
        }}
      />
      <View style={isLargeScreen ? styles.popupContainer : { flex: 1 }}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <Text style={styles.title}>Completa il tuo profilo</Text>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          {isFetchingData ? (
            <ActivityIndicator size="large" color={theme.colors.primary} />
          ) : (
            <>
              <TextInput
                style={styles.input}
                placeholder="Comune di residenza"
                placeholderTextColor={theme.colors.textSecondary}
                value={comuneResidenza}
                onChangeText={setComuneResidenza}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Data di nascita (AAAA-MM-GG)"
                placeholderTextColor={theme.colors.textSecondary}
                value={dataNascita}
                onChangeText={setDataNascita}
              />
              
              <Pressable
                style={styles.saveButton}
                onPress={handleSave}
                disabled={isLoading || isFetchingData}
              >
                <Text style={styles.saveButtonText}>{isLoading ? 'Salvataggio...' : 'Salva'}</Text>
              </Pressable>
            </>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

*/
/*
// File: app/PersonalDataPage.tsx

import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { useAuth } from '../contexts/AuthProvider';
import { useSupabase } from '../contexts/SupabaseProvider';
import { useTheme } from '../contexts/theme';

export default function  PersonalDataPage() {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const { theme } = useTheme();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;

  // Stati per i campi del form
  const [comuneResidenza, setComuneResidenza] = useState('');
  const [dataNascita, setDataNascita] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [error, setError] = useState('');

  // Fetch dei dati dell'utente al caricamento della pagina
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setIsFetchingData(false);
        return;
      }
      
      setIsFetchingData(true);
      try {
        const { data, error } = await supabase
          .from('utenti')
          .select('comune_residenza, data_nascita')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        
        if (data) {
          setComuneResidenza(data.comune_residenza || '');
          setDataNascita(data.data_nascita || '');
        }
      } catch (err) {
        console.error("Errore nel recupero dei dati utente:", err);
        setError("Impossibile caricare i dati utente.");
      } finally {
        setIsFetchingData(false);
      }
    };
    
    fetchUserData();
  }, [user, supabase]);

  const handleSave = async () => {
    if (!user) {
      setError("Utente non autenticato. Riprova il login.");
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      if (!comuneResidenza || !dataNascita) {
        setError('Si prega di compilare tutti i campi obbligatori.');
        setIsLoading(false);
        return;
      }

      const { error: updateError } = await supabase
        .from('utenti')
        .update({
          comune_residenza: comuneResidenza,
          data_nascita: dataNascita,
          primo_login: false, 
        })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      console.log('Profilo utente aggiornato con successo!');
      setIsLoading(false);
      // Reindirizziamo l'utente alla home page
      router.push('/');
    } catch (err) {
      console.error('Errore nel salvataggio dei dati personali:', err);
      setError('Si è verificato un errore nel salvataggio. Riprova.');
      setIsLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      flex: 1,
      ...(isLargeScreen && {
        alignItems: 'center',
        justifyContent: 'center',
      }),
    },
    contentContainer: {
      padding: 20,
      alignItems: 'center',
    },
    popupContainer: {
      backgroundColor: theme.colors.cardBackground,
      // @ts-ignore
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
      borderRadius: 15,
      elevation: 8,
      maxWidth: 400,
      width: '90%',
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 20,
    },
    input: {
      width: '100%',
      height: 50,
      borderColor: theme.colors.cardBorder,
      borderWidth: 1,
      borderRadius: 10,
      paddingHorizontal: 15,
      marginBottom: 15,
      color: theme.colors.text,
      backgroundColor: theme.colors.background,
      fontSize: 16,
    },
    errorText: {
      color: 'red',
      marginBottom: 15,
      textAlign: 'center',
    },
    saveButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 15,
      paddingHorizontal: 40,
      borderRadius: 30,
      marginTop: 20,
      opacity: isLoading || isFetchingData ? 0.7 : 1,
    },
    saveButtonText: {
      color: theme.colors.headerText,
      fontSize: 18,
      fontWeight: 'bold',
    },
  });

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Informazioni Personali',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: theme.colors.headerBackground,
          },
          headerTitleStyle: {
            color: theme.colors.headerText,
            fontSize: theme.typography.fontSizes.large,
            fontWeight: theme.typography.fontWeights.bold,
          },
          headerTintColor: theme.colors.headerText,
        }}
      />
      <View style={isLargeScreen ? styles.popupContainer : { flex: 1 }}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <Text style={styles.title}>Completa il tuo profilo</Text>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          {isFetchingData ? (
            <ActivityIndicator size="large" color={theme.colors.primary} />
          ) : (
            <>
              <TextInput
                style={styles.input}
                placeholder="Comune di residenza"
                placeholderTextColor={theme.colors.textSecondary}
                value={comuneResidenza}
                onChangeText={setComuneResidenza}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Data di nascita (AAAA-MM-GG)"
                placeholderTextColor={theme.colors.textSecondary}
                value={dataNascita}
                onChangeText={setDataNascita}
              />
              
              <Pressable
                style={styles.saveButton}
                onPress={handleSave}
                disabled={isLoading || isFetchingData}
              >
                <Text style={styles.saveButtonText}>{isLoading ? 'Salvataggio...' : 'Salva'}</Text>
              </Pressable>
            </>
          )}
        </ScrollView>
      </View>
    </View>
  );
};
*/
