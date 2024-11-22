// frontend/screens/EditAccountScreen.tsx

import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Text,
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

  const handleSave = async () => {
    try {
      await updateUser({
        lastName,
        firstName,
        middleInitial,
        email,
        userId: "",
      });
      Alert.alert("Success", "Profile updated successfully!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to update profile.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          label="Last Name"
          outlineColor="#cccccc"
          activeOutlineColor="#26B346"
          value={lastName}
          onChangeText={setLastName}
          mode="outlined"
          style={styles.input}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          label="First Name"
          outlineColor="#cccccc"
          activeOutlineColor="#26B346"
          value={firstName}
          onChangeText={setFirstName}
          mode="outlined"
          style={styles.input}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          label="Middle Initial"
          outlineColor="#cccccc"
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
          outlineColor="#cccccc"
          activeOutlineColor="#26B346"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          mode="outlined"
          style={styles.input}
        />
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
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#515252",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    position: "relative",
    marginBottom: 15,
  },
  input: {
    fontSize: 14,
    backgroundColor: "#f2f6f9",
    borderRadius: 200,
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
