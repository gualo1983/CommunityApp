import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../contexts/theme';
import AddTabModal from './AddTabModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import EditTabModal from './EditTabModal';

interface TabMenuProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
  content: string;
  tabs: string[];
  isAuthorized: boolean;
  onAddTab: (tabName: string) => void;
  onEditTab: (oldName: string, newName: string) => void;
  onDeleteTab: (tabName: string) => void;
}

const TabMenu = ({ activeTab, onTabPress, content, tabs, isAuthorized, onAddTab, onEditTab, onDeleteTab }: TabMenuProps) => {
  const { theme } = useTheme();
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const tabStyles = StyleSheet.create({
    activeTabButton: {
      backgroundColor: theme.colors.cardBackground,
      boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.1)',
      elevation: 2,
    },
    activeTabText: {
      color: theme.colors.primary,
    },
    adminButton: {
      paddingHorizontal: 8,
    },
    adminButtonsContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      paddingRight: 10,
    },
    contentContainer: {
      padding: 20,
    },
    contentText: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSizes.medium,
      lineHeight: 24,
    },
    tabButton: {
      borderRadius: 10,
      marginHorizontal: 5,
      paddingHorizontal: 15,
      paddingVertical: 10,
    },
    tabContainer: {
      alignItems: 'center',
      backgroundColor: theme.colors.headerBackground,
      borderBottomColor: theme.colors.cardBorder,
      borderBottomWidth: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 5,
    },
    tabText: {
      color: theme.colors.headerText,
      fontSize: theme.typography.fontSizes.small,
      fontWeight: theme.typography.fontWeights.bold,
    },
    tabsScrollView: {
        flex: 1,
    },
  });

  return (
    <>
      <View style={tabStyles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={tabStyles.tabsScrollView}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[tabStyles.tabButton, activeTab === tab && tabStyles.activeTabButton]}
              onPress={() => onTabPress(tab)}
            >
              <Text style={[tabStyles.tabText, activeTab === tab && tabStyles.activeTabText]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {isAuthorized && (
          <View style={tabStyles.adminButtonsContainer}>
            <TouchableOpacity style={tabStyles.adminButton} onPress={() => setIsAddModalVisible(true)}>
              <MaterialCommunityIcons name="plus-circle" size={24} color={theme.colors.tabBarActive} />
            </TouchableOpacity>
            <TouchableOpacity style={tabStyles.adminButton} onPress={() => setIsEditModalVisible(true)}>
              <MaterialCommunityIcons name="pencil-circle" size={24} color={theme.colors.tabBarActive} />
            </TouchableOpacity>
            <TouchableOpacity style={tabStyles.adminButton} onPress={() => setIsDeleteModalVisible(true)}>
              <MaterialCommunityIcons name="minus-circle" size={24} color={theme.colors.tabBarActive} />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <ScrollView style={tabStyles.contentContainer}>
        <Text style={tabStyles.contentText}>{content}</Text>
      </ScrollView>
      {/* Modali */}
      <AddTabModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onAddTab={onAddTab}
      />
      <EditTabModal
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        onEdit={(newName) => {
          onEditTab(activeTab, newName);
          setIsEditModalVisible(false);
        }}
        initialName={activeTab}
      />
      <ConfirmDeleteModal
        visible={isDeleteModalVisible}
        onClose={() => setIsDeleteModalVisible(false)}
        onConfirm={() => {
          onDeleteTab(activeTab);
          setIsDeleteModalVisible(false);
        }}
        tabName={activeTab}
      />
    </>
  );
};

export default TabMenu;