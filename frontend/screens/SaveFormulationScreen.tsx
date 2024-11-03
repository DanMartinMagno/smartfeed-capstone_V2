// SaveFormulationScreen.tsx
import React, { useContext, useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import axiosInstance from "../api/axiosInstance";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../types";
import { AuthContext } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

type SaveFormulationScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SaveFormulation"
>;
type SaveFormulationScreenRouteProp = RouteProp<
  RootStackParamList,
  "SaveFormulation"
>;

interface Ingredient {
  name: string;
  amount: number;
}

interface Props {
  navigation: SaveFormulationScreenNavigationProp;
  route: SaveFormulationScreenRouteProp;
}

const SaveFormulationScreen: React.FC<Props> = ({ route, navigation }) => {
  const { type, numSwine, selectedIngredients, totalNutrients } = route.params;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { user } = useContext(AuthContext) ?? {};
  const userId = user?.userId;

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      // Map selectedIngredients to the ingredients structure expected by the backend
      const ingredients: Ingredient[] = selectedIngredients.map(
        (ingredient: any) => {
          if (typeof ingredient === "string") {
            return { name: ingredient, amount: 0 }; // default amount if not provided
          }
          return ingredient;
        }
      );

      const response = await axiosInstance.post(
        "/formulations/save",
        {
          type,
          numSwine,
          ingredients, // Changed from selectedIngredients to ingredients
          totalNutrients: {
            crudeProtein: totalNutrients.crudeProtein,
            crudeFiber: totalNutrients.crudeFiber,
            crudeFat: totalNutrients.crudeFat,
            calcium: totalNutrients.calcium,
            moisture: totalNutrients.moisture,
            phosphorus: totalNutrients.phosphorus,
          },
          name,
          description,
          userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        Alert.alert("Success", "Formulation saved successfully!");
        navigation.navigate("Dashboard");
      }
    } catch (error) {
      console.error("Error saving formulation:", error);
      Alert.alert("Error", "Failed to save formulation. Please try again.");
    }
  };

  return (
    <View>
      <Text>Feed Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Enter feed name"
      />

      <Text>Description</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Enter description"
        multiline
      />

      <Button title="Save Formulation" onPress={handleSave} />
    </View>
  );
};

export default SaveFormulationScreen;
