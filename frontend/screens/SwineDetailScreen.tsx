import React, { useEffect, useState } from 'react';
import { View, Button, FlatList, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
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
  const { swineId, initialWeight } = route.params;
  const { swines, addWeight } = useSwineContext();
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`http://192.168.42.108:5000/api/swine/${swineId}/weights`)
      .then(response => {
        setWeightEntries(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError('Error fetching data');
        setLoading(false);
      });
  }, [swineId]);

  useEffect(() => {
    if (initialWeight !== undefined) {
      setWeightEntries(prevEntries => [...prevEntries, { date: new Date().toISOString(), weight: initialWeight, _id: '' }]);
    }
  }, [initialWeight]);

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
      })
      .catch(error => console.error('Error deleting weight', error.response ? error.response.data : error.message));
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Button title="Add Weight" onPress={() => navigation.navigate('Add Weight', { swineId })} />
      <Button title="Show Graph" onPress={() => navigation.navigate('Graph', { swineId })} />
      <FlatList
        data={weightEntries}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>Date: {new Date(item.date).toLocaleDateString()}</Text>
            <Text>Weight: {item.weight} kg</Text>
            <Button title="Delete" onPress={() => confirmDeleteWeight(item.date)} />
            <Button title="Edit" onPress={() => navigation.navigate('Edit Weight', { swineId, weightId: item._id })} />
          </View>
        )}
        ListEmptyComponent={<Text>No weight entries available.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default SwineDetailScreen;
