import React, { useState, useEffect } from "react";
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
  EditWeightScreenNavigationProp,
  EditWeightScreenRouteProp,
} from "../types/navigation";
import { useSwineContext } from "../context/SwineContext";

type Props = {
  navigation: EditWeightScreenNavigationProp;
  route: EditWeightScreenRouteProp;
};

const EditWeightScreen: React.FC<Props> = ({ navigation, route }) => {
  const { swineId, weightId } = route.params;
  const { swines, editWeight, fetchSwines } = useSwineContext();
  const [weight, setWeight] = useState<string>("");
  const [weightError, setWeightError] = useState<string>("");

  useEffect(() => {
    const swine = swines.find((sw) => sw.id === swineId);
    if (swine) {
      const weightEntry = swine.weights.find((w) => w._id === weightId);
      if (weightEntry) {
        setWeight(weightEntry.weight.toString());
      }
    }
  }, [swineId, weightId, swines]);

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

    // Validate the weight value before submitting
    if (weightError || !weight) {
      Alert.alert(
        "Validation Error",
        "Please correct the errors before submitting."
      );
      return;
    }

    try {
      // Attempt to update the weight in the backend
      const response = await axios.put(
        `http://192.168.42.9:5000/api/swine/${swineId}/weights/${weightId}`,
        {
          weight: weightValue,
        }
      );

      // If successful, update the context and navigate back to Swine Detail
      editWeight(swineId, weightId, weightValue);
      navigation.navigate("Swine Detail", { swineId });
    } catch (error) {
      // Handle error and show alert
      if (axios.isAxiosError(error)) {
        // If it's an Axios error, use the error response message
        const errorMessage =
          error.response?.data?.message || "Unknown error occurred";
        Alert.alert("Failed to update weight entry", errorMessage);
      } else {
        // Fallback for unknown errors
        Alert.alert("Error", "Something went wrong while updating the weight.");
      }
    }
  };

  return (
    <View style={styles.container}>
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
    backgroundColor: "#F5F5F5",
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

export default EditWeightScreen;
