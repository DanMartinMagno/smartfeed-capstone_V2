import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import { AddWeightScreenNavigationProp, AddWeightScreenRouteProp } from '../types/navigation';
import { useSwineContext } from '../context/SwineContext';

type Props = {
  navigation: AddWeightScreenNavigationProp;
  route: AddWeightScreenRouteProp;
};

const AddWeightScreen: React.FC<Props> = ({ navigation, route }) => {
  const { swineId } = route.params;
  const { addWeight } = useSwineContext();
  const [weight, setWeight] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString());

  const handleSubmit = () => {
    axios.post(`http://192.168.42.108:5000/api/swine/${swineId}/weights`, { date, weight: parseFloat(weight) })
      .then(response => {
        addWeight(swineId, response.data.weights[response.data.weights.length - 1]);
        navigation.navigate('Swine Detail', { swineId });
      })
      .catch(error => console.error('Error submitting weight', error));
  };

  return (
    <View style={styles.container}>
      <Text>Date</Text>
      <TextInput value={date} onChangeText={setDate} style={styles.input} />
      <Text>Weight</Text>
      <TextInput value={weight} onChangeText={setWeight} keyboardType="numeric" style={styles.input} />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  input: {
    borderWidth: 1,
    padding: 8,
    marginVertical: 10,
  },
});

export default AddWeightScreen;
