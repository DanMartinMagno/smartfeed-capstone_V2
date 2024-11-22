// frontend/screens/ChangePasswordScreen.tsx

import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  Text,
} from "react-native";
import { TextInput } from "react-native-paper";
import { StackNavigationProp } from "@react-navigation/stack";
import { changePassword } from "../api/authApi";
import { RootStackParamList } from "../types";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type ChangePasswordScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ChangePassword"
>;

interface Props {
  navigation: ChangePasswordScreenNavigationProp;
}

const ChangePasswordScreen: React.FC<Props> = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      Alert.alert("Error", "New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert("Error", "New password must be at least 6 characters long.");
      return;
    }

    try {
      await changePassword(currentPassword, newPassword);
      Alert.alert("Success", "Password changed successfully!");
      navigation.goBack();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to change password.";
      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Reset your Password</Text>
      <View style={styles.inputContainer}>
        <TextInput
          label="Current Password"
          outlineColor="#cccccc"
          activeOutlineColor="#26B346"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry={!showCurrentPassword}
          mode="outlined"
          style={styles.input}
          right={
            <TextInput.Icon
              icon={() => (
                <MaterialCommunityIcons
                  name={showCurrentPassword ? "eye" : "eye-off"}
                  size={20}
                  color="grey"
                />
              )}
              onPress={() => setShowCurrentPassword(!showCurrentPassword)}
            />
          }
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          label="New Password"
          outlineColor="#cccccc"
          activeOutlineColor="#26B346"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry={!showNewPassword}
          mode="outlined"
          style={styles.input}
          right={
            <TextInput.Icon
              icon={() => (
                <MaterialCommunityIcons
                  name={showNewPassword ? "eye" : "eye-off"}
                  size={20}
                  color="grey"
                />
              )}
              onPress={() => setShowNewPassword(!showNewPassword)}
            />
          }
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          label="Confirm New Password"
          outlineColor="#cccccc"
          activeOutlineColor="#26B346"
          value={confirmNewPassword}
          onChangeText={setConfirmNewPassword}
          secureTextEntry={!showConfirmNewPassword}
          mode="outlined"
          style={styles.input}
          right={
            <TextInput.Icon
              icon={() => (
                <MaterialCommunityIcons
                  name={showConfirmNewPassword ? "eye" : "eye-off"}
                  size={20}
                  color="grey"
                />
              )}
              onPress={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
            />
          }
        />
      </View>
      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleChangePassword}
      >
        <Text style={styles.saveButtonText}>Change Password</Text>
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
    fontSize: 21,
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
    borderRadius: 200, // Set the desired border radius here
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

export default ChangePasswordScreen;
