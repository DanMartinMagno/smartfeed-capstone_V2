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
  const [age, setAge] = useState("");
  const { addSwine } = useSwineContext();

  const handleSubmit = () => {
    const normalizedId = id.trim().toLowerCase();

    if (!id || !weight || !age) {
      Alert.alert("Validation Error", "All fields are required.");
      return;
    }

    const newSwine = {
      id: normalizedId,
      weight: parseFloat(weight),
      age: parseInt(age),
      date: new Date().toISOString(),
      weights: [], // Start with an empty array for weights
    };

    axios
      .post("http://192.168.42.9:5000/api/swine", newSwine)
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
      <Text style={styles.label}>Weight (kg)</Text>
      <TextInput
        value={weight}
        onChangeText={setWeight}
        style={styles.input}
        placeholder="Enter Weight"
        keyboardType="numeric"
      />
      <Text style={styles.label}>Age (months)</Text>
      <TextInput
        value={age}
        onChangeText={setAge}
        style={styles.input}
        placeholder="Enter Age"
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
    backgroundColor: "#F5F5F5",
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
