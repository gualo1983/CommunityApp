// File: components/ParishDropdownMenu.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useTheme } from "../contexts/theme";

interface Parish {
  id: string;
  name: string;
  isFavorite: boolean;
}

// Definisco un tipo per gli oggetti che possono essere passati al FlatList,
// che può contenere sia una Parrocchia che un oggetto header.
type ParishOrHeader = Parish | { id: string; name: string; type: "header" };

interface ParishDropdownMenuProps {
  parishes: Parish[];
  onSelect: (parish: Parish) => void;
  selectedParish: Parish;
  onToggleFavorite: (parishId: string) => void;
}

const ParishDropdownMenu = ({
  parishes,
  onSelect,
  selectedParish,
  onToggleFavorite,
}: ParishDropdownMenuProps) => {
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");

  const filteredParishes = parishes.filter((parish) =>
    parish.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  const renderParishItem = ({ item }: { item: Parish }) => (
    <View style={dropdownStyles.listItem}>
      <TouchableOpacity
        onPress={() => {
          onSelect(item);
          setModalVisible(false);
          setSearchText("");
        }}
        style={dropdownStyles.listTextContainer}
      >
        <Text style={dropdownStyles.listText}>{item.name}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onToggleFavorite(item.id)}
        style={dropdownStyles.favoriteButton}
      >
        <MaterialCommunityIcons
          name={item.isFavorite ? "star" : "star-outline"}
          size={24}
          color={
            item.isFavorite
              ? theme.colors.tabBarActive
              : theme.colors.textSecondary
          }
        />
      </TouchableOpacity>
    </View>
  );

  const dropdownStyles = StyleSheet.create({
    dropdownButton: {
      alignItems: "center",
      flexDirection: "row",
      paddingHorizontal: 15,
    },
    dropdownTextButton: {
      color: theme.colors.headerText,
      marginRight: 5,
    },
    favoriteButton: {
      padding: 5,
    },
    listItem: {
      alignItems: "center",
      borderBottomColor: theme.colors.cardBorder,
      borderBottomWidth: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 10,
    },
    listText: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSizes.small,
    },
    listTextContainer: {
      flex: 1,
      marginRight: 10,
    },
    modalContainer: {
      alignItems: "center",
      backgroundColor: theme.colors.cardBackground,
      flex: 1,
      justifyContent: "center",
    },
    modalContent: {
      backgroundColor: theme.colors.background,
      borderRadius: 10,
      flex: 1,
      maxHeight: Dimensions.get("window").height * 0.8,
      maxWidth: 400,
      padding: 20,
      width: "90%",
    },
    modalHeader: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 10,
    },
    modalTitle: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSizes.medium,
      fontWeight: theme.typography.fontWeights.bold,
    },
    searchInput: {
      backgroundColor: theme.colors.cardBackground,
      borderColor: theme.colors.cardBorder,
      borderRadius: 5,
      borderWidth: 1,
      color: theme.colors.text,
      height: 40,
      marginBottom: 10,
      paddingHorizontal: 10,
    },
    sectionHeader: {
      backgroundColor: theme.colors.cardBackground,
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSizes.small,
      fontWeight: "bold",
      marginTop: 10,
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
  });

  const favoriteParishes = filteredParishes.filter((p) => p.isFavorite);
  const otherParishes = filteredParishes.filter((p) => !p.isFavorite);

  // Definisci gli oggetti header con 'as const' per garantire il tipo letterale
  const favoritesHeader = {
    id: "favorites-header",
    name: "Preferite",
    type: "header" as const,
  };
  const othersHeader = {
    id: "others-header",
    name: "Altre Parrocchie",
    type: "header" as const,
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={dropdownStyles.dropdownButton}
      >
        <Text style={dropdownStyles.dropdownTextButton}>
          {selectedParish?.name || "Seleziona"}
        </Text>
        <MaterialCommunityIcons
          name="menu-down"
          size={24}
          color={theme.colors.headerText}
        />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setSearchText("");
        }}
      >
        <View style={dropdownStyles.modalContainer}>
          <View style={dropdownStyles.modalContent}>
            <View style={dropdownStyles.modalHeader}>
              <Text style={dropdownStyles.modalTitle}>
                Seleziona Parrocchia
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setSearchText("");
                }}
              >
                <MaterialCommunityIcons
                  name="close-circle"
                  size={24}
                  color={theme.colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
            <TextInput
              style={dropdownStyles.searchInput}
              placeholder="Cerca parrocchia..."
              placeholderTextColor={theme.colors.textSecondary}
              value={searchText}
              onChangeText={setSearchText}
            />
            <FlatList
              data={[
                ...(favoriteParishes.length > 0 ? [favoritesHeader] : []),
                ...favoriteParishes,
                ...(otherParishes.length > 0 ? [othersHeader] : []),
                ...otherParishes,
              ]}
              renderItem={({ item }: { item: ParishOrHeader }) => {
                // Controllo esplicito per il tipo di elemento
                if ("type" in item && item.type === "header") {
                  return (
                    <Text style={dropdownStyles.sectionHeader}>
                      {item.name}
                    </Text>
                  );
                }
                // Altrimenti, renderizza l'elemento della parrocchia
                return renderParishItem({ item: item as Parish });
              }}
              keyExtractor={(item) => item.id}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ParishDropdownMenu;

/*
// File: components/ParishDropdownMenu.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

improt { useTheme } from "../contexts/theme";

interface Parish {
  id: string;
  name: string;
  isFavorite: boolean;
}

interface ParishDropdownMenuProps {
  parishes: Parish[];
  onSelect: (parish: Parish) => void;
  selectedParish: Parish;
  onToggleFavorite: (parishId: string) => void;
}

const ParishDropdownMenu = ({
  parishes,
  onSelect,
  selectedParish,
  onToggleFavorite,
}: ParishDropdownMenuProps) => {
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");

  const filteredParishes = parishes.filter((parish) =>
    parish.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  const renderItem = ({ item }: { item: Parish }) => (
    <View style={dropdownStyles.listItem}>
      <TouchableOpacity
        onPress={() => {
          onSelect(item);
          setModalVisible(false);
          setSearchText("");
        }}
        style={dropdownStyles.listTextContainer}
      >
        <Text style={dropdownStyles.listText}>{item.name}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onToggleFavorite(item.id)}
        style={dropdownStyles.favoriteButton}
      >
        <MaterialCommunityIcons
          name={item.isFavorite ? "star" : "star-outline"}
          size={24}
          color={
            item.isFavorite
              ? theme.colors.tabBarActive
              : theme.colors.textSecondary
          }
        />
      </TouchableOpacity>
    </View>
  );

  const dropdownStyles = StyleSheet.create({
    dropdownButton: {
      alignItems: "center",
      flexDirection: "row",
      paddingHorizontal: 15,
    },
    dropdownTextButton: {
      color: theme.colors.headerText,
      marginRight: 5,
    },
    favoriteButton: {
      padding: 5,
    },
    listItem: {
      alignItems: "center",
      borderBottomColor: theme.colors.cardBorder,
      borderBottomWidth: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 10,
    },
    listText: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSizes.small,
    },
    listTextContainer: {
      flex: 1,
      marginRight: 10,
    },
    modalContainer: {
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
      flex: 1,
      justifyContent: "center",
    },
    modalContent: {
      backgroundColor: theme.colors.background,
      borderRadius: 10,
      flex: 1,
      maxHeight: Dimensions.get("window").height * 0.8,
      maxWidth: 400,
      padding: 20,
      width: "90%",
    },
    modalHeader: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 10,
    },
    modalTitle: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSizes.medium,
      fontWeight: theme.typography.fontWeights.bold,
    },
    searchInput: {
      backgroundColor: theme.colors.cardBackground,
      borderColor: theme.colors.cardBorder,
      borderRadius: 5,
      borderWidth: 1,
      color: theme.colors.text,
      height: 40,
      marginBottom: 10,
      paddingHorizontal: 10,
    },
    sectionHeader: {
      backgroundColor: theme.colors.cardBackground,
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSizes.small,
      fontWeight: "bold",
      marginTop: 10,
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
  });

  const favoriteParishes = filteredParishes.filter((p) => p.isFavorite);
  const otherParishes = filteredParishes.filter((p) => !p.isFavorite);

  return (
    <View>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={dropdownStyles.dropdownButton}
      >
        <Text style={dropdownStyles.dropdownTextButton}>
          {selectedParish?.name || "Seleziona"}
        </Text>
        <MaterialCommunityIcons
          name="menu-down"
          size={24}
          color={theme.colors.headerText}
        />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setSearchText("");
        }}
      >
        <View style={dropdownStyles.modalContainer}>
          <View style={dropdownStyles.modalContent}>
            <View style={dropdownStyles.modalHeader}>
              <Text style={dropdownStyles.modalTitle}>
                Seleziona Parrocchia
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setSearchText("");
                }}
              >
                <MaterialCommunityIcons
                  name="close-circle"
                  size={24}
                  color={theme.colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
            <TextInput
              style={dropdownStyles.searchInput}
              placeholder="Cerca parrocchia..."
              placeholderTextColor={theme.colors.textSecondary}
              value={searchText}
              onChangeText={setSearchText}
            />
            <FlatList
              data={[
                ...(favoriteParishes.length > 0
                  ? [
                      {
                        id: "favorites-header",
                        name: "Preferite",
                        type: "header",
                      },
                    ]
                  : []),
                ...favoriteParishes,
                ...(otherParishes.length > 0
                  ? [
                      {
                        id: "others-header",
                        name: "Altre Parrocchie",
                        type: "header",
                      },
                    ]
                  : []),
                ...otherParishes,
              ]}
              renderItem={({ item }: { item: any }) =>
                item.type === "header" ? (
                  <Text style={dropdownStyles.sectionHeader}>{item.name}</Text>
                ) : (
                  renderItem({ item })
                )
              }
              keyExtractor={(item) => item.id}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ParishDropdownMenu;
*/
