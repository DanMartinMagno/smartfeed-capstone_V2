//api/index.ts

import axios from "axios";
import { API_URL } from "@env";

const api = axios.create({
  baseURL: API_URL, // Uses the environment variable
});

interface FeedCalculationRequest {
  selectedIngredients: { ingredient: string; amount: number }[];
  numSwine: number;
  type: "starter" | "grower" | "finisher";
}

interface FeedCalculationResult {
  ingredientAmounts: { ingredient: string; amount: number }[];
  totalNutrients: {
    crudeProtein: number;
    crudeFiber: number;
    crudeFat: number;
    calcium: number;
    moisture: number;
    phosphorus: number;
  };
}

export const calculateFeed = (data: FeedCalculationRequest) =>
  api.post<FeedCalculationResult>("/calculate-feed", data);
