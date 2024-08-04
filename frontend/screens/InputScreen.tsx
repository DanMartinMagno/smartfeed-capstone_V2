import React, { useState } from 'react';
import { View, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setNumSwine, setSelectedIngredients } from '../store/feedSlice';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { Card, Text, TextInput, Button, Checkbox, HelperText } from 'react-native-paper';
import { styles } from '../styles/InputScreen_styles';

type InputScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Input'>;

type Props = {
  navigation: InputScreenNavigationProp;
};

const MAX_INGREDIENTS = 10;
const MAX_SWINE = 100;

const InputScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch();
  const type = useSelector((state: RootState) => state.feed.type);
  const [numSwine, setNumSwineState] = useState('');
  const [selectedIngredients, setSelectedIngredientsState] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const ingredients = [
    'Coconut Residue',
    'Water Spinach',
    'Sweet Potato Leaves',
    'Cassava Leaves',
    'Banana Pseudostem',
    'Duckweed Fern',
    'Lead Tree Leaves',
    'Taro Leaves',
    'Madre De Agua Leaves',
    'Water Hyacinth Leaves',
    'Rice Bran'
  ];

  const toggleIngredient = (ingredient: string) => {
    if (selectedIngredients.includes(ingredient)) {
      setSelectedIngredientsState((prev) => prev.filter((i) => i !== ingredient));
      setErrorMessage(null);
    } else {
      if (selectedIngredients.length >= MAX_INGREDIENTS) {
        setErrorMessage(`You can select a maximum of ${MAX_INGREDIENTS} ingredients.`);
        return;
      }
      setSelectedIngredientsState((prev) => [...prev, ingredient]);
      setErrorMessage(null);
    }
  };

  const handleSubmit = () => {
    if (selectedIngredients.length < 2) {
      setErrorMessage('Please select at least 2 ingredients.');
      return;
    }

    const numSwineInt = parseInt(numSwine, 10);
    if (!numSwine || isNaN(numSwineInt) || numSwineInt <= 0 || numSwineInt > MAX_SWINE) {
      setErrorMessage(`Please enter a valid number of swine between 1 and ${MAX_SWINE}.`);
      return;
    }

    setErrorMessage(null);
    dispatch(setNumSwine(numSwineInt));
    dispatch(setSelectedIngredients(selectedIngredients));
    navigation.navigate('Result', { type, numSwine: numSwineInt, selectedIngredients });
  };

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <Text style={styles.header}>Feed Formulation</Text>
        <Card style={styles.card}>
          <Card.Title title={`Feeds for ${type}`} />
          <Card.Content>
            <TextInput
              label="Number of Swine"
              value={numSwine}
              onChangeText={setNumSwineState}
              keyboardType="numeric"
              mode="outlined"
              placeholderTextColor="#9E9E9E"
              autoComplete="off"
              error={!!errorMessage && (isNaN(parseInt(numSwine, 10)) || parseInt(numSwine, 10) <= 0 || parseInt(numSwine, 10) > MAX_SWINE)}
              style={styles.input}
              theme={{
                colors: {
                  primary: 'green', // Input focus/hover color
                  placeholder: '#9E9E9E', // Slightly light placeholder
                }
              }}
            />
            <HelperText
              type="error"
              visible={!!errorMessage && (isNaN(parseInt(numSwine, 10)) || parseInt(numSwine, 10) <= 0 || parseInt(numSwine, 10) > MAX_SWINE)}
              onPressIn={() => {}}
              onPressOut={() => {}}
            >
              {errorMessage}
            </HelperText>
          </Card.Content>
        </Card>
        <Text style={styles.subHeader}>Select Ingredients ({selectedIngredients.length}/{MAX_INGREDIENTS})</Text>
        {ingredients.map((ingredient) => (
          <TouchableWithoutFeedback key={ingredient} onPress={() => toggleIngredient(ingredient)}>
            <View>
              <Card style={styles.ingredientCard}>
                <View style={styles.checkboxContainer}>
                  <Checkbox
                    status={selectedIngredients.includes(ingredient) ? 'checked' : 'unchecked'}
                    color="green"
                  />
                  <Text>{ingredient}</Text>
                </View>
              </Card>
            </View>
          </TouchableWithoutFeedback>
        ))}
        {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
        <Button mode="contained" onPress={handleSubmit} style={styles.button} color="green">
          Formulate
        </Button>
      </View>
    </ScrollView>
  );
};

export default InputScreen;
