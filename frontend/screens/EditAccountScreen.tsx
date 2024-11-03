import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  Alert,
  ActivityIndicator,
} from "react-native";
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
  const { user, updateUser, loading } = useAuth(); // Get user and loading from context
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleInitial, setMiddleInitial] = useState("");
  const [email, setEmail] = useState("");

  // Load user data into state when user data is available
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
      await updateUser({ lastName, firstName, middleInitial, email });
      Alert.alert("Success", "Profile updated successfully!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Errors", "Failed to update profile");
    }
  };

  // Show loading indicator until user data is loaded
  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View>
      <TextInput
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        placeholder="Middle Initial"
        value={middleInitial}
        onChangeText={setMiddleInitial}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
};

export default EditAccountScreen;
