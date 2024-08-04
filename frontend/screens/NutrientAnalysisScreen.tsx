import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, Button } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { calculateFeed } from '../api';
import NutrientCard from '../styles/NutrientCard';
import NutrientGraph from '../components/NutrientGraph';


type NutrientAnalysisScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Nutrient Analysis'>;
type NutrientAnalysisScreenRouteProp = RouteProp<RootStackParamList, 'Nutrient Analysis'>;

type Props = {
  navigation: NutrientAnalysisScreenNavigationProp;
  route: NutrientAnalysisScreenRouteProp;
};

interface AnalysisResults {
  ingredientAmounts: { ingredient: string; amount: number }[];
  totalNutrients: {
    crudeProtein: number;
    crudeFiber: number;
    crudeFat: number;
    calcium: number;
    moisture: number;
    phosphorus: number;
  };
  recommendations: {
    crudeProtein: number;
    crudeFiber: number;
    crudeFat: number;
    calcium: number;
    phosphorus: number;
  };
  analysis: {
    crudeProtein: string;
    crudeFiber: string;
    crudeFat: string;
    calcium: string;
    phosphorus: string;
  };
}

const NutrientAnalysisScreen: React.FC<Props> = ({ route, navigation }) => {
  const { type, numSwine, selectedIngredients } = route.params;
  const [result, setResult] = useState<AnalysisResults | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await calculateFeed({ selectedIngredients, numSwine, type: type as 'starter' | 'grower' | 'finisher' });
        const responseData = response.data as AnalysisResults;
        setResult(responseData);
      } catch (error) {
        console.error('Error fetching nutrient analysis:', error);
        Alert.alert('Error', 'An error occurred while fetching the nutrient analysis. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedIngredients, numSwine, type]);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (!result) {
    return <Text>Error loading results.</Text>;
  }

  const nutrientData = [
    { name: 'Crude Protein', value: result.totalNutrients.crudeProtein },
    { name: 'Crude Fiber', value: result.totalNutrients.crudeFiber },
    { name: 'Crude Fat', value: result.totalNutrients.crudeFat },
    { name: 'Calcium', value: result.totalNutrients.calcium },
    { name: 'Moisture', value: result.totalNutrients.moisture },
    { name: 'Phosphorus', value: result.totalNutrients.phosphorus },
  ];

  const handleSaveRecipe = () => {
    // Logic to save the new feed recipe
    Alert.alert('Recipe Saved', 'Your new feed recipe has been saved successfully.');
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.header}>Nutrient Analysis for {type} Feed</Text>
        <NutrientCard
          title="Crude Protein"
          value={result.totalNutrients.crudeProtein}
          unit="%"
          isDeficient={result.analysis.crudeProtein === 'Deficient'}
          recommendation={result.recommendations.crudeProtein}
        />
        <NutrientCard
          title="Crude Fiber"
          value={result.totalNutrients.crudeFiber}
          unit="%"
          isDeficient={result.analysis.crudeFiber === 'Deficient'}
          recommendation={result.recommendations.crudeFiber}
        />
        <NutrientCard
          title="Crude Fat"
          value={result.totalNutrients.crudeFat}
          unit="%"
          isDeficient={result.analysis.crudeFat === 'Deficient'}
          recommendation={result.recommendations.crudeFat}
        />
        <NutrientCard
          title="Calcium"
          value={result.totalNutrients.calcium}
          unit="%"
          isDeficient={result.analysis.calcium === 'Deficient'}
          recommendation={result.recommendations.calcium}
        />
        <NutrientCard
          title="Moisture"
          value={result.totalNutrients.moisture}
          unit="%"
        />
        <NutrientCard
          title="Phosphorus"
          value={result.totalNutrients.phosphorus}
          unit="%"
          isDeficient={result.analysis.phosphorus === 'Deficient'}
          recommendation={result.recommendations.phosphorus}
        />
        <Text style={styles.header}>Analysis</Text>
        <NutrientCard title="Crude Protein" value={result.analysis.crudeProtein} />
        <NutrientCard title="Crude Fiber" value={result.analysis.crudeFiber} />
        <NutrientCard title="Crude Fat" value={result.analysis.crudeFat} />
        <NutrientCard title="Calcium" value={result.analysis.calcium} />
        <NutrientCard title="Phosphorus" value={result.analysis.phosphorus} />
        <NutrientGraph data={nutrientData} recommendations={result.recommendations} />
        <View style={styles.buttonContainer}>
          <Button title="Save Recipe" onPress={handleSaveRecipe} />
          <Button title="Make Adjustments" onPress={() => navigation.goBack()} />
          <Button title="Home" onPress={() => navigation.navigate('Home')} />
        </View>
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
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default NutrientAnalysisScreen;
