import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import store from './store';
import DashboardScreen from './screens/DashboardScreen';
import InputScreen from './screens/InputScreen';
import ResultScreen from './screens/ResultScreen';
import SwineWeightTrackerScreen from './screens/SwineWeightTrackerScreen';
import FAQScreen from './screens/FAQScreen';
import SettingsScreen from './screens/SettingsScreen';
import HomeScreen from './screens/HomeScreen';
import AddSwineScreen from './screens/AddSwineScreen';
import SwineDetailScreen from './screens/SwineDetailScreen';
import AddWeightScreen from './screens/AddWeightScreen';
import GraphScreen from './screens/GraphScreen';
import EditWeightScreen from './screens/EditWeightScreen';
import NutrientAnalysisScreen from './screens/NutrientAnalysisScreen'; // Ensure this import
import { RootStackParamList, TabParamList } from './types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SwineProvider } from './context/SwineContext';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const DashboardStack = () => (
  <Stack.Navigator initialRouteName="Dashboard">
    <Stack.Screen name="Dashboard" component={DashboardScreen} />
    <Stack.Screen name="Input" component={InputScreen} />
    <Stack.Screen name="Result" component={ResultScreen} />
    <Stack.Screen name="Nutrient Analysis" component={NutrientAnalysisScreen} />
  </Stack.Navigator>
);

const SwineStack = () => (
  <Stack.Navigator initialRouteName="Home">
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Add Swine" component={AddSwineScreen} />
    <Stack.Screen name="Swine Detail" component={SwineDetailScreen} />
    <Stack.Screen name="Add Weight" component={AddWeightScreen} />
    <Stack.Screen name="Graph" component={GraphScreen} />
    <Stack.Screen name="Edit Weight" component={EditWeightScreen} />
  </Stack.Navigator>
);

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <SwineProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ color, size }) => {
                let iconName: string = 'home';
                if (route.name === 'Home') {
                  iconName = 'home';
                } else if (route.name === 'Swine Weight Tracker') {
                  iconName = 'fitness-center';
                } else if (route.name === 'FAQ') {
                  iconName = 'info';
                } else if (route.name === 'Settings') {
                  iconName = 'settings';
                }
                return <Icon name={iconName} size={size} color={color} />;
              },
            })}
          >
            <Tab.Screen name="Home" component={DashboardStack} />
            <Tab.Screen name="Swine Weight Tracker" component={SwineStack} />
            <Tab.Screen name="FAQ" component={FAQScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </SwineProvider>
    </Provider>
  );
};

export default App;
