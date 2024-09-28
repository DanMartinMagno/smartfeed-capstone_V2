export type RootStackParamList = {
  Dashboard: undefined;
  Input: undefined;
  Result: {
    type: "starter" | "grower" | "finisher";
    numSwine: number;
    selectedIngredients: string[];
  };
  Home: undefined;
  "Add Swine": undefined;
  "Swine Detail": { swineId: string; initialWeight?: number };
  "Add Weight": { swineId: string };
  Graph: { swineId: string };
  "Edit Weight": { swineId: string; weightId: string };
  "Nutrient Analysis": {
    type: string;
    numSwine: number;
    selectedIngredients: string[];
  };
  FAQScreen: undefined;
  SettingsScreen: undefined;
};

export type TabParamList = {
  Home: undefined;
  "Swine Weight Tracker": undefined;
  FAQ: undefined;
  Settings: undefined;
};
