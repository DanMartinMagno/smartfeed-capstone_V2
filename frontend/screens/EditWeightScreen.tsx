import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import axiosInstance from "../api/axiosInstance"; // Use axiosInstance for authenticated requests
import {
  EditWeightScreenNavigationProp,
  EditWeightScreenRouteProp,
} from "../types/navigation";
import { useSwineContext } from "../context/SwineContext";
import axios from "axios";

type Props = {
  navigation: EditWeightScreenNavigationProp;
  route: EditWeightScreenRouteProp;
};

const EditWeightScreen: React.FC<Props> = ({ navigation, route }) => {
  const { swineId, weightId } = route.params;
  const { swines, editWeight } = useSwineContext();
  const [weight, setWeight] = useState<string>("");
  const [weightError, setWeightError] = useState<string>("");

  useEffect(() => {
    // Load the existing weight entry to prefill input field
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

    if (weightError || !weight) {
      Alert.alert(
        "Validation Error",
        "Please correct the errors before submitting."
      );
      return;
    }

    try {
      const response = await axiosInstance.put(
        `/swine/${swineId}/weights/${weightId}`,
        { weight: weightValue }
      );
      editWeight(swineId, weightId, weightValue); // Update context state
      navigation.navigate("Swine Detail", { swineId });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "Unknown error occurred";
        Alert.alert("Failed to update weight entry", errorMessage);
      } else {
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

export default EditWeightScreen;
