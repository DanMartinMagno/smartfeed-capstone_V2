import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import { EditWeightScreenNavigationProp, EditWeightScreenRouteProp } from '../types/navigation';
import { useSwineContext } from '../context/SwineContext';

type Props = {
  navigation: EditWeightScreenNavigationProp;
  route: EditWeightScreenRouteProp;
};

const EditWeightScreen: React.FC<Props> = ({ navigation, route }) => {
  const { swineId, weightId } = route.params;
  const { swines, editSwine } = useSwineContext();
  const [weight, setWeight] = useState<string>('');

  useEffect(() => {
    const swine = swines.find(sw => sw.id.trim() === swineId.trim());
    if (swine) {
      const weightEntry = swine.weights.find(w => w._id === weightId);
      if (weightEntry) {
        setWeight(weightEntry.weight.toString());
      }
    }
  }, [swineId, weightId, swines]);

  const handleSubmit = () => {
    axios.put(`http://192.168.42.108:5000/api/swine/${swineId.trim()}/weights/${weightId}`, {
      weight: parseFloat(weight),
    })
    .then(response => {
      editSwine(response.data);
      navigation.navigate('Swine Detail', { swineId });
    })
    .catch(error => console.error('Error updating weight', error));
  };

  return (
    <View style={styles.container}>
      <Text>Weight</Text>
      <TextInput
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
        style={styles.input}
      />
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

export default EditWeightScreen;
