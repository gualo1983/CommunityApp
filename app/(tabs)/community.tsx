import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import DropdownMenu from '../../components/DropdownMenu';
import ParishDropdownMenu from '../../components/ParishDropdownMenu';
import TabMenu from '../../components/TabMenu';
import { useTheme } from '../../contexts/theme';

// Interfacce per tipizzazione (rimangono le stesse)
interface Parish {
  id: string;
  name: string;
  isFavorite: boolean;
}

interface ParishContent {
  [key: string]: string; // Reso più flessibile per le tab dinamiche
}

interface ParishData {
  [key: string]: ParishContent;
}

// Dati fittizi per le parrocchie
const DUMMY_PARISHES: Parish[] = [
  { id: '1', name: 'Parrocchia di San Giovanni', isFavorite: true },
  { id: '2', name: 'Parrocchia di Santa Maria', isFavorite: false },
  { id: '3', name: 'Parrocchia del Sacro Cuore', isFavorite: true },
  { id: '4', name: 'Chiesa di San Francesco', isFavorite: false },
  { id: '5', name: 'Cattedrale di San Pietro', isFavorite: false },
];

// Dati fittizi per i contenuti delle tab (reso più flessibile)
const DUMMY_PARISH_DATA: ParishData = {
  '1': {
    info: 'La Parrocchia di San Giovanni è una comunità vivace e accogliente.',
    events: 'Sabato 18:00: Messa serale.',
    contacts: 'Don Andrea\nTel: 011-1234567',
  },
  '2': {
    info: 'La Parrocchia di Santa Maria è un punto di riferimento spirituale per il quartiere.',
    events: 'Mercoledì 17:00: Incontro del gruppo di studio biblico.',
    contacts: 'Don Marco\nTel: 011-9876543',
  },
  '3': {
    info: 'Una delle parrocchie più antiche della città.',
    events: 'Lunedì 16:30: Catechismo per bambini.',
    contacts: 'Don Giorgio\nTel: 011-4567890',
  },
};

const CommunityScreen = () => {
  const { theme } = useTheme();
  
  const [parishes, setParishes] = useState<Parish[]>(DUMMY_PARISHES);
  const [selectedParish, setSelectedParish] = useState<Parish>(parishes[0]);
  const [activeTab, setActiveTab] = useState<string>('info');
  const [tabs, setTabs] = useState<string[]>(['info', 'events', 'contacts']);
  const isAuthorized = true;

  const handleToggleFavorite = (parishId: string) => {
    setParishes(
      parishes.map((p) =>
        p.id === parishId ? { ...p, isFavorite: !p.isFavorite } : p
      )
    );
  };

  const handleAddTab = (tabName: string) => {
    setTabs([...tabs, tabName]);
    // Aggiorna DUMMY_PARISH_DATA per la nuova tab (simulazione)
    Object.keys(DUMMY_PARISH_DATA).forEach(parishId => {
      DUMMY_PARISH_DATA[parishId][tabName] = `Contenuto per la nuova tab '${tabName}'`;
    });
    setActiveTab(tabName);
  };

  const handleEditTab = (oldName: string, newName: string) => {
    const newTabs = tabs.map(tab => tab === oldName ? newName : tab);
    setTabs(newTabs);
    // Aggiorna DUMMY_PARISH_DATA per la tab modificata (simulazione)
    Object.keys(DUMMY_PARISH_DATA).forEach(parishId => {
      DUMMY_PARISH_DATA[parishId][newName] = DUMMY_PARISH_DATA[parishId][oldName];
      delete DUMMY_PARISH_DATA[parishId][oldName];
    });
    setActiveTab(newName);
  };

  const handleDeleteTab = (tabName: string) => {
    const newTabs = tabs.filter(tab => tab !== tabName);
    setTabs(newTabs);
    // Aggiorna DUMMY_PARISH_DATA per la tab eliminata (simulazione)
    Object.keys(DUMMY_PARISH_DATA).forEach(parishId => {
      delete DUMMY_PARISH_DATA[parishId][tabName];
    });
    setActiveTab(newTabs[0] || '');
  };

  const getContent = () => {
    if (selectedParish && DUMMY_PARISH_DATA[selectedParish.id]) {
      const content = DUMMY_PARISH_DATA[selectedParish.id][activeTab];
      return content || `Contenuto per la tab '${activeTab}' non disponibile.`;
    }
    return 'Nessun contenuto disponibile.';
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      flex: 1,
    },
    content: {
      flex: 1,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: selectedParish.name,
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
          headerLeft: () => (
            <ParishDropdownMenu
              parishes={parishes}
              onSelect={setSelectedParish}
              selectedParish={selectedParish}
              onToggleFavorite={handleToggleFavorite}
            />
          ),
          headerRight: () => <DropdownMenu />,
        }}
      />
      
      <View style={styles.content}>
        <TabMenu 
          activeTab={activeTab}
          onTabPress={setActiveTab}
          content={getContent()}
          tabs={tabs}
          isAuthorized={isAuthorized}
          onAddTab={handleAddTab}
          onEditTab={handleEditTab}
          onDeleteTab={handleDeleteTab}
        />
      </View>
    </SafeAreaView>
  );
};

export default CommunityScreen;