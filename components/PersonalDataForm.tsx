import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";

import { useAuth } from "../contexts/AuthProvider";
import { useSupabase } from "../contexts/SupabaseProvider";
import { useTheme } from "../contexts/theme";

// Definisci il tipo per le props del componente
interface PersonalDataFormProps {
  onSaveSuccess: () => void;
}

// Esporta il componente usando le props tipizzate
export const PersonalDataForm = ({ onSaveSuccess }: PersonalDataFormProps) => {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;

  // Stati per i campi del form
  const [comuneResidenza, setComuneResidenza] = useState("");
  const [dataNascita, setDataNascita] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [error, setError] = useState("");

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
          .from("utenti")
          .select("comune_residenza, data_nascita")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        if (data) {
          setComuneResidenza(data.comune_residenza || "");
          setDataNascita(data.data_nascita || "");
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
    setError("");

    try {
      if (!comuneResidenza || !dataNascita) {
        setError("Si prega di compilare tutti i campi obbligatori.");
        setIsLoading(false);
        return;
      }

      const { error: updateError } = await supabase
        .from("utenti")
        .update({
          comune_residenza: comuneResidenza,
          data_nascita: dataNascita,
          primo_login: false,
        })
        .eq("id", user.id);

      if (updateError) {
        throw updateError;
      }

      console.log("Profilo utente aggiornato con successo!");
      setIsLoading(false);

      if (onSaveSuccess) {
        onSaveSuccess();
      }
    } catch (err) {
      console.error("Errore nel salvataggio dei dati personali:", err);
      setError("Si è verificato un errore nel salvataggio. Riprova.");
      setIsLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      ...(isLargeScreen && {
        alignItems: "center",
        justifyContent: "center",
      }),
    },
    contentContainer: {
      alignItems: "center",
      padding: 20,
    },
    errorText: {
      color:theme.colors.error,
      marginBottom: 15,
      textAlign: "center",
    },
    input: {
      backgroundColor: theme.colors.background,
      borderColor: theme.colors.cardBorder,
      borderRadius: 10,
      borderWidth: 1,
      color: theme.colors.text,
      fontSize: 16,
      height: 50,
      marginBottom: 15,
      paddingHorizontal: 15,
      width: "100%",
    },
    popupContainer: {
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 15,
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      elevation: 8,
      maxWidth: 400,
      width: "90%",
    },
    saveButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 30,
      marginTop: 20,
      opacity: isLoading || isFetchingData ? 0.7 : 1,
      paddingHorizontal: 40,
      paddingVertical: 15,
    },
    saveButtonText: {
      color: theme.colors.headerText,
      fontSize: 18,
      fontWeight: "bold",
    },
    title: {
      color: theme.colors.text,
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 20,
    },
  });

  return (
    <View style={isLargeScreen ? styles.popupContainer : styles.container}>
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
              <Text style={styles.saveButtonText}>
                {isLoading ? "Salvataggio..." : "Salva"}
              </Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </View>
  );
};
