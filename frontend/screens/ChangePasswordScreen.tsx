import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  Alert,
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

  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const validateInputs = () => {
    let isValid = true;
    const newErrors = {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    };

    if (!currentPassword.trim()) {
      newErrors.currentPassword = "Current password is required.";
      isValid = false;
    }
    if (!newPassword.trim()) {
      newErrors.newPassword = "New password is required.";
      isValid = false;
    } else if (newPassword.length < 3) {
      newErrors.newPassword =
        "New password must be at least 3 characters long.";
      isValid = false;
    }
    if (newPassword !== confirmNewPassword) {
      newErrors.confirmNewPassword = "Passwords do not match.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChangePassword = async () => {
    if (!validateInputs()) return;

    try {
      await changePassword(currentPassword, newPassword);
      Alert.alert("Success", "Password changed successfully!");
      navigation.goBack();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to change password.";
      setErrors((prevErrors) => ({
        ...prevErrors,
        currentPassword: errorMessage,
      }));
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Reset your Password</Text>
      <View style={styles.inputContainer}>
        <TextInput
          label="Current Password"
          outlineColor={errors.currentPassword ? "#FF0000" : "#EEEFEF"}
          activeOutlineColor={errors.currentPassword ? "#FF0000" : "#26B346"}
          value={currentPassword}
          onChangeText={(value) => {
            setCurrentPassword(value);
            setErrors((prev) => ({ ...prev, currentPassword: "" }));
          }}
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
        {errors.currentPassword ? (
          <Text style={styles.errorText}>{errors.currentPassword}</Text>
        ) : null}
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          label="New Password"
          outlineColor={errors.newPassword ? "#FF0000" : "#EEEFEF"}
          activeOutlineColor={errors.newPassword ? "#FF0000" : "#26B346"}
          value={newPassword}
          onChangeText={(value) => {
            setNewPassword(value);
            setErrors((prev) => ({ ...prev, newPassword: "" }));
          }}
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
        {errors.newPassword ? (
          <Text style={styles.errorText}>{errors.newPassword}</Text>
        ) : null}
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          label="Confirm New Password"
          outlineColor={errors.confirmNewPassword ? "#FF0000" : "#EEEFEF"}
          activeOutlineColor={errors.confirmNewPassword ? "#FF0000" : "#26B346"}
          value={confirmNewPassword}
          onChangeText={(value) => {
            setConfirmNewPassword(value);
            setErrors((prev) => ({ ...prev, confirmNewPassword: "" }));
          }}
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
        {errors.confirmNewPassword ? (
          <Text style={styles.errorText}>{errors.confirmNewPassword}</Text>
        ) : null}
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

export default ChangePasswordScreen;
