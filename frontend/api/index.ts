import axios from "axios";

const api = axios.create({
  baseURL: "ttps://my-swine-feed-app.onrender.com/api", // My machine's IP address
});

interface FeedCalculationRequest {
  selectedIngredients: string[];
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
