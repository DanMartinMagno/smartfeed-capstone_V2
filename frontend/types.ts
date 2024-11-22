// types.ts

export type RootStackParamList = {
  Dashboard: undefined;
  Input: undefined;
  Result: {
    type: "starter" | "grower" | "finisher";
    numSwine: number;
    selectedIngredients: { ingredient: string; amount: number }[];
  };
  Onboarding: undefined;
  Home: undefined;
  "Add Swine": undefined;
  "Swine Detail": { swineId: string; initialWeight?: number };
  "Add Weight": { swineId: string };
  Graph: { swineId: string };
  "Edit Weight": { swineId: string; weightId: string };
  "Nutrient Analysis": {
    type: string;
    numSwine: number;
    selectedIngredients: { ingredient: string; amount: number }[];
    totalNutrients: {
      crudeProtein: number;
      crudeFiber: number;
      crudeFat: number;
      calcium: number;
      moisture: number;
      phosphorus: number;
    };
  };
  FAQScreen: undefined;
  SettingsScreen: undefined;

  // Authentication screens
  Login: undefined;
  Signup: undefined;
  EditAccount: undefined;
  ChangePassword: undefined;

  // New screens for formulation saving and details
  SaveFormulation: {
    type: string;
    numSwine: number;
    selectedIngredients: { ingredient: string; amount: number }[];

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
      type: "starter" | "grower" | "finisher";
      expirationDate: string;
      numSwine: number;
      ingredients: { name: string; amount: number }[];
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

export type TabParamList = {
  Home: undefined;
  "Weight": undefined;
  FAQ: undefined;
  Settings: undefined;
};
