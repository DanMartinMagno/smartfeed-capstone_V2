import React, { useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { changePassword } from "../api/authApi";
import { RootStackParamList } from "../types";

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

  const handleChangePassword = async () => {
    // Validate that the new passwords match
    if (newPassword !== confirmNewPassword) {
      Alert.alert("Error", "New passwords do not match.");
      return;
    }

    // Ensure new password meets a minimum length requirement, if desired
    if (newPassword.length < 1) {
      Alert.alert("Error", "New password must be at least 6 characters long.");
      return;
    }

    try {
      // Attempt to change password
      await changePassword(currentPassword, newPassword);
      Alert.alert("Success", "Password changed successfully!");
      navigation.goBack();
    } catch (error: any) {
      // Check if the error is due to incorrect current password
      if (
        error.response &&
        error.response.data &&
        error.response.data.message === "Current password is incorrect"
      ) {
        Alert.alert("Error", "The current password you entered is incorrect.");
      } else {
        // Generic error message for any other issues
        Alert.alert("Error", "Failed to change password. Please try again.");
      }
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Current Password"
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />
      <TextInput
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TextInput
        placeholder="Confirm New Password"
        secureTextEntry
        value={confirmNewPassword}
        onChangeText={setConfirmNewPassword}
      />
      <Button title="Change Password" onPress={handleChangePassword} />
    </View>
  );
};

export default ChangePasswordScreen;
