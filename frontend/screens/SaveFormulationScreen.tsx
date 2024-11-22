// frontend/screens/SaveFormulationScreen.tsx

import React, { useContext, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from "react-native";
import { TextInput, Divider } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import axiosInstance from "../api/axiosInstance";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../types";
import { AuthContext } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";

type SaveFormulationScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SaveFormulation"
>;
type SaveFormulationScreenRouteProp = RouteProp<
  RootStackParamList,
  "SaveFormulation"
>;

interface Props {
  navigation: SaveFormulationScreenNavigationProp;
  route: SaveFormulationScreenRouteProp;
}

const SaveFormulationScreen: React.FC<Props> = ({ route, navigation }) => {
  const { type, numSwine, selectedIngredients, totalNutrients } = route.params;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [expirationDate, setExpirationDate] = useState<Date | null>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [nameError, setNameError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [expirationDateError, setExpirationDateError] = useState("");

  const { user } = useContext(AuthContext) ?? {};
  const userId = user?.userId;

  const handleSave = async () => {
    let isValid = true;

    // Validation
    if (!name.trim()) {
      setNameError("Please enter a feed name.");
      isValid = false;
    } else {
      setNameError("");
    }

    if (!description.trim()) {
      setDescriptionError("Please enter a description.");
      isValid = false;
    } else {
      setDescriptionError("");
    }

    if (!expirationDate) {
      setExpirationDateError("Please select an expiration date.");
      isValid = false;
    } else {
      setExpirationDateError("");
    }

    if (!isValid) return;

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        setNameError("Authorization token is missing. Please log in again.");
        return;
      }

      const ingredients = selectedIngredients.map((ingredient: any) => ({
        name: ingredient.ingredient,
        amount: ingredient.amount,
      }));

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
          expirationDate:
            expirationDate?.toISOString() || new Date().toISOString(), // Handle possible null
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        navigation.navigate("Dashboard");
      }
    } catch (error) {
      console.error("Error saving formulation:", error);
      setNameError("Failed to save formulation. Please try again.");
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setExpirationDate(selectedDate);
      setExpirationDateError("");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Save New Formulation</Text>

      <TextInput
        label="Feed Name"
        value={name}
        onChangeText={(text) => {
          setName(text);
          setNameError("");
        }}
        placeholder="Enter feed name"
        mode="outlined"
        outlineColor="#EDEFEF"
        activeOutlineColor="#26B346"
        style={[styles.input, styles.textInput]}
        placeholderTextColor="#888888"
        theme={{
          colors: {
            primary: "#26B346",
            text: "#838383",
            placeholder: "#888888",
          },
        }}
      />
      {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

      <TextInput
        label="Description"
        value={description}
        onChangeText={(text) => {
          setDescription(text);
          setDescriptionError("");
        }}
        placeholder="Enter description"
        mode="outlined"
        outlineColor="#EDEFEF"
        activeOutlineColor="#26B346"
        style={[styles.input, styles.textInput]}
        placeholderTextColor="#888888"
        multiline
        theme={{
          colors: { primary: "#26B346", text: "#333", placeholder: "#888888" },
        }}
      />
      {descriptionError ? (
        <Text style={styles.errorText}>{descriptionError}</Text>
      ) : null}

      <Divider style={styles.divider} />

      <TouchableOpacity
        style={styles.datePickerContainer}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.datePickerLabel}>Expiration Date</Text>
        <Text style={styles.datePickerText}>
          {expirationDate ? expirationDate.toLocaleDateString() : "Select Date"}
        </Text>
        <Icon name="calendar-outline" size={20} color="#26B346" />
      </TouchableOpacity>
      {expirationDateError ? (
        <Text style={styles.errorText}>{expirationDateError}</Text>
      ) : null}

      {showDatePicker && (
        <DateTimePicker
          value={expirationDate || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "calendar"}
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Formulation</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: "#f2f6f9",
    flexGrow: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#515252",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderRadius: 15,
    marginBottom: 5,
    backgroundColor: "#fff",
  },
  textInput: {
    fontSize: 15,
    borderRadius: 15,
    backgroundColor: "#fff",
  },
  errorText: {
    fontSize: 14,
    color: "red",
    marginBottom: 10,
  },
  divider: {
    marginVertical: 15,
  },
  datePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: "#EDEFEF",
    borderWidth: 1,
    borderRadius: 6,
    padding: 13,
    backgroundColor: "#fff",
    marginBottom: 5,
  },
  datePickerLabel: {
    fontSize: 15,
    color: "#666",
  },
  datePickerText: {
    fontSize: 15,
    color: "#333",
  },
  saveButton: {
    backgroundColor: "#28a745",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default SaveFormulationScreen;
