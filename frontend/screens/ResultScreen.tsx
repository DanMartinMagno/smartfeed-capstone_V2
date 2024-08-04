import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, Alert, Button } from 'react-native';
import { calculateFeed } from '../api';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import NutrientCard from '../styles/NutrientCard';

type ResultScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Result'>;
type ResultScreenRouteProp = RouteProp<RootStackParamList, 'Result'>;

type Props = {
  navigation: ResultScreenNavigationProp;
  route: ResultScreenRouteProp;
};

interface FeedCalculationResult {
  ingredientAmounts: { ingredient: string; amount: number }[];
  totalNutrients: {
    crudeProtein: number;
    crudeFiber: number;
    crudeFat: number;
    calcium: number;
    moisture: number;
    phosphorus: number;
  };
}

const ResultScreen: React.FC<Props> = ({ route, navigation }) => {
  const { type, numSwine, selectedIngredients } = route.params;
  const [result, setResult] = useState<FeedCalculationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    calculateFeed({ selectedIngredients, numSwine, type })
      .then((response) => {
        const responseData = response.data as FeedCalculationResult;
        setResult(responseData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching feed calculation:', error);
        Alert.alert('Error', 'An error occurred while fetching the feed calculation. Please try again.');
        setLoading(false);
      });
  }, [selectedIngredients, numSwine, type]);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (!result) {
    return <Text>Error loading results.</Text>;
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.header}>Feeds for {type}</Text>
        <Text style={styles.header}>Number of Swine: {numSwine}</Text>
        <Text style={styles.header}>Ratio for selected Ingredients</Text>
        {result.ingredientAmounts.map((ingredient, index) => (
          <NutrientCard key={index} title={ingredient.ingredient} value={`${ingredient.amount.toFixed(2)} kg`} />
        ))}
        <Text style={styles.header}>Total nutrients of ingredients</Text>
        <NutrientCard title="Crude Protein" value={result.totalNutrients.crudeProtein} unit="%" />
        <NutrientCard title="Crude Fiber" value={result.totalNutrients.crudeFiber} unit="%" />
        <NutrientCard title="Crude Fat" value={result.totalNutrients.crudeFat} unit="%" />
        <NutrientCard title="Calcium" value={result.totalNutrients.calcium} unit="%" />
        <NutrientCard title="Moisture" value={result.totalNutrients.moisture} unit="%" />
        <NutrientCard title="Phosphorus" value={result.totalNutrients.phosphorus} unit="%" />
        <Button title="View Nutrient Analysis" onPress={() => navigation.navigate('Nutrient Analysis', { type, numSwine, selectedIngredients })} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
});

export default ResultScreen;
