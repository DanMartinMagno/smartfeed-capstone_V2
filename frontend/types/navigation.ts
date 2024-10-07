import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

export type RootStackParamList = {
  Home: undefined;
  "Add Swine": undefined;
  "Swine Detail": { swineId: string; initialWeight?: number };
  "Add Weight": { swineId: string };
  Graph: { swineId: string };
  "Edit Swine": { swineId: string };
  "Edit Weight": { swineId: string; weightId: string }; // Add this line
  Onboarding: { onComplete: () => void };
};

export type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Home"
>;
export type HomeScreenRouteProp = RouteProp<RootStackParamList, "Home">;

export type AddSwineScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Add Swine"
>;
export type AddSwineScreenRouteProp = RouteProp<
  RootStackParamList,
  "Add Swine"
>;

export type SwineDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Swine Detail"
>;
export type SwineDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  "Swine Detail"
>;

export type AddWeightScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Add Weight"
>;
export type AddWeightScreenRouteProp = RouteProp<
  RootStackParamList,
  "Add Weight"
>;

export type GraphScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Graph"
>;
export type GraphScreenRouteProp = RouteProp<RootStackParamList, "Graph">;

export type EditSwineScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Edit Swine"
>;
export type EditSwineScreenRouteProp = RouteProp<
  RootStackParamList,
  "Edit Swine"
>;

export type EditWeightScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Edit Weight"
>; // Add this line
export type EditWeightScreenRouteProp = RouteProp<
  RootStackParamList,
  "Edit Weight"
>; // Add this line
