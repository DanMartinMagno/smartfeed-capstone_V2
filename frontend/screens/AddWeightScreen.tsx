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
import {
  AddWeightScreenNavigationProp,
  AddWeightScreenRouteProp,
} from "../types/navigation";
import { useSwineContext } from "../context/SwineContext";

type Props = {
  navigation: AddWeightScreenNavigationProp;
  route: AddWeightScreenRouteProp;
};

const AddWeightScreen: React.FC<Props> = ({ navigation, route }) => {
  const { swineId } = route.params;
  const { addWeight, swines, fetchSwines } = useSwineContext(); // Fetch updated swine data
  const [weight, setWeight] = useState<string>("");
  const [date, setDate] = useState<string>(
    new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  );
  const [weightError, setWeightError] = useState<string>("");

  const validateWeight = (text: string) => {
    const weightValue = parseFloat(text);
    if (!text) {
      setWeightError("Weight is required.");
    } else if (isNaN(weightValue) || weightValue < 1 || weightValue > 1000) {
      setWeightError("Weight must be between 1 kg and 1000 kg.");
    } else {
      setWeightError("");
    }
  };

  const handleSubmit = async () => {
    const weightValue = parseFloat(weight);

    // Fetch the latest weight for comparison
    const swine = swines.find((sw) => sw.id === swineId);
    if (swine && swine.weights.length > 0) {
      const latestWeight = swine.weights[swine.weights.length - 1].weight;

      // Check if the new weight is strictly greater than the latest weight
     // if (weightValue <= latestWeight) {
      //  Alert.alert(
      //    "Validation Error",
       //   `New weight must be strictly greater than ${latestWeight} kg.`
       // );
     //   return;
    //  }
    }

    // Submit the new weight
    try {
      const response = await axios.post(
        `http://192.168.42.9:5000/api/swine/${swineId}/weights`,
        {
          date,
          weight: weightValue,
        }
      );

      // Add weight to context
      addWeight(
        swineId,
        response.data.weights[response.data.weights.length - 1]
      );

      // Refetch updated swine data to ensure state is up to date
      await fetchSwines();

      navigation.navigate("Swine Detail", { swineId });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // Axios-specific error handling
        if (error.response && error.response.data) {
          Alert.alert("Error", error.response.data.message);
        }
      } else if (error instanceof Error) {
        // Generic error handling
        Alert.alert("Error", error.message);
      } else {
        console.error("Unknown error", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Date</Text>
      <TextInput
        value={date}
        onChangeText={setDate}
        style={styles.input}
        placeholder="Enter Date"
        placeholderTextColor="#888"
      />

      <Text style={styles.label}>Weight (kg)</Text>
      <TextInput
        value={weight}
        onChangeText={(text) => {
          setWeight(text);
          validateWeight(text);
        }}
        keyboardType="numeric"
        style={[styles.input, weightError ? styles.inputError : null]}
        placeholder="Enter Weight"
        placeholderTextColor="#888"
      />
      {weightError ? <Text style={styles.errorText}>{weightError}</Text> : null}

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

    marginLeft: 5,
  },
  input: {
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DDD",
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputError: {
    borderColor: "#E74C3C",
    borderWidth: 2,
  },
  errorText: {
    color: "#E74C3C",
    fontSize: 14,
    marginBottom: 10,
    marginLeft: 5,
  },
  submitButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default AddWeightScreen;
