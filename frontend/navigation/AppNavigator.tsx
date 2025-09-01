import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import MainTabNavigator from '../navigation/MainTabNavigator'; // Existing main tab navigator

const Stack = createStackNavigator();

const AppNavigator: React.FC = () => {
  const { user } = useAuth(); // Determine if user is logged in

  return user ? (
    <MainTabNavigator /> // Show main app if authenticated
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

export default AppNavigator;
