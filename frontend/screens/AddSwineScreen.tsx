import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useSwineContext } from "../context/SwineContext";
import { AddSwineScreenNavigationProp } from "../types/navigation";
import axiosInstance from "../api/axiosInstance";

type Props = {
  navigation: AddSwineScreenNavigationProp;
};

const AddSwineScreen: React.FC<Props> = ({ navigation }) => {
  const [id, setId] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [loading, setLoading] = useState(false); // Prevent double-clicks
  const { addSwine } = useSwineContext();

  const [errors, setErrors] = useState({
    id: "",
    weight: "",
    age: "",
  });

  const validateInputs = () => {
    let isValid = true;
    const newErrors = { id: "", weight: "", age: "" };

    if (!id.trim()) {
      newErrors.id = "Swine name is required.";
      isValid = false;
    }
    const parsedWeight = parseFloat(weight);
    if (!weight.trim() || isNaN(parsedWeight) || parsedWeight <= 0) {
      newErrors.weight = "Weight must be a positive number.";
      isValid = false;
    }
    const parsedAge = parseInt(age);
    if (!age.trim() || isNaN(parsedAge) || parsedAge < 14 || parsedAge > 1000) {
      newErrors.age = "Age must be between 14 and 1000 days.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (loading) return; // Ignore clicks while processing

    if (!validateInputs()) {
      setLoading(false);
      return;
    }

    setLoading(true); // Disable button
    const normalizedId = id.trim().toLowerCase();
    const parsedWeight = parseFloat(weight);
    const parsedAge = parseInt(age);

    const newSwine = {
      id: normalizedId,
      weight: parsedWeight,
      age: parsedAge,
      date: new Date().toISOString(),
      weights: [],
    };

    axiosInstance
      .post("/swine", newSwine)
      .then((response) => {
        addSwine(response.data);
        navigation.navigate("Home");
      })
      .catch((error) => {
        console.error("Error adding swine:", error);
        setErrors((prevErrors) => ({
          ...prevErrors,
          id: "Failed to add swine. Please try again.",
        }));
      })
      .finally(() => {
        setLoading(false); // Re-enable button after API call
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Swine name</Text>
      <TextInput
        value={id}
        onChangeText={(value) => {
          setId(value);
          setErrors((prev) => ({ ...prev, id: "" }));
        }}
        style={[styles.input, errors.id ? styles.inputError : null]}
        placeholder="Enter swine name"
      />
      {errors.id ? <Text style={styles.errorText}>{errors.id}</Text> : null}

      <Text style={styles.label}>Age (days)</Text>
      <TextInput
        value={age}
        onChangeText={(value) => {
          setAge(value);
          setErrors((prev) => ({ ...prev, age: "" }));
        }}
        style={[styles.input, errors.age ? styles.inputError : null]}
        placeholder="Enter age in days"
        keyboardType="numeric"
      />
      {errors.age ? <Text style={styles.errorText}>{errors.age}</Text> : null}

      <Text style={styles.label}>Weight (kg)</Text>
      <TextInput
        value={weight}
        onChangeText={(value) => {
          setWeight(value);
          setErrors((prev) => ({ ...prev, weight: "" }));
        }}
        style={[styles.input, errors.weight ? styles.inputError : null]}
        placeholder="Enter weight"
        keyboardType="numeric"
      />
      {errors.weight ? (
        <Text style={styles.errorText}>{errors.weight}</Text>
      ) : null}

      <TouchableOpacity
        style={[
          styles.submitButton,
          loading && { backgroundColor: "#28a745" }, // Indicate disabled state
        ]}
        onPress={handleSubmit}
        disabled={loading} // Disable button when loading
      >
        <Text style={styles.submitButtonText}>
          {loading ? "Submitting..." : "Submit"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f2f6f9",
  },
  label: {
    fontSize: 15,
    marginBottom: 5,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#EEEFEF",
    padding: 14,
    fontSize: 14,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  inputError: {
    borderColor: "#FF0000", // Red border for error
    borderWidth: 2,
  },
  errorText: {
    color: "#FF0000",
    fontSize: 13,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AddSwineScreen;
