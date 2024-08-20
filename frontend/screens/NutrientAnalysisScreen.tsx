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
    moisture: number;
    phosphorus: number;
  };
  analysis: {
    crudeProtein: string;
    crudeFiber: string;
    crudeFat: string;
    calcium: string;
    moisture: string;
    phosphorus: string;
  };
}
// the rest of your codes.

const NutrientAnalysisScreen: React.FC<Props> = ({ route, navigation }) => {
  const { type, numSwine, selectedIngredients } = route.params;
  const [result, setResult] = useState<AnalysisResults | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  // Nutrient to Ingredient Mapping (based on available ingredients)
  const nutrientIngredientMap: { [key: string]: string[] } = {
    crudeProtein: ['Water Spinach', 'Sweet Potato Leaves', 'Lead Tree Leaves'],
    crudeFiber: ['Coconut Residue', 'Cassava Leaves', 'Rice Bran'],
    crudeFat: ['Coconut Residue', 'Duckweed Fern'],
    calcium: ['Taro Leaves', 'Madre De Agua Leaves'],
    moisture: ['Banana Pseudostem', 'Water Hyacinth Leaves'],
    phosphorus: ['Sweet Potato Leaves', 'Duckweed Fern'],
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await calculateFeed({ selectedIngredients, numSwine, type: type as 'starter' | 'grower' | 'finisher' });
        const responseData = response.data as AnalysisResults;
        setResult(responseData);
  
        // Generate recommendations based on deficiencies
        const recs: string[] = [];
  
        const getAvailableIngredients = (nutrientKey: keyof typeof nutrientIngredientMap) => {
          return nutrientIngredientMap[nutrientKey].filter(ingredient => !selectedIngredients.includes(ingredient));
        };
  
        if (responseData.analysis.crudeProtein === 'Deficient') {
          const deficiency = (responseData.recommendations.crudeProtein - responseData.totalNutrients.crudeProtein).toFixed(2);
          const availableIngredients = getAvailableIngredients('crudeProtein');
          if (availableIngredients.length > 0) {
            recs.push(`Increase crude protein by ${deficiency}%. Consider adding more ${availableIngredients.join(' or ')}.`);
          } else {
            recs.push(`Increase crude protein by ${deficiency}%. All possible ingredients are already selected.`);
          }
        }
        if (responseData.analysis.crudeFiber === 'Deficient') {
          const deficiency = (responseData.recommendations.crudeFiber - responseData.totalNutrients.crudeFiber).toFixed(2);
          const availableIngredients = getAvailableIngredients('crudeFiber');
          if (availableIngredients.length > 0) {
            recs.push(`Increase crude fiber by ${deficiency}%. Consider adding more ${availableIngredients.join(' or ')}.`);
          } else {
            recs.push(`Increase crude fiber by ${deficiency}%. All possible ingredients are already selected.`);
          }
        }
        if (responseData.analysis.crudeFat === 'Deficient') {
          const deficiency = (responseData.recommendations.crudeFat - responseData.totalNutrients.crudeFat).toFixed(2);
          const availableIngredients = getAvailableIngredients('crudeFat');
          if (availableIngredients.length > 0) {
            recs.push(`Increase crude fat by ${deficiency}%. Consider adding more ${availableIngredients.join(' or ')}.`);
          } else {
            recs.push(`Increase crude fat by ${deficiency}%. All possible ingredients are already selected.`);
          }
        }
        if (responseData.analysis.calcium === 'Deficient') {
          const deficiency = (responseData.recommendations.calcium - responseData.totalNutrients.calcium).toFixed(2);
          const availableIngredients = getAvailableIngredients('calcium');
          if (availableIngredients.length > 0) {
            recs.push(`Increase calcium by ${deficiency}%. Consider adding more ${availableIngredients.join(' or ')}.`);
          } else {
            recs.push(`Increase calcium by ${deficiency}%. All possible ingredients are already selected.`);
          }
        }
        if (responseData.analysis.moisture === 'Deficient') {
          const deficiency = (responseData.recommendations.moisture - responseData.totalNutrients.moisture).toFixed(2);
          const availableIngredients = getAvailableIngredients('moisture');
          if (availableIngredients.length > 0) {
            recs.push(`Increase moisture by ${deficiency}%. Consider adding more ${availableIngredients.join(' or ')}.`);
          } else {
            recs.push(`Increase moisture by ${deficiency}%. All possible ingredients are already selected.`);
          }
        }
        if (responseData.analysis.phosphorus === 'Deficient') {
          const deficiency = (responseData.recommendations.phosphorus - responseData.totalNutrients.phosphorus).toFixed(2);
          const availableIngredients = getAvailableIngredients('phosphorus');
          if (availableIngredients.length > 0) {
            recs.push(`Increase phosphorus by ${deficiency}%. Consider adding more ${availableIngredients.join(' or ')}.`);
          } else {
            recs.push(`Phosphorus is still deficient by ${deficiency}%. Try increasing the proportion of ${nutrientIngredientMap.phosphorus.join(' or ')} in your formulation.`);
          }
        }        
  
        setRecommendations(recs);
  
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
          isDeficient={result.analysis.moisture === 'Deficient'}
          recommendation={result.recommendations.moisture}
        />
        <NutrientCard
          title="Phosphorus"
          value={result.totalNutrients.phosphorus}
          unit="%"
          isDeficient={result.analysis.phosphorus === 'Deficient'}
          recommendation={result.recommendations.phosphorus}
        />

        <NutrientGraph data={nutrientData} recommendations={result.recommendations} />

        {recommendations.length > 0 && (
          <View style={styles.recommendationContainer}>
            <Text style={styles.recommendationHeader}>Recommendations:</Text>
            {recommendations.map((rec, index) => (
              <Text key={index} style={styles.recommendationText}>{rec}</Text>
            ))}
          </View>
        )}

        <View style={styles.buttonContainer}>
          <Button title="Save Recipe" onPress={handleSaveRecipe} />
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
  recommendationContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#eef',
    borderRadius: 10,
  },
  recommendationHeader: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  recommendationText: {
    fontSize: 14,
    marginVertical: 2,
  },
});

export default NutrientAnalysisScreen;
