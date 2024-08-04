import React from 'react';
import { View, Button, FlatList, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { HomeScreenNavigationProp, HomeScreenRouteProp } from '../types/navigation';
import SwineListItem from '../components/SwineList';
import { useSwineContext } from '../context/SwineContext';

type Props = {
  navigation: HomeScreenNavigationProp;
  route: HomeScreenRouteProp;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { swines, loading, error, deleteSwine } = useSwineContext();

  const confirmDeleteSwine = (swineId: string) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this swine?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => handleDeleteSwine(swineId) }
      ]
    );
  };

  const handleDeleteSwine = (swineId: string) => {
    axios.delete(`http://192.168.42.108:5000/api/swine/${swineId}`)
      .then(() => {
        deleteSwine(swineId);
      })
      .catch(error => console.error('Error deleting swine', error));
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Button title="Add Swine" onPress={() => navigation.navigate('Add Swine')} />
      <FlatList
        data={swines}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('Swine Detail', { swineId: item.id })}>
              <SwineListItem swine={item} />
            </TouchableOpacity>
            <Button title="Delete" onPress={() => confirmDeleteSwine(item.id)} />
          </View>
        )}
        ListEmptyComponent={<Text>No swine data available.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
});

export default HomeScreen;
