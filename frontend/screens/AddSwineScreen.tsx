////AddSwineScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";
import { useSwineContext } from "../context/SwineContext";
import { AddSwineScreenNavigationProp } from "../types/navigation"; // Import your navigation types

type Props = {
  navigation: AddSwineScreenNavigationProp; // Explicitly define the navigation prop type
};

const AddSwineScreen: React.FC<Props> = ({ navigation }) => {
  const [id, setId] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState(""); // Age in days
  const { addSwine } = useSwineContext();

  const handleSubmit = () => {
    const normalizedId = id.trim().toLowerCase();
    const parsedWeight = parseFloat(weight);
    const parsedAge = parseInt(age);

    // Basic validation for required fields
    if (!id || !weight || !age) {
      Alert.alert("Validation Error", "All fields are required.");
      return;
    }

    // Validate weight is a positive number
    if (isNaN(parsedWeight) || parsedWeight <= 0) {
      Alert.alert("Validation Error", "Weight must be a positive number.");
      return;
    }

    // Validate age falls within the specified growth stages
    if (isNaN(parsedAge) || parsedAge < 14 || parsedAge > 1000) {
      Alert.alert("Validation Error", "Age must be between 14 and 1000 days.");
      return;
    }

    // Validate weight based on age range (growth stage)
    if (parsedAge >= 14 && parsedAge <= 28) {
      // Starter stage: 23-35 kg
      if (parsedWeight < 5 || parsedWeight > 35) {
        Alert.alert(
          "Validation Error",
          "Weight for Starter stage minimum of 5kg"
        );
        return;
      }
    } else if (parsedAge >= 29 && parsedAge <= 84) {
      // Grower stage: 35-75 kg
      if (parsedWeight < 5 || parsedWeight > 75) {
        Alert.alert(
          "Validation Error",
          "Weight for Grower stage must be between 5 kg and 75 kg."
        );
        return;
      }
    } else if (parsedAge >= 85 && parsedAge <= 1000) {
      // Finisher stage: 75-1000 kg
      if (parsedWeight < 5 || parsedWeight > 1000) {
        Alert.alert(
          "Validation Error",
          "Weight for Finisher stage must be between 5 kg and 1000 kg."
        );
        return;
      }
    }

    const newSwine = {
      id: normalizedId,
      weight: parsedWeight,
      age: parsedAge, // Age in days
      date: new Date().toISOString(),
      weights: [], // Start with an empty array for weights
    };

    axios
      .post("https://my-swine-feed-app.onrender.com/api/swine", newSwine)

      .then((response) => {
        addSwine(response.data);
        navigation.navigate("Home");
      })
      .catch((error) => {
        console.error("Error submitting data", error);
        Alert.alert("Error", "Something went wrong.");
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>ID</Text>
      <TextInput
        value={id}
        onChangeText={setId}
        style={styles.input}
        placeholder="Enter Swine ID"
      />

      <Text style={styles.label}>Age (days)</Text>
      <TextInput
        value={age}
        onChangeText={setAge}
        style={styles.input}
        placeholder="Enter Age in Days"
        keyboardType="numeric"
      />
      <Text style={styles.label}>Weight (kg)</Text>
      <TextInput
        value={weight}
        onChangeText={setWeight}
        style={styles.input}
        placeholder="Enter Weight"
        keyboardType="numeric"
      />
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
    backgroundColor: "#f2f6f9",
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DDD",
    marginBottom: 15,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 18,
  },
});

export default AddSwineScreen;
