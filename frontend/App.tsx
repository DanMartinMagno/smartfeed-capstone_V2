// App.tsx
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";

import store from "./store";
import { SwineProvider } from "./context/SwineContext";
import { AuthProvider, useAuth } from "./context/AuthContext";

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
import OnboardingScreen from "./screens/OnboardingScreen";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import EditAccountScreen from "./screens/EditAccountScreen";
import ChangePasswordScreen from "./screens/ChangePasswordScreen";
import SaveFormulationScreen from "./screens/SaveFormulationScreen";
import SavedFormulationDetailScreen from "./screens/SavedFormulationDetailScreen";

import { RootStackParamList, TabParamList } from "./types";

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
    <Stack.Screen
      name="SaveFormulation"
      component={SaveFormulationScreen}
      options={{ title: "Save Formulation" }}
    />
    <Stack.Screen
      name="SavedFormulationDetail"
      component={SavedFormulationDetailScreen}
      options={{ title: "Formulation Details" }}
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
    <Stack.Screen
      name="EditAccount"
      component={EditAccountScreen}
      options={{ title: "Edit Account" }}
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
    <Stack.Screen
      name="EditAccount"
      component={EditAccountScreen}
      options={{ title: "Edit Account" }}
    />
    <Stack.Screen
      name="ChangePassword"
      component={ChangePasswordScreen} // Add ChangePassword screen to the stack
      options={{ title: "Change Password" }}
    />
  </Stack.Navigator>
);

const MainAppNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName: string = "home";
        if (route.name === "Home") iconName = "home";
        else if (route.name === "Swine Weight Tracker")
          iconName = "fitness-center";
        else if (route.name === "FAQ") iconName = "info";
        else if (route.name === "Settings") iconName = "settings";
        return <Icon name={iconName} size={size} color={color} />;
      },
      headerShown: false,
    })}
  >
    <Tab.Screen name="Home" component={DashboardStack} />
    <Tab.Screen name="Swine Weight Tracker" component={SwineStack} />
    <Tab.Screen name="FAQ" component={FAQStack} />
    <Tab.Screen name="Settings" component={SettingsStack} />
  </Tab.Navigator>
);

const App: React.FC = () => {
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<
    boolean | null
  >(null);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      const completed = await AsyncStorage.getItem("onboardingCompleted");
      setIsOnboardingCompleted(completed !== null);
    };
    checkOnboardingStatus();
  }, []);

  const handleOnboardingComplete = async () => {
    await AsyncStorage.setItem("onboardingCompleted", "true");
    setIsOnboardingCompleted(true);
  };

  if (isOnboardingCompleted === null) {
    return null;
  }

  return (
    <Provider store={store}>
      <SwineProvider>
        <AuthProvider>
          <NavigationContainer>
            {isOnboardingCompleted ? (
              <AuthNavigation />
            ) : (
              <Stack.Navigator>
                <Stack.Screen
                  name="Onboarding"
                  options={{ headerShown: false }}
                >
                  {() => (
                    <OnboardingScreen onComplete={handleOnboardingComplete} />
                  )}
                </Stack.Screen>
              </Stack.Navigator>
            )}
          </NavigationContainer>
        </AuthProvider>
      </SwineProvider>
    </Provider>
  );
};

const AuthNavigation: React.FC = () => {
  const { user } = useAuth();

  return user ? (
    <MainAppNavigator />
  ) : (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default App;
