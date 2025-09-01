import React, { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import {
  SwineDetailScreenNavigationProp,
  SwineDetailScreenRouteProp,
} from '../types/navigation';
import { useSwineContext } from '../context/SwineContext';

type Props = {
  navigation: SwineDetailScreenNavigationProp;
  route: SwineDetailScreenRouteProp;
};

interface WeightEntry {
  date: string;
  weight: number;
  _id: string;
}

const SwineDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { swineId } = route.params;
  const { swines, deleteWeight, editWeight } = useSwineContext();
  const [selectedEntry, setSelectedEntry] = useState<WeightEntry | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const swine = swines.find((swine) => swine.id === swineId);
  const weightEntries = swine ? swine.weights : [];

  useFocusEffect(useCallback(() => {}, []));

  const handleDeleteWeight = (weightId: string) => {
    Alert.alert(
      'Delete Weight',
      'Are you sure you want to delete this weight entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteWeight(swineId, weightId);
            setMenuVisible(false);
          },
        },
      ]
    );
  };

  const handleEditWeight = (weightId: string, newWeight: number) => {
    const maxWeight = Math.max(
      ...weightEntries
        .filter((entry) => entry._id !== weightId)
        .map((entry) => entry.weight)
    );

    // Validate new weight
    if (newWeight <= maxWeight) {
      Alert.alert(
        'Validation Error',
        `New weight must be greater than ${maxWeight}kg.`
      );
      return;
    }

    editWeight(swineId, weightId, newWeight);
  };

  // Open the menu for a selected weight entry
  const handleOpenMenu = (entry: WeightEntry) => {
    setSelectedEntry(entry);
    setMenuVisible(true);
  };

  // Close the menu
  const handleCloseMenu = () => {
    setMenuVisible(false);
    setSelectedEntry(null);
  };

  if (!swine) {
    return <Text>No swine data available</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={weightEntries}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.textContainer}>
              <Text style={styles.dateText}>
                Date:{' '}
                {new Date(item.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
              <Text style={styles.weightText}>Weight: {item.weight} kg</Text>
            </View>
            <TouchableOpacity onPress={() => handleOpenMenu(item)}>
              <MaterialIcons name="more-horiz" size={24} color="black" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No weight entries available.</Text>
        }
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Add Weight', { swineId })}
        >
          <MaterialIcons name="add" size={24} color="white" />
          <Text style={styles.actionButtonText}>Add Weight</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Graph', { swineId })}
        >
          <MaterialIcons name="show-chart" size={24} color="white" />
          <Text style={styles.actionButtonText}>Show Graph</Text>
        </TouchableOpacity>
      </View>

      <Modal
        transparent={true}
        visible={menuVisible}
        onRequestClose={handleCloseMenu}
        animationType="fade"
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={handleCloseMenu}>
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                if (selectedEntry?._id) {
                  navigation.navigate('Edit Weight', {
                    swineId,
                    weightId: selectedEntry._id,
                  });
                  handleCloseMenu();
                }
              }}
            >
              <MaterialIcons name="edit" size={24} color="#28a745" />
              <Text style={styles.menuItemText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                if (selectedEntry?._id) {
                  handleDeleteWeight(selectedEntry._id);
                  handleCloseMenu();
                }
              }}
            >
              <MaterialIcons name="delete" size={24} color="red" />
              <Text style={styles.menuItemText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f2f6f9',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 5,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
  },
  actionButtonText: {
    color: 'white',
    marginLeft: 15,
    fontSize: 16,
    marginRight: 15,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  textContainer: {
    flex: 1,
  },
  dateText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  weightText: {
    fontSize: 15,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  menuItemText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
});

export default SwineDetailScreen;
