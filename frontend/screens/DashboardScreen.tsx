import React, { useRef, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Animated,
} from "react-native";
import { useDispatch } from "react-redux";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import { setType } from "../store/feedSlice";
import { LinearGradient } from "expo-linear-gradient"; // Use Expo's LinearGradient

type DashboardScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Dashboard"
>;

type Props = {
  navigation: DashboardScreenNavigationProp;
};

const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch();

  // Set the scale to 1 initially to prevent bounce effect
  const starterScaleAnim = useRef(new Animated.Value(1)).current;
  const growerScaleAnim = useRef(new Animated.Value(1)).current;
  const finisherScaleAnim = useRef(new Animated.Value(1)).current;

  // Handles card press logic
  const handlePress = (type: "starter" | "grower" | "finisher") => {
    dispatch(setType(type)); // Dispatches the type of the card pressed
    navigation.navigate("Input"); // Navigates to the 'Input' screen
  };

  // Scale down the card when it's pressed
  const handlePressIn = (scaleAnim: Animated.Value) => {
    Animated.spring(scaleAnim, {
      toValue: 0.95, // Scale down to 95%
      useNativeDriver: true,
    }).start();
  };

  // Scale back the card after pressing and triggers the card's action
  const handlePressOut = (
    scaleAnim: Animated.Value,
    cardType: "starter" | "grower" | "finisher"
  ) => {
    Animated.spring(scaleAnim, {
      toValue: 1, // Scale back to normal size
      useNativeDriver: true,
    }).start(() => handlePress(cardType));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.greetingsContainer}>
        <Text style={styles.greetingsHeader}>Hi there!</Text>
        <Text style={styles.greetingsText}>
          What feed would you like to formulate today?
        </Text>
      </View>
      {/* Starter Card */}
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
});

export default DashboardScreen;
