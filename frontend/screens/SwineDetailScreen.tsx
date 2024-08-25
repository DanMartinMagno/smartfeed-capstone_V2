import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, Alert, Modal, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { SwineDetailScreenNavigationProp, SwineDetailScreenRouteProp } from '../types/navigation';
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
  const { swines } = useSwineContext();
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<WeightEntry | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    axios.get(`http://192.168.42.108:5000/api/swine/${swineId}/weights`)
      .then(response => {
        setWeightEntries(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Error fetching data');
        setLoading(false);
      });
  }, [swineId]);

  useEffect(() => {
    const updatedSwine = swines.find(sw => sw.id === swineId);
    if (updatedSwine) {
      setWeightEntries(updatedSwine.weights);
    }
  }, [swines, swineId]);

  const confirmDeleteWeight = (date: string) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this weight entry?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => handleDeleteWeight(date) }
      ]
    );
  };

  const handleDeleteWeight = (date: string) => {
    axios.delete(`http://192.168.42.108:5000/api/swine/${swineId}/weights`, { data: { date } })
      .then(() => {
        setWeightEntries(prevEntries => prevEntries.filter(entry => entry.date !== date));
        setMenuVisible(false); // Hide menu after deletion
      })
      .catch(error => console.error('Error deleting weight', error.response ? error.response.data : error.message));
  };

  const handleOpenMenu = (entry: WeightEntry) => {
    setSelectedEntry(entry);
    setMenuVisible(true);
  };

  const handleCloseMenu = () => {
    setMenuVisible(false);
    setSelectedEntry(null);
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Add Weight', { swineId })}>
          <MaterialIcons name="add" size={24} color="white" />
          <Text style={styles.actionButtonText}>Add Weight</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Graph', { swineId })}>
          <MaterialIcons name="show-chart" size={24} color="white" />
          <Text style={styles.actionButtonText}>Show Graph</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={weightEntries}
        keyExtractor={(item) => item._id || item.date}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.textContainer}>
              <Text style={styles.dateText}>Date: {new Date(item.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}</Text>
              <Text style={styles.weightText}>Weight: {item.weight} kg</Text>
            </View>
            <TouchableOpacity onPress={() => handleOpenMenu(item)}>
              <MaterialIcons name="more-horiz" size={24} color="black" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No weight entries available.</Text>}
      />

      {/* Menu Modal */}
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
                  navigation.navigate('Edit Weight', { swineId, weightId: selectedEntry._id });
                  handleCloseMenu();
                } else {
                  console.error('Error: Weight ID is undefined.');
                }
              }}
            >
              <MaterialIcons name="edit" size={24} color="#28a745" />
              <Text style={styles.menuItemText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
  style={styles.menuItem}
  onPress={() => {
    if (selectedEntry?.date) {
      confirmDeleteWeight(selectedEntry.date);
      handleCloseMenu();
    }
  }}
>
  {/* Replaced custom image icon with MaterialIcons */}
  <MaterialIcons name="delete-outline" size={24} color="black" />
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
    backgroundColor: '#F5F5F5',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
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
    marginLeft: 5,
    fontSize: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  weightText: {
    fontSize: 16,
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
  deleteIconContainer: {
    padding: 0, // Removed padding
    backgroundColor: 'transparent', // Removed background color
    borderRadius: 0, // Removed border radius if not needed
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteIcon: {
    width: 24,
    height: 24,
  },
});

export default SwineDetailScreen;
