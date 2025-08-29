import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import { TextInput } from "react-native-paper";
import { StackNavigationProp } from "@react-navigation/stack";
import { useAuth } from "../context/AuthContext";
import { RootStackParamList } from "../types";

type EditAccountScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "EditAccount"
>;

interface Props {
  navigation: EditAccountScreenNavigationProp;
}

const EditAccountScreen: React.FC<Props> = ({ navigation }) => {
  const { user, updateUser, loading } = useAuth();
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleInitial, setMiddleInitial] = useState("");
  const [email, setEmail] = useState("");

  const [errors, setErrors] = useState({
    lastName: "",
    firstName: "",
    email: "",
  });

  if (loading || !user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#28a745" />
      </View>
    );
  }

  useEffect(() => {
    if (user) {
      setLastName(user.lastName);
      setFirstName(user.firstName);
      setMiddleInitial(user.middleInitial);
      setEmail(user.email);
    }
  }, [user]);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateInputs = () => {
    let isValid = true;
    const newErrors = { lastName: "", firstName: "", email: "" };

    if (!lastName.trim()) {
      newErrors.lastName = "Last Name is required.";
      isValid = false;
    }
    if (!firstName.trim()) {
      newErrors.firstName = "First Name is required.";
      isValid = false;
    }
    if (!email.trim()) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!isValidEmail(email)) {
      newErrors.email = "Invalid email format.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateInputs()) return;

    try {
      await updateUser({
        lastName: lastName.trim(),
        firstName: firstName.trim(),
        middleInitial: middleInitial.trim(),
        email: email.trim(),
        userId: user.userId,
      });
      Alert.alert("Success", "Profile updated successfully!");
      navigation.goBack();
    } catch (error) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Failed to update profile. Please try again.",
      }));
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          label="Last Name"
          outlineColor={errors.lastName ? "#FF0000" : "#EEEFEF"}
          activeOutlineColor={errors.lastName ? "#FF0000" : "#26B346"}
          value={lastName}
          onChangeText={(value) => {
            setLastName(value);
            setErrors((prev) => ({ ...prev, lastName: "" }));
          }}
          mode="outlined"
          style={styles.input}
        />
        {errors.lastName ? (
          <Text style={styles.errorText}>{errors.lastName}</Text>
        ) : null}
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          label="First Name"
          outlineColor={errors.firstName ? "#FF0000" : "#EEEFEF"}
          activeOutlineColor={errors.firstName ? "#FF0000" : "#26B346"}
          value={firstName}
          onChangeText={(value) => {
            setFirstName(value);
            setErrors((prev) => ({ ...prev, firstName: "" }));
          }}
          mode="outlined"
          style={styles.input}
        />
        {errors.firstName ? (
          <Text style={styles.errorText}>{errors.firstName}</Text>
        ) : null}
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          label="Middle Initial"
          outlineColor="#EEEFEF"
          activeOutlineColor="#26B346"
          value={middleInitial}
          onChangeText={setMiddleInitial}
          mode="outlined"
          style={styles.input}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          label="Email"
          outlineColor={errors.email ? "#FF0000" : "#EEEFEF"}
          activeOutlineColor={errors.email ? "#FF0000" : "#26B346"}
          value={email}
          onChangeText={(value) => {
            setEmail(value);
            setErrors((prev) => ({ ...prev, email: "" }));
          }}
          keyboardType="email-address"
          mode="outlined"
          style={styles.input}
        />
        {errors.email ? (
          <Text style={styles.errorText}>{errors.email}</Text>
        ) : null}
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    position: "relative",
    marginBottom: 15,
  },
  input: {
    fontSize: 14,
    backgroundColor: "#FFF",
  },
  errorText: {
    color: "#FF0000",
    fontSize: 12,
    marginTop: 5,
  },
  saveButton: {
    backgroundColor: "#28a745",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default EditAccountScreen;
