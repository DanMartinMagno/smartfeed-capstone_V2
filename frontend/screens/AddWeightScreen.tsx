import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import axiosInstance from '../api/axiosInstance';
import {
  AddWeightScreenNavigationProp,
  AddWeightScreenRouteProp,
} from '../types/navigation';
import { useSwineContext } from '../context/SwineContext';
import axios from 'axios';

type Props = {
  navigation: AddWeightScreenNavigationProp;
  route: AddWeightScreenRouteProp;
};

const AddWeightScreen: React.FC<Props> = ({ navigation, route }) => {
  const { swineId } = route.params;
  const { addWeight, swines, fetchSwines } = useSwineContext();
  const [weight, setWeight] = useState<string>('');
  const [weightError, setWeightError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Get today's date as a string
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const validateWeight = (text: string): boolean => {
    const weightValue = parseFloat(text);
    if (!text.trim()) {
      setWeightError('Weight is required.');
      return false;
    } else if (isNaN(weightValue) || weightValue < 1 || weightValue > 1000) {
      setWeightError('Weight must be between 1 kg and 1000 kg.');
      return false;
    }
    setWeightError('');
    return true;
  };

  const handleSubmit = async () => {
    if (loading) return; // Prevent further actions if already loading

    const weightValue = parseFloat(weight);

    if (!validateWeight(weight)) return; // Stop if validation fails

    setLoading(true); // Disable button while processing

    const swine = swines.find((sw) => sw.id === swineId);
    if (swine && swine.weights.length > 0) {
      const latestWeight = swine.weights[swine.weights.length - 1].weight;
      // Uncomment this section to enforce strict weight validation
      // if (weightValue <= latestWeight) {
      //   setWeightError(`New weight must be strictly greater than ${latestWeight} kg.`);
      //   setLoading(false);
      //   return;
      // }
    }

    try {
      const response = await axiosInstance.post(`/swine/${swineId}/weights`, {
        date: currentDate,
        weight: weightValue,
      });
      addWeight(
        swineId,
        response.data.weights[response.data.weights.length - 1]
      );
      await fetchSwines(); // Ensure context is up to date
      navigation.navigate('Swine Detail', { swineId });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data) {
          setWeightError(error.response.data.message || 'Error occurred.');
        }
      } else if (error instanceof Error) {
        setWeightError(error.message);
      }
      console.error('Error adding weight:', error);
    } finally {
      setLoading(false); // Re-enable button after API call
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Date</Text>
      <View style={styles.readOnlyField}>
        <Text style={styles.readOnlyText}>{currentDate}</Text>
      </View>

      <Text style={styles.label}>Weight (kg)</Text>
      <TextInput
        value={weight}
        onChangeText={(text) => {
          setWeight(text);
          validateWeight(text);
        }}
        keyboardType="numeric"
        style={[styles.input, weightError ? styles.inputError : null]}
        placeholder="Enter Weight"
        placeholderTextColor="#888" // Sets placeholder text color
      />

      {weightError ? <Text style={styles.errorText}>{weightError}</Text> : null}

      <TouchableOpacity
        style={[
          styles.submitButton,
          loading && { backgroundColor: '#28a745' }, // Indicate disabled state
        ]}
        onPress={handleSubmit}
        disabled={loading} // Disable button during loading
      >
        <Text style={styles.submitButtonText}>
          {loading ? 'Submitting...' : 'Submit'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f2f6f9',
  },
  label: {
    fontSize: 15,
    color: '#333',
    marginBottom: 5,
    marginLeft: 5,
  },
  readOnlyField: {
    backgroundColor: '#f2f6f9',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
  },
  readOnlyText: {
    fontSize: 15,
    color: '#333',
  },
  input: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EEEFEF',
    marginBottom: 15,
    fontSize: 14,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputError: {
    borderColor: '#E74C3C',
    borderWidth: 2,
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 14,
    marginBottom: 10,
    marginLeft: 5,
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddWeightScreen;
