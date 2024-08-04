// frontend/src/screens/AddSwineScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import axios from 'axios';
import { AddSwineScreenNavigationProp, AddSwineScreenRouteProp } from '../types/navigation';
import { useSwineContext } from '../context/SwineContext';

type Props = {
  navigation: AddSwineScreenNavigationProp;
  route: AddSwineScreenRouteProp;
};

const AddSwineScreen: React.FC<Props> = ({ navigation }) => {
  const [id, setId] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const { addSwine } = useSwineContext();

  const handleSubmit = () => {
    axios.post('http://192.168.42.108:5000/api/swine', {
      id,
      weight: parseFloat(weight),
      age: parseInt(age),
    })
    .then(response => {
      addSwine(response.data);
      navigation.navigate('Home');
    })
    .catch(error => console.error('Error submitting data', error));
  };

  return (
    <View>
      <Text>Swine ID</Text>
      <TextInput value={id} onChangeText={setId} />
      <Text>Weight</Text>
      <TextInput value={weight} onChangeText={setWeight} keyboardType="numeric" />
      <Text>Age</Text>
      <TextInput value={age} onChangeText={setAge} keyboardType="numeric" />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
}

export default AddSwineScreen;
