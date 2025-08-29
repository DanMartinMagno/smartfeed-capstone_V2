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
  Dimensions,
} from "react-native";

import { useDispatch } from "react-redux";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons"; // or any other icon library you prefer
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

  // Flag to prevent press if scrolling
  const isScrolling = useRef(false);

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
    }).start(() => {
      // Only trigger navigation if not scrolling
      if (!isScrolling.current) {
        dispatch(setType(cardType));
        navigation.navigate("Input");
      }
    });
  };

  // Detect scroll event
  const handleScrollBeginDrag = () => {
    isScrolling.current = true;
  };

  const handleScrollEndDrag = () => {
    isScrolling.current = false;
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
        } catch (error) {}
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

  // Function to map formulation types to icons and background colors
  const getIconDetails = (type: "starter" | "grower" | "finisher") => {
    switch (type) {
      case "starter":
        return { icon: "database" as const, color: "#6EB743" };
      case "grower":
        return { icon: "save" as const, color: "#85B6F1" };
      case "finisher":
        return { icon: "archive" as const, color: "#F1B56A" };
      default:
        throw new Error(`Unsupported formulation type: ${type}`);
    }
  };
  const [isStarterPressed, setIsStarterPressed] = useState(false);
  const [isGrowerPressed, setIsGrowerPressed] = useState(false);
  const [isFinisherPressed, setIsFinisherPressed] = useState(false);
  // Render delete button for swipe-to-delete

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      onScrollBeginDrag={handleScrollBeginDrag}
      onScrollEndDrag={handleScrollEndDrag}
      keyboardShouldPersistTaps="handled" // Ensures taps during scroll are ignored
    >
      <View style={styles.greetingsContainer}>
        <Text style={styles.greetingsHeader}>Hi there!</Text>
        <Text style={styles.greetingsText}>
          What feed would you like to formulate today?
        </Text>
      </View>
      <View style={styles.container}>
        {/* Starter Card */}
        <TouchableOpacity
          activeOpacity={1}
          onPressIn={() => setIsStarterPressed(true)}
          onPressOut={() => setIsStarterPressed(false)}
          onPress={() => handlePressOut(starterScaleAnim, "starter")}
        >
          <Animated.View style={{ transform: [{ scale: starterScaleAnim }] }}>
            <LinearGradient
              colors={["#39AD3D", "#95D642"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.featureCard, { position: "relative" }]}
            >
              {/* Hover effect overlay */}
              {isStarterPressed && (
                <View
                  style={{
                    ...StyleSheet.absoluteFillObject,
                    backgroundColor: "rgba(107, 107, 107, 0.2)",
                    borderRadius: 13,
                  }}
                />
              )}

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
                  Starter for native swine, aged 2-4 weeks and weighing 23-35
                  kg, offers essentials for early growth and development.
                </Text>
              </View>
            </LinearGradient>
          </Animated.View>
        </TouchableOpacity>

        {/* Grower Card */}
        <TouchableOpacity
          activeOpacity={1}
          onPressIn={() => setIsGrowerPressed(true)}
          onPressOut={() => setIsGrowerPressed(false)}
          onPress={() => handlePressOut(growerScaleAnim, "grower")}
        >
          <Animated.View style={{ transform: [{ scale: growerScaleAnim }] }}>
            <LinearGradient
              colors={["#1E90FF", "#87CEFA"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.featureCard, { position: "relative" }]}
            >
              {/* Hover effect overlay */}
              {isGrowerPressed && (
                <View
                  style={{
                    ...StyleSheet.absoluteFillObject,
                    backgroundColor: "rgba(0, 0, 0, 0.2)",
                    borderRadius: 13,
                  }}
                />
              )}

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
        </TouchableOpacity>

        {/* Finisher Card */}
        <TouchableOpacity
          activeOpacity={1}
          onPressIn={() => setIsFinisherPressed(true)}
          onPressOut={() => setIsFinisherPressed(false)}
          onPress={() => handlePressOut(finisherScaleAnim, "finisher")}
        >
          <Animated.View style={{ transform: [{ scale: finisherScaleAnim }] }}>
            <LinearGradient
              colors={["#FF7F50", "#ebb886"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.featureCard, { position: "relative" }]}
            >
              {/* Hover effect overlay */}
              {isFinisherPressed && (
                <View
                  style={{
                    ...StyleSheet.absoluteFillObject,
                    backgroundColor: "rgba(0, 0, 0, 0.2)",
                    borderRadius: 13,
                  }}
                />
              )}

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
        </TouchableOpacity>

        {/* Saved Formulations List */}
        <View>
          <Text style={styles.headerText}>My Formulations</Text>
          {savedFormulations.map((formulation) => {
            const { icon, color } = getIconDetails(formulation.type);

            return (
              <TouchableOpacity
                key={formulation._id}
                style={[
                  styles.card,
                  formulation.isExpired && styles.expiredCard,
                ]}
                onLongPress={() => confirmDelete(formulation._id)}
                onPress={() =>
                  !formulation.isExpired &&
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
                <View
                  style={[styles.iconContainer, { backgroundColor: color }]}
                >
                  <FontAwesome name={icon} size={24} color="white" />
                </View>

                <View style={styles.textContainer}>
                  <Text
                    style={[
                      styles.formulationName,
                      formulation.isExpired && styles.expiredText,
                    ]}
                  >
                    {formulation.name}
                  </Text>
                  <Text
                    style={[
                      styles.expirationText,
                      formulation.isExpired && styles.expiredText,
                    ]}
                  >
                    {formulation.isExpired
                      ? "Expired"
                      : `Valid until ${new Date(
                          formulation.expirationDate
                        ).toLocaleDateString()}`}
                  </Text>
                </View>

                <FontAwesome name="angle-right" size={24} color="#999" />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: "#f2f6f9",
  },
  container: {
    flex: 1,
    backgroundColor: "#f2f6f9",
    alignItems: "center",
  },
  greetingsContainer: {
    alignSelf: "stretch",
    marginLeft: 12,
    marginBottom: 1,
  },
  greetingsText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#7D7D7D",

    textAlign: "left",
    marginBottom: 10,
  },
  greetingsHeader: {
    fontSize: 17,
    fontWeight: "800",
    color: "#4C4C4C",
    marginVertical: 5,
    textAlign: "left",
    marginTop: 10,
  },

  featureCard: {
    alignItems: "center",
    padding: 10,
    margin: 10,
    width: Dimensions.get("window").width * 0.95,
    borderRadius: 13,
    marginBottom: 0.1,
    marginTop: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    height: 160,
  },
  cardContent: {
    padding: 9,
    margin: 9,
    width: "95%",
    flex: 1,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
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
    marginBottom: 10,
  },
  featureDescription: {
    fontSize: 14,
    color: "#f1f1f1",
    fontWeight: "500",
    marginBottom: 10,
    lineHeight: 18,
  },
  expiredText: {
    color: "red",
    textDecorationLine: "line-through",
  },
  formulationName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4C4C4C",
  },
  headerText: {
    marginBottom: 9,
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "bold",
    color: "#515252",
    marginVertical: 15,
    paddingHorizontal: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginVertical: 3,
    marginHorizontal: 16,
    width: "95%",
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },

    elevation: 1,
  },
  expiredCard: {
    backgroundColor: "#f9f9f9",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  expirationText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#7D7D7D",
    marginTop: 2,
  },
  deleteButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    backgroundColor: "red",
    borderRadius: 10,
    marginVertical: 8,
    marginRight: 16,
  },
  deleteText: {
    color: "white",
    fontSize: 14,
    marginTop: 5,
  },
});

export default DashboardScreen;
function deleteFormulation(formulationId: string) {
  throw new Error("Function not implemented.");
}
