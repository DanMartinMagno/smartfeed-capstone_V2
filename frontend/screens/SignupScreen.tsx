import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; // Import Ionicons from react-native-vector-icons
import { useAuth } from "../context/AuthContext";
import { SignupScreenNavigationProp } from "../types/navigation";

type Props = {
  navigation: SignupScreenNavigationProp;
};

const SignupScreen: React.FC<Props> = ({ navigation }) => {
  const { signup } = useAuth();
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleInitial, setMiddleInitial] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility
  const [errors, setErrors] = useState({
    lastName: "",
    firstName: "",
    email: "",
    password: "",
    general: "",
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignup = async () => {
    const newErrors = {
      lastName: "",
      firstName: "",
      email: "",
      password: "",
      general: "",
    };

    // Validate fields
    if (!lastName) newErrors.lastName = "Last name is required.";
    if (!firstName) newErrors.firstName = "First name is required.";
    if (!email) newErrors.email = "Email is required.";
    else if (!validateEmail(email)) newErrors.email = "Enter a valid email.";
    if (!password) newErrors.password = "Password is required.";

    setErrors(newErrors);

    // If there are errors, stop the submission
    if (Object.values(newErrors).some((error) => error !== "")) {
      return;
    }

    try {
      await signup(lastName, firstName, middleInitial, email, password);
      navigation.navigate("Login");
    } catch (err: any) {
      if (
        err.response &&
        err.response.status === 400 &&
        err.response.data.message === "Email already in use"
      ) {
        setErrors({ ...newErrors, email: "Email already exists." });
      } else {
        setErrors({
          ...newErrors,
          general: "Error creating account. Please try again.",
        });
      }
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
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Let's get started!</Text>
          <Text style={styles.subHeaderText}>
            Create an account to get all features
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Last Name"
            value={lastName}
            onChangeText={(text) => {
              setLastName(text);
              if (text) setErrors({ ...errors, lastName: "" });
            }}
            style={[
              styles.input,
              errors.lastName ? styles.inputError : undefined,
            ]}
          />
          {errors.lastName ? (
            <Text style={styles.errorText}>{errors.lastName}</Text>
          ) : null}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="First Name"
            value={firstName}
            onChangeText={(text) => {
              setFirstName(text);
              if (text) setErrors({ ...errors, firstName: "" });
            }}
            style={[
              styles.input,
              errors.firstName ? styles.inputError : undefined,
            ]}
          />
          {errors.firstName ? (
            <Text style={styles.errorText}>{errors.firstName}</Text>
          ) : null}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Middle Name (Optional)"
            value={middleInitial}
            onChangeText={setMiddleInitial}
            style={styles.input}
          />
        </View>

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

        <View style={styles.inputContainer}>
          {/* Password input with eye icon */}
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
              secureTextEntry={!passwordVisible} // Toggles secureTextEntry based on visibility state
              style={styles.passwordInput}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}
            >
              <Icon
                name={passwordVisible ? "eye" : "eye-off"}
                size={24}
                color="#888"
              />
            </TouchableOpacity>
          </View>
          {errors.password ? (
            <Text style={styles.errorText}>{errors.password}</Text>
          ) : null}
        </View>

        <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
          <Text style={styles.signupButtonText}>Sign Up</Text>
        </TouchableOpacity>

        <Text style={styles.signupPrompt}>
          Already have an account?{" "}
          <Text
            onPress={() => navigation.navigate("Login")}
            style={styles.signupLink}
          >
            Sign In
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
  headerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
    textAlign: "center",
  },
  subHeaderText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 10,
  },
  input: {
    borderWidth: 2,
    borderColor: "#EEEFEF",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#EDEFEF",
    borderRadius: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  signupButton: {
    backgroundColor: "#28a745",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  signupButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  signupPrompt: {
    textAlign: "center",
    fontSize: 14,
    marginTop: 17,
    color: "gray",
    marginBottom: 15,
  },
  signupLink: {
    color: "#28a745",
    fontWeight: "bold",
  },
});

export default SignupScreen;
