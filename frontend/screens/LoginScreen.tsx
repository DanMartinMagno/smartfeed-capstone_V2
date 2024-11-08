// frontend/screens/LoginScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import Icon from "react-native-vector-icons/Ionicons"; // Ensure you have this package installed
import { StackNavigationProp } from "@react-navigation/stack";
import { LoginScreenNavigationProp } from "../types/navigation";

type Props = {
  navigation: LoginScreenNavigationProp;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility

  const handleLogin = async () => {
    setError(""); // Clear previous errors
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Login</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!passwordVisible} // Toggle visibility
          style={styles.input}
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
          <Icon
            name={passwordVisible ? "eye-off" : "eye"}
            size={24}
            color="gray"
            style={styles.eyeIcon}
          />
        </TouchableOpacity>
      </View>
      <Button title="Login" onPress={handleLogin} />
      <Text onPress={() => navigation.navigate("Signup")} style={styles.link}>
        Don't have an account? Sign up
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, marginVertical: 10 },
  link: { color: "blue", marginTop: 15, textAlign: "center" },
  error: { color: "red", marginBottom: 10 },
  passwordContainer: { flexDirection: "row", alignItems: "center" },
  eyeIcon: { padding: 10 },
});

export default LoginScreen;
