// frontend/store/feedSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the Formulation type
interface Formulation {
  _id: string;
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
}

// Define FeedState with savedFormulations
interface Ingredient {
  ingredient: string;
  amount: number;
}

interface FeedState {
  savedFormulations: Formulation[];
  type: "starter" | "grower" | "finisher";
  numSwine: number;
  selectedIngredients: Ingredient[]; // Update to expect an array of Ingredient objects
}

// Initialize FeedState with savedFormulations as an empty array
const initialState: FeedState = {
  savedFormulations: [], // Initialize as empty array
  type: "starter",
  numSwine: 0,
  selectedIngredients: [],
};

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    setType: (
      state,
      action: PayloadAction<"starter" | "grower" | "finisher">
    ) => {
      state.type = action.payload;
    },
    setNumSwine: (state, action: PayloadAction<number>) => {
      state.numSwine = action.payload;
    },
    setSelectedIngredients: (
      state,
      action: PayloadAction<{ ingredient: string; amount: number }[]>
    ) => {
      state.selectedIngredients = action.payload;
    },
    setSavedFormulations: (state, action: PayloadAction<Formulation[]>) => {
      state.savedFormulations = action.payload;
    },
  },
});

export const {
  setType,
  setNumSwine,
  setSelectedIngredients,
  setSavedFormulations,
} = feedSlice.actions;

export default feedSlice.reducer;
