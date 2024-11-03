// types/navigation.ts
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

export type RootStackParamList = {
  Login: undefined; // Add Login route here
  Signup: undefined; // Add Signup route here
  Home: undefined;
  "Add Swine": undefined;
  "Swine Detail": { swineId: string; initialWeight?: number };
  "Add Weight": { swineId: string };
  Graph: { swineId: string };
  "Edit Swine": { swineId: string };
  "Edit Weight": { swineId: string; weightId: string };
  EditAccount: undefined;
  ChangePassword: undefined;
  Onboarding: { onComplete: () => void };
  NutrientAnalysis: {
    type: string;
    numSwine: number;
    selectedIngredients: string[];
    totalNutrients: {
      crudeProtein: number;
      crudeFiber: number;
      crudeFat: number;
      calcium: number;
      moisture: number;
      phosphorus: number;
    };
  };
  SaveFormulation: {
    type: string;
    numSwine: number;
    selectedIngredients: string[];
    totalNutrients: {
      crudeProtein: number;
      crudeFiber: number;
      crudeFat: number;
      calcium: number;
      moisture: number;
      phosphorus: number;
    };
  };
  SavedFormulationDetail: {
    formulation: {
      name: string;
      description: string;
      ingredients: { ingredient: string; amount: number }[];
      totalNutrients: {
        crudeProtein: number;
        crudeFiber: number;
        crudeFat: number;
        calcium: number;
        moisture: number;
        phosphorus: number;
      };
    };
  };
};

// Existing type definitions
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
>;
export type EditWeightScreenRouteProp = RouteProp<
  RootStackParamList,
  "Edit Weight"
>;

// Add types for Login and Signup screens
export type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Login"
>;
export type SignupScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Signup"
>;
export type EditAccountScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "EditAccount"
>;
// New navigation props for SaveFormulation and SavedFormulationDetail screens
export type SaveFormulationScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SaveFormulation"
>;
export type SaveFormulationScreenRouteProp = RouteProp<
  RootStackParamList,
  "SaveFormulation"
>;

export type SavedFormulationDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SavedFormulationDetail"
>;
export type SavedFormulationDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  "SavedFormulationDetail"
>;
