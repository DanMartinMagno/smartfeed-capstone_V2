import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import Icon from "react-native-vector-icons/Ionicons";
import { LoginScreenNavigationProp } from "../types/navigation";

type Props = {
  navigation: LoginScreenNavigationProp;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    const newErrors = {
      email: "",
      password: "",
      general: "",
    };

    if (!email) newErrors.email = "Email is required.";
    else if (!validateEmail(email)) newErrors.email = "Enter a valid email.";
    if (!password) newErrors.password = "Password is required.";

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== "")) {
      return;
    }

    try {
      await login(email, password);
    } catch (err: any) {
      const generalError = err.message || "Invalid email or password";
      // Assign error to relevant fields
      setErrors({
        email: generalError.includes("email") ? generalError : "",
        password: generalError.includes("password") ? generalError : "",
        general: "", // No need for a central general error message
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          source={require("../assets/login-illustration.png")}
          style={styles.topImage}
        />

        <Text style={styles.welcomeText}>Welcome Back!</Text>
        <Text style={styles.subText}>
          Login to your existing account of SmartFeed
        </Text>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (text) setErrors({ ...errors, email: "" });
            }}
            style={[styles.input, errors.email ? styles.inputError : undefined]}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email ? (
            <Text style={styles.errorText}>{errors.email}</Text>
          ) : null}
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <View
            style={[
              styles.passwordContainer,
              errors.password ? styles.inputError : undefined,
            ]}
          >
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (text) setErrors({ ...errors, password: "" });
              }}
              secureTextEntry={!passwordVisible}
              style={styles.passwordInput}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}
            >
              <Icon
                name={passwordVisible ? "eye" : "eye-off"}
                size={20}
                color="gray"
                style={styles.eyeIcon}
              />
            </TouchableOpacity>
          </View>
          {errors.password ? (
            <Text style={styles.errorText}>{errors.password}</Text>
          ) : null}
        </View>

        {/* Login Button */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Sign In</Text>
        </TouchableOpacity>

        <Text style={styles.signupPrompt}>
          Don't have an account?{" "}
          <Text
            onPress={() => navigation.navigate("Signup")}
            style={styles.signupLink}
          >
            Sign Up
          </Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f2f6f9",
  },
  topImage: {
    width: "100%",
    height: 250,
    resizeMode: "contain",
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
    marginBottom: 10,
  },
  inputContainer: {
    marginTop: 1,
  },
  input: {
    borderWidth: 2,
    borderColor: "#EDEFEF",
    padding: 12,
    fontSize: 16,
    borderRadius: 10,
    marginVertical: 2,
    backgroundColor: "#fff",
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 1,
    padding: 5,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#EDEFEF",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginVertical: 7,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 10,
  },
  loginButton: {
    backgroundColor: "#28a745",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  signupPrompt: {
    textAlign: "center",
    fontSize: 14,
    marginTop: 8,
    color: "gray",
    marginBottom: 15,
  },
  signupLink: {
    color: "#28a745",
    fontWeight: "bold",
  },
});

export default LoginScreen;
