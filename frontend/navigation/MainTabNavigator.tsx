// frontend/navigation/MainTabNavigator.tsx
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialIcons";

import DashboardStack from "../screens/DashboardScreen"; // Import your main stacks
import SwineStack from "../screens/Swine-Weight-Tracker-Screen";
import FAQScreen from "../screens/FAQScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { TabParamList } from "../types";

const Tab = createBottomTabNavigator<TabParamList>();

const MainTabNavigator: React.FC = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName = "home";
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
    <Tab.Screen name="FAQ" component={FAQScreen} />
    <Tab.Screen name="Settings" component={SettingsScreen} />
  </Tab.Navigator>
);

export default MainTabNavigator;
