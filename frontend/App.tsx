// App.tsx
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";
import { View, ActivityIndicator, StatusBar } from "react-native";
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
  <View style={{ flex: 1 }}>
    <StatusBar barStyle="light-content" backgroundColor="#39AD3D" />
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerStyle: {
          backgroundColor: "#39AD3D",
          height: 50,
        },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: {
          fontWeight: "700",
          fontSize: 24,
        },
      }}
    >
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: "SmartFeed",
          headerTitleAlign: "center", // Center the title for this screen only
        }}
      />
      <Stack.Screen
        name="Input"
        component={InputScreen}
        options={{
          title: "Input Data",
          headerTitleStyle: {
            fontWeight: "600",
            fontSize: 21,
          },
        }}
      />
      <Stack.Screen
        name="Result"
        component={ResultScreen}
        options={{
          title: "Results",
          headerTitleStyle: {
            fontWeight: "600",
            fontSize: 21,
          },
        }}
      />
      <Stack.Screen
        name="Nutrient Analysis"
        component={NutrientAnalysisScreen}
        options={{
          title: "Nutrient Analysis",
          headerTitleStyle: {
            fontWeight: "600",
            fontSize: 21,
          },
        }}
      />
      <Stack.Screen
        name="SaveFormulation"
        component={SaveFormulationScreen}
        options={{
          title: "Save Formulation",
          headerTitleStyle: {
            fontWeight: "600",
            fontSize: 21,
          },
        }}
      />
      <Stack.Screen
        name="SavedFormulationDetail"
        component={SavedFormulationDetailScreen}
        options={{
          title: "Formulation Details",
          headerTitleStyle: {
            fontWeight: "600",
            fontSize: 21,
          },
        }}
      />
    </Stack.Navigator>
  </View>
);

const SwineStack = () => (
  <Stack.Navigator
    initialRouteName="Home"
    screenOptions={{
      headerStyle: {
        backgroundColor: "#39AD3D", // Green background for the header
        height: 50, // Increased header height
      },
      headerTintColor: "#FFFFFF", // White text for the header
      headerTitleStyle: {
        fontWeight: "600", // Semi-bold font for default screens
        fontSize: 21, // Default font size
      },
    }}
  >
    <Stack.Screen
      name="Home"
      component={HomeScreen}
      options={{
        title: "Swine Management",
        headerTitleAlign: "left", // Ensure the title is aligned to the left
        headerTitleStyle: {
          fontWeight: "600", // Bold font for emphasis
          fontSize: 21, // Larger font size for prominence
        },
      }}
    />
    <Stack.Screen
      name="Add Swine"
      component={AddSwineScreen}
      options={{
        title: "Add New Swine",
        headerTitleStyle: {
          fontWeight: "600", // Semi-bold font
          fontSize: 21,
        },
      }}
    />
    <Stack.Screen
      name="Swine Detail"
      component={SwineDetailScreen}
      options={{
        title: "Swine Details",
        headerTitleStyle: {
          fontWeight: "600",
          fontSize: 21,
        },
      }}
    />
    <Stack.Screen
      name="Add Weight"
      component={AddWeightScreen}
      options={{
        title: "Add Swine Weight",
        headerTitleStyle: {
          fontWeight: "600",
          fontSize: 21,
        },
      }}
    />
    <Stack.Screen
      name="Graph"
      component={GraphScreen}
      options={{
        title: "Weight Graph",
        headerTitleStyle: {
          fontWeight: "600",
          fontSize: 21,
        },
      }}
    />
    <Stack.Screen
      name="Edit Weight"
      component={EditWeightScreen}
      options={{
        title: "Edit Swine Weight",
        headerTitleStyle: {
          fontWeight: "600",
          fontSize: 21,
        },
      }}
    />
  </Stack.Navigator>
);

const FAQStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: "#39AD3D", // Green background for the header
        height: 50, // Increased header height
      },
      headerTintColor: "#FFFFFF", // White text for the header
      headerTitleStyle: {
        fontWeight: "600", // Default semi-bold font weight
        fontSize: 21, // Default font size
      },
    }}
  >
    <Stack.Screen
      name="FAQScreen"
      component={FAQScreen}
      options={{
        title: "Frequently Asked Questions",
        headerTitleStyle: {
          fontWeight: "600", // Bold font for emphasis
          fontSize: 21, // Larger font size for prominence
        },
      }}
    />
    <Stack.Screen
      name="EditAccount"
      component={EditAccountScreen}
      options={{
        title: "Edit Account",
        headerTitleStyle: {
          fontWeight: "600",
          fontSize: 21,
        },
      }}
    />
  </Stack.Navigator>
);

const SettingsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: "#39AD3D", // Green background for the header
        height: 50, // Increased header height
      },
      headerTintColor: "#FFFFFF", // White text for the header
      headerTitleStyle: {
        fontWeight: "600", // Default semi-bold font weight
        fontSize: 21, // Default font size
      },
    }}
  >
    <Stack.Screen
      name="SettingsScreen"
      component={SettingsScreen}
      options={{
        title: "Settings",
        headerTitleStyle: {
          fontWeight: "600", // Bold font
          fontSize: 21, // Larger font size
        },
      }}
    />
    <Stack.Screen
      name="EditAccount"
      component={EditAccountScreen}
      options={{
        title: "Edit Account",
        headerTitleStyle: {
          fontWeight: "600",
          fontSize: 21,
        },
      }}
    />
    <Stack.Screen
      name="ChangePassword"
      component={ChangePasswordScreen}
      options={{
        title: "Change Password",
        headerTitleStyle: {
          fontWeight: "600",
          fontSize: 21,
        },
      }}
    />
  </Stack.Navigator>
);

const MainAppNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: string = "";

        // Set the icon names based on the route
        if (route.name === "Home")
          iconName = focused ? "home" : "home-outline"; // Filled when active
        else if (route.name === "Weight")
          iconName = focused ? "albums" : "albums-outline"; // Filled when active
        else if (route.name === "FAQ")
          iconName = focused
            ? "information-circle"
            : "information-circle-outline";
        // Filled when active
        else if (route.name === "Settings")
          iconName = focused ? "settings" : "settings-outline"; // Filled when active

        // Return the icon with dynamic name
        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: "#39AD3D", // Active icon color (Green fill)
      tabBarInactiveTintColor: "#5C5C5C", // Inactive icon color (Gray)
      tabBarStyle: {
        backgroundColor: "#f2f6f9",
        height: 60, // Adjust height
        paddingBottom: 10, // Space below icons
      },
      tabBarLabelStyle: {
        fontSize: 11, // Text size
      },
      headerShown: false,
    })}
  >
    <Tab.Screen name="Home" component={DashboardStack} />
    <Tab.Screen name="Weight" component={SwineStack} />
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
              <AuthNavigation /> // Main authenticated navigation stack
            ) : (
              <Stack.Navigator>
                <Stack.Screen
                  name="Onboarding"
                  options={{ headerShown: false }} // Disable header for OnboardingScreen
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
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#18BD18" />
      </View>
    );
  }

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
