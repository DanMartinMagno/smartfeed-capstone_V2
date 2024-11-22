//ResultScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { calculateFeed } from "../api";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../types";
import NutrientCard from "../styles/NutrientCard";

type ResultScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Result"
>;
type ResultScreenRouteProp = RouteProp<RootStackParamList, "Result">;

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

  // Fetch and set result
  // 1. Fetch and set result data
  useEffect(() => {
    setLoading(true);
    calculateFeed({ selectedIngredients, numSwine, type })
      .then((response) => {
        const responseData = response.data as FeedCalculationResult;
        setResult(responseData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching feed calculation:", error);
        Alert.alert(
          "Error",
          "An error occurred while fetching the feed calculation. Please try again."
        );
        setLoading(false);
      });
  }, [selectedIngredients, numSwine, type]);

  // 2. Handle navigation based on result updates
  // useEffect(() => {
  //   if (result) {
  //     navigation.navigate("SaveFormulation", {
  //       type,
  //       numSwine,
  //       selectedIngredients: result.ingredientAmounts,
  //       totalNutrients: result.totalNutrients,
  //     });
  //   }
  // }, [result, navigation, type, numSwine]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#18BD18" />
      </View>
    );
  }
  if (!result) {
    return <Text>Error loading results.</Text>;
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.header}>Feeds for {type}</Text>
        <Text style={styles.subHeader1}>Ratio for selected Ingredients</Text>
        {result.ingredientAmounts.map((ingredient, index) => (
          <NutrientCard
            key={index}
            title={ingredient.ingredient}
            value={`${ingredient.amount.toFixed(2)} kg`}
            isRatioCard
          />
        ))}
        <Text style={styles.subHeader2}>Total nutrients of ingredients</Text>
        <NutrientCard
          title="Crude Protein"
          value={result.totalNutrients.crudeProtein}
          unit="%"
        />
        <NutrientCard
          title="Crude Fiber"
          value={result.totalNutrients.crudeFiber}
          unit="%"
        />
        <NutrientCard
          title="Crude Fat"
          value={result.totalNutrients.crudeFat}
          unit="%"
        />
        <NutrientCard
          title="Calcium"
          value={result.totalNutrients.calcium}
          unit="%"
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
        />

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate("Nutrient Analysis", {
              type,
              numSwine,
              selectedIngredients: result.ingredientAmounts, // Pass the calculated ingredient amounts
              totalNutrients: {
                crudeProtein: result.totalNutrients.crudeProtein,
                crudeFiber: result.totalNutrients.crudeFiber,
                crudeFat: result.totalNutrients.crudeFat,
                calcium: result.totalNutrients.calcium,
                moisture: result.totalNutrients.moisture,
                phosphorus: result.totalNutrients.phosphorus,
              },
            })
          }
        >
          <Text style={styles.buttonText}>View Nutrient Analysis</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: "#f2f6f9",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#28a745",
    textAlign: "center",
    marginBottom: 20,
  },
  subHeader1: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#515252",
  },
  subHeader2: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10,
    color: "#515252",
  },
  button: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ResultScreen;
