// SaveFormulationScreen.tsx

import React, { useContext, useState } from "react";
import { View, Text, TextInput, Button, Alert, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
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
  const [expirationDate, setExpirationDate] = useState<Date | null>(new Date()); // Store as Date object
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { user } = useContext(AuthContext) ?? {};
  const userId = user?.userId;

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert(
          "Error",
          "Authorization token is missing. Please log in again."
        );
        return;
      }

      const ingredients = selectedIngredients.map((ingredient: any) => ({
        name: ingredient.ingredient,
        amount: ingredient.amount,
      }));

      // Ensure expirationDate is a valid date string before sending it
      if (!expirationDate) {
        Alert.alert("Error", "Please select a valid expiration date.");
        return;
      }

      const response = await axiosInstance.post(
        "/formulations/save",
        {
          type,
          numSwine,
          ingredients,
          totalNutrients,
          name,
          description,
          userId,
          expirationDate: expirationDate.toISOString(), // Convert to ISO string format
        },
        {
          headers: { Authorization: `Bearer ${token}` },
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

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setExpirationDate(selectedDate); // Store the selected date
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

      <Text>Expiration Date</Text>
      <Button
        title="Select Expiration Date"
        onPress={() => setShowDatePicker(true)}
      />

      {/* Display selected expiration date */}
      <Text>
        Selected Date:{" "}
        {expirationDate ? expirationDate.toLocaleDateString() : "None"}
      </Text>

      {showDatePicker && (
        <DateTimePicker
          value={expirationDate || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "calendar"}
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}

      <Button title="Save Formulation" onPress={handleSave} />
    </View>
  );
};

export default SaveFormulationScreen;
