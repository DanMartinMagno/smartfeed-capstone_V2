import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import store from "./store";
import DashboardScreen from "./screens/DashboardScreen";
import InputScreen from "./screens/InputScreen";
import ResultScreen from "./screens/ResultScreen";
import FAQScreen from "./screens/FAQScreen";
import SettingsScreen from "./screens/SettingsScreen";
import HomeScreen from "./screens/HomeScreen";
import AddSwineScreen from "./screens/AddSwineScreen";
import SwineDetailScreen from "./screens/SwineDetailScreen";
import AddWeightScreen from "./screens/AddWeightScreen";
import GraphScreen from "./screens/GraphScreen";
import EditWeightScreen from "./screens/EditWeightScreen";
import NutrientAnalysisScreen from "./screens/NutrientAnalysisScreen";
import OnboardingScreen from "./screens/OnboardingScreen"; // Add onboarding screen import
import { RootStackParamList, TabParamList } from "./types";
import Icon from "react-native-vector-icons/MaterialIcons";
import { SwineProvider } from "./context/SwineContext";

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const DashboardStack = () => (
  <Stack.Navigator initialRouteName="Dashboard">
    <Stack.Screen
      name="Dashboard"
      component={DashboardScreen}
      options={{ title: "SmartFeed" }}
    />
    <Stack.Screen
      name="Input"
      component={InputScreen}
      options={{ title: "Input Data" }}
    />
    <Stack.Screen
      name="Result"
      component={ResultScreen}
      options={{ title: "Results" }}
    />
    <Stack.Screen
      name="Nutrient Analysis"
      component={NutrientAnalysisScreen}
      options={{ title: "Nutrient Analysis" }}
    />
  </Stack.Navigator>
);

const SwineStack = () => (
  <Stack.Navigator initialRouteName="Home">
    <Stack.Screen
      name="Home"
      component={HomeScreen}
      options={{ title: "Swine Management" }}
    />
    <Stack.Screen
      name="Add Swine"
      component={AddSwineScreen}
      options={{ title: "Add New Swine" }}
    />
    <Stack.Screen
      name="Swine Detail"
      component={SwineDetailScreen}
      options={{ title: "Swine Details" }}
    />
    <Stack.Screen
      name="Add Weight"
      component={AddWeightScreen}
      options={{ title: "Add Swine Weight" }}
    />
    <Stack.Screen
      name="Graph"
      component={GraphScreen}
      options={{ title: "Weight Graph" }}
    />
    <Stack.Screen
      name="Edit Weight"
      component={EditWeightScreen}
      options={{ title: "Edit Swine Weight" }}
    />
  </Stack.Navigator>
);

const FAQStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="FAQScreen"
      component={FAQScreen}
      options={{ title: "Frequently Asked Questions" }}
    />
  </Stack.Navigator>
);

const SettingsStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="SettingsScreen"
      component={SettingsScreen}
      options={{ title: "Settings" }}
    />
  </Stack.Navigator>
);

const App: React.FC = () => {
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<
    boolean | null
  >(null);

  // Check onboarding status from AsyncStorage
  useEffect(() => {
    const resetOnboarding = async () => {
      await AsyncStorage.removeItem("onboardingCompleted"); // Clear onboarding flag for testing
    };

    resetOnboarding(); // Call this function to reset onboarding status

    const checkOnboardingStatus = async () => {
      const completed = await AsyncStorage.getItem("onboardingCompleted");
      setIsOnboardingCompleted(completed !== null);
    };
    checkOnboardingStatus();
  }, []);

  // Mark onboarding as completed
  const handleOnboardingComplete = async () => {
    await AsyncStorage.setItem("onboardingCompleted", "true");
    setIsOnboardingCompleted(true);
  };

  if (isOnboardingCompleted === null) {
    // Optionally, show a loading screen until the onboarding status is fetched
    return null;
  }

  return (
    <Provider store={store}>
      <SwineProvider>
        <NavigationContainer>
          {isOnboardingCompleted ? (
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                  let iconName: string = "home";
                  if (route.name === "Home") {
                    iconName = "home";
                  } else if (route.name === "Swine Weight Tracker") {
                    iconName = "fitness-center";
                  } else if (route.name === "FAQ") {
                    iconName = "info";
                  } else if (route.name === "Settings") {
                    iconName = "settings";
                  }
                  return <Icon name={iconName} size={size} color={color} />;
                },
                headerShown: false, // Hide the header for the tab navigator
              })}
            >
              <Tab.Screen name="Home" component={DashboardStack} />
              <Tab.Screen name="Swine Weight Tracker" component={SwineStack} />
              <Tab.Screen name="FAQ" component={FAQStack} />
              <Tab.Screen name="Settings" component={SettingsStack} />
            </Tab.Navigator>
          ) : (
            <Stack.Navigator>
              <Stack.Screen name="Onboarding" options={{ headerShown: false }}>
                {() => (
                  <OnboardingScreen onComplete={handleOnboardingComplete} />
                )}
              </Stack.Screen>
            </Stack.Navigator>
          )}
        </NavigationContainer>
      </SwineProvider>
    </Provider>
  );
};

export default App;
