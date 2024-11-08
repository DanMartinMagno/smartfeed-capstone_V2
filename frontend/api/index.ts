//api/index.ts

import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.43.166:5000/api", // My machine's IP address
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
