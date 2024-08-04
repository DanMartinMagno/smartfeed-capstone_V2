import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Swine {
  id: string;
  weight: number;
  age: number;
  date: string;
}

interface Props {
  swine: Swine;
}

const SwineListItem: React.FC<Props> = ({ swine }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>ID:</Text><Text style={styles.value}>{swine.id}</Text>
      <Text style={styles.label}>Weight:</Text><Text style={styles.value}>{swine.weight} kg</Text>
      <Text style={styles.label}>Age:</Text><Text style={styles.value}>{swine.age} months</Text>
      <Text style={styles.label}>Date:</Text><Text style={styles.value}>{new Date(swine.date).toLocaleDateString()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  label: {
    fontWeight: 'bold'
  },
  value: {
    marginBottom: 5
  }
});

export default SwineListItem;
