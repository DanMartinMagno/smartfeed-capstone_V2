import React, { useRef, useState, useContext } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Animated,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useDispatch } from "react-redux";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import { setType } from "../store/feedSlice";
import { LinearGradient } from "expo-linear-gradient";
import axiosInstance from "../api/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../context/AuthContext";
import { useFocusEffect } from "@react-navigation/native";
import { deleteFormulation as apiDeleteFormulation } from "../api/formulationApi";

type DashboardScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Dashboard"
>;

type Props = {
  navigation: DashboardScreenNavigationProp;
};

interface Formulation {
  numSwine: number;
  type: "starter" | "grower" | "finisher";
  isExpired: boolean;
  expirationDate: string;
  _id: string;
  name: string;
  description: string;
  ingredients: { name: string; amount: number }[];
  totalNutrients: {
    crudeProtein: number;
    crudeFiber: number;
    crudeFat: number;
    calcium: number;
    moisture: number;
    phosphorus: number;
  };
}

const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch();
  const starterScaleAnim = useRef(new Animated.Value(1)).current;
  const growerScaleAnim = useRef(new Animated.Value(1)).current;
  const finisherScaleAnim = useRef(new Animated.Value(1)).current;

  const [savedFormulations, setSavedFormulations] = useState<Formulation[]>([]);
  const { user } = useContext(AuthContext) ?? {};
  const userId = user?.userId;

  const handlePress = (type: "starter" | "grower" | "finisher") => {
    dispatch(setType(type));
    navigation.navigate("Input");
  };

  const handlePressIn = (scaleAnim: Animated.Value) => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (
    scaleAnim: Animated.Value,
    cardType: "starter" | "grower" | "finisher"
  ) => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start(() => handlePress(cardType));
  };

  // Fetch saved formulations whenever the screen gains focus
  useFocusEffect(
    React.useCallback(() => {
      const fetchFormulations = async () => {
        try {
          const token = await AsyncStorage.getItem("token");
          if (!token) {
            console.warn("No token found, please log in again.");
            return;
          }

          const response = await axiosInstance.get(
            "/formulations/user-formulations",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          // Mark expired formulations
          const currentDate = new Date();
          const updatedFormulations = response.data.map(
            (formulation: Formulation) => ({
              ...formulation,
              isExpired: new Date(formulation.expirationDate) < currentDate,
            })
          );

          setSavedFormulations(updatedFormulations);
        } catch (error) {
          console.error("Error fetching formulations:", error);
        }
      };

      fetchFormulations();
    }, [userId])
  );

  const handleDeleteFormulation = async (formulationId: string) => {
    // Renamed local function
    try {
      const response = await apiDeleteFormulation(formulationId);
      if (response.success) {
        setSavedFormulations((prev) =>
          prev.filter((formulation) => formulation._id !== formulationId)
        );
      } else {
        Alert.alert("Error", "Failed to delete formulation");
      }
    } catch (error) {
      console.error("Error deleting formulation:", error);
      Alert.alert("Error", "Failed to delete formulation");
    }
  };

  // Usage of handleDeleteFormulation in your confirmDelete function
  const confirmDelete = (formulationId: string) => {
    Alert.alert(
      "Delete Formulation",
      "Are you sure you want to delete this formulation?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => handleDeleteFormulation(formulationId), // Use handleDeleteFormulation here
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Render feed type cards */}
      <TouchableWithoutFeedback
        onPressIn={() => handlePressIn(starterScaleAnim)}
        onPressOut={() => handlePressOut(starterScaleAnim, "starter")}
      >
        <Animated.View style={{ transform: [{ scale: starterScaleAnim }] }}>
          <LinearGradient
            colors={["#0CB73F", "#95D642"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.featureCard}
          >
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <View style={styles.iconBackground}>
                  <Image
                    source={require("../assets/starter-icon.png")}
                    style={styles.featureIcon}
                  />
                </View>
                <Text style={styles.featureTitle}>Starter</Text>
              </View>
              <Text style={styles.featureDescription}>
                Starter for native swine, aged 2-4 weeks and weighing 23-35 kg,
                offers essentials for early growth and development.
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>
      </TouchableWithoutFeedback>

      {/* Grower Card */}
      <TouchableWithoutFeedback
        onPressIn={() => handlePressIn(growerScaleAnim)}
        onPressOut={() => handlePressOut(growerScaleAnim, "grower")}
      >
        <Animated.View style={{ transform: [{ scale: growerScaleAnim }] }}>
          <LinearGradient
            colors={["#1E90FF", "#87CEFA"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.featureCard}
          >
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <View style={styles.iconBackground}>
                  <Image
                    source={require("../assets/grower-icon.png")}
                    style={styles.featureIcon}
                  />
                </View>
                <Text style={styles.featureTitle}>Grower</Text>
              </View>
              <Text style={styles.featureDescription}>
                Grower stage for native swine, aged 5-12 weeks and weighing
                35-75 kg, provides necessary support for steady muscle growth.
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>
      </TouchableWithoutFeedback>

      {/* Finisher Card */}
      <TouchableWithoutFeedback
        onPressIn={() => handlePressIn(finisherScaleAnim)}
        onPressOut={() => handlePressOut(finisherScaleAnim, "finisher")}
      >
        <Animated.View style={{ transform: [{ scale: finisherScaleAnim }] }}>
          <LinearGradient
            colors={["#FF7F50", "#ebb886"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.featureCard}
          >
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <View style={styles.iconBackground}>
                  <Image
                    source={require("../assets/finisher-icon.png")}
                    style={styles.featureIcon}
                  />
                </View>
                <Text style={styles.featureTitle}>Finisher</Text>
              </View>
              <Text style={styles.featureDescription}>
                Finisher for native swine, aged 13+ weeks and weighing 75 kg+,
                ensures optimal weight gain and readiness for market.
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>
      </TouchableWithoutFeedback>

      {/* Saved Formulations List */}
      <View>
        <Text>Saved Formulations</Text>
        {savedFormulations.map((formulation) => (
          <TouchableOpacity
            key={formulation._id}
            disabled={formulation.isExpired} // Disable interaction if expired
            onPress={() =>
              navigation.navigate("SavedFormulationDetail", {
                formulation: {
                  ...formulation,
                  type: formulation.type || "starter",
                  expirationDate:
                    formulation.expirationDate || new Date().toISOString(),
                  numSwine: formulation.numSwine,
                },
              })
            }
          >
            <Text
              style={
                formulation.isExpired
                  ? styles.expiredText // Apply expired styling
                  : styles.formulationName
              }
            >
              {formulation.name}
            </Text>
            <Text>{formulation.description}</Text>
            <Text>
              {formulation.isExpired
                ? "Expired"
                : `Valid until ${new Date(formulation.expirationDate).toLocaleDateString()}`}
            </Text>

            {/* Delete Button */}
            <TouchableOpacity onPress={() => confirmDelete(formulation._id)}>
              <Text style={{ color: "red", marginTop: 5 }}>Delete</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f6f9",
    alignItems: "center",
    paddingVertical: 20,
  },
  greetingsContainer: {
    alignSelf: "stretch",
    marginLeft: 20,
  },
  greetingsText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#7D7D7D",
    marginVertical: 12,
    textAlign: "left",
    marginTop: 0,
    marginBottom: 15,
  },
  greetingsHeader: {
    fontSize: 19,
    fontWeight: "800",
    color: "#333",
    marginVertical: 12,
    textAlign: "left",
    marginBottom: 0,
  },
  featureCard: {
    alignItems: "center",
    width: "90%",
    borderRadius: 13,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    height: 150,
  },
  cardContent: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  iconBackground: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  featureIcon: {
    width: 40,
    height: 40,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  featureDescription: {
    fontSize: 14,
    color: "#f1f1f1",
    fontWeight: "500",
  },
  expiredText: {
    color: "red",
    textDecorationLine: "line-through",
  },
  formulationName: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default DashboardScreen;
function deleteFormulation(formulationId: string) {
  throw new Error("Function not implemented.");
}
