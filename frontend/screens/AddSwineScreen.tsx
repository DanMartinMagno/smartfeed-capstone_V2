// frontend/src/screens/AddSwineScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
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
  const [errors, setErrors] = useState<{ id: boolean; weight: boolean; age: boolean }>({
    id: false,
    weight: false,
    age: false,
  });
  const [errorMessages, setErrorMessages] = useState<{ id: string; weight: string; age: string }>({
    id: '',
    weight: '',
    age: '',
  });
  const [touched, setTouched] = useState<{ id: boolean; weight: boolean; age: boolean }>({
    id: false,
    weight: false,
    age: false,
  });
  const { addSwine } = useSwineContext();

  const validateId = (value: string) => {
    if (!value && touched.id) {
      setErrors((prev) => ({ ...prev, id: true }));
      setErrorMessages((prev) => ({ ...prev, id: 'ID name is required.' }));
    } else {
      setErrors((prev) => ({ ...prev, id: false }));
      setErrorMessages((prev) => ({ ...prev, id: '' }));
    }
  };

  const validateWeight = (value: string) => {
    if (touched.weight) {
      if (!value) {
        setErrors((prev) => ({ ...prev, weight: true }));
        setErrorMessages((prev) => ({ ...prev, weight: 'Weight is required.' }));
      } else if (isNaN(Number(value)) || Number(value) < 1) {
        setErrors((prev) => ({ ...prev, weight: true }));
        setErrorMessages((prev) => ({ ...prev, weight: 'Weight is too low. Must be at least 1 kg.' }));
      } else if (Number(value) > 1000) {
        setErrors((prev) => ({ ...prev, weight: true }));
        setErrorMessages((prev) => ({ ...prev, weight: 'Weight is too high.' }));
      } else {
        setErrors((prev) => ({ ...prev, weight: false }));
        setErrorMessages((prev) => ({ ...prev, weight: '' }));
      }
    }
  };

  const validateAge = (value: string) => {
    if (touched.age) {
      if (!value) {
        setErrors((prev) => ({ ...prev, age: true }));
        setErrorMessages((prev) => ({ ...prev, age: 'Age is required.' }));
      } else if (isNaN(Number(value)) || Number(value) < 1) {
        setErrors((prev) => ({ ...prev, age: true }));
        setErrorMessages((prev) => ({ ...prev, age: 'Age is too low.' }));
      } else if (Number(value) > 240) {
        setErrors((prev) => ({ ...prev, age: true }));
        setErrorMessages((prev) => ({ ...prev, age: 'Age is too high.' }));
      } else {
        setErrors((prev) => ({ ...prev, age: false }));
        setErrorMessages((prev) => ({ ...prev, age: '' }));
      }
    }
  };

  const handleSubmit = () => {
    const idError = !id || id.trim() === '';
    const weightError = !weight || isNaN(Number(weight)) || Number(weight) < 1 || Number(weight) > 1000;
    const ageError = !age || isNaN(Number(age)) || Number(age) < 1 || Number(age) > 240;
  
    setTouched({ id: true, weight: true, age: true });
    setErrors({
      id: idError,
      weight: weightError,
      age: ageError,
    });
    setErrorMessages({
      id: idError ? 'ID name is required.' : '',
      weight: weightError ? 'Weight is required and must be at least 1 kg.' : '',
      age: ageError ? 'Age is required and must be at least 1.' : '',
    });
  
    if (idError || weightError || ageError) {
      Alert.alert('Validation Error', 'Please correct the errors before submitting.');
      return;
    }
  
    axios
      .post('http://192.168.42.108:5000/api/swine', {
        id,
        weight: parseFloat(weight),
        age: parseInt(age),
      })
      .then((response) => {
        const newSwineId: string = response.data.id;  // Ensure newSwineId is typed as string
  
        addSwine(response.data);
        
        // Navigate to SwineDetailScreen with the correctly typed swineId
        navigation.navigate('Swine Detail', { swineId: newSwineId });
      })
      .catch((error) => {
        if (error.response && error.response.status === 400 && error.response.data.message === 'ID already exists') {
          Alert.alert('Duplicate ID', 'The ID you entered already exists. Please use a different ID.');
        } else {
          console.error('Error submitting data', error);
          Alert.alert('Error', 'Something went wrong while submitting the data.');
        }
      });
  };
  
  
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Add New Swine</Text>

      {/* ID Field */}
      <Text style={styles.label}>ID name</Text>
      <TextInput
        style={[styles.input, errors.id && touched.id && styles.inputError]}
        value={id}
        onChangeText={(text) => {
          setTouched((prev) => ({ ...prev, id: true }));
          setId(text);
          validateId(text);
        }}
        placeholder="Enter Swine ID name"
        placeholderTextColor="#888"
      />
      {errors.id && touched.id && (
        <Text style={styles.errorText}>{errorMessages.id}</Text>
      )}

      {/* Weight Field */}
      <Text style={styles.label}>Weight (kg)</Text>
      <TextInput
        style={[styles.input, errors.weight && touched.weight && styles.inputError]}
        value={weight}
        onChangeText={(text) => {
          setTouched((prev) => ({ ...prev, weight: true }));
          setWeight(text);
          validateWeight(text);
        }}
        keyboardType="numeric"
        placeholder="Enter Weight"
        placeholderTextColor="#888"
      />
      {errors.weight && touched.weight && (
        <Text style={styles.errorText}>{errorMessages.weight}</Text>
      )}

      {/* Age Field */}
      <Text style={styles.label}>Age (days)</Text>
      <TextInput
        style={[styles.input, errors.age && touched.age && styles.inputError]}
        value={age}
        onChangeText={(text) => {
          setTouched((prev) => ({ ...prev, age: true }));
          setAge(text);
          validateAge(text);
        }}
        keyboardType="numeric"
        placeholder="Enter Age"
        placeholderTextColor="#888"
      />
      {errors.age && touched.age && (
        <Text style={styles.errorText}>{errorMessages.age}</Text>
      )}

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    marginLeft: 5,
  },
  input: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    marginBottom: 5,
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputError: {
    borderColor: '#E74C3C',
    borderWidth: 2, // Make the border more prominent
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

export default AddSwineScreen;
