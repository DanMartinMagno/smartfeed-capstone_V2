// frontend/api/authApi.ts
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface User {
  userId: string;
  lastName: string;
  firstName: string;
  middleInitial: string;
  email: string;
}

interface Recipe {
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
}

const API_URL = "http://192.168.43.166:5000/api";

const getToken = async () => {
  return await AsyncStorage.getItem("token");
};

export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/auth/login`, {
    email,
    password,
  });
  return response.data;
};

export const signup = async (
  lastName: string,
  firstName: string,
  middleInitial: string,
  email: string,
  password: string
) => {
  const response = await axios.post(`${API_URL}/auth/signup`, {
    lastName,
    firstName,
    middleInitial,
    email,
    password,
  });
  return response.data;
};

export const updateUserData = async (userData: User) => {
  const token = await getToken();
  console.log("Using token:", token); // Log token for debugging
  const response = await axios.put(`${API_URL}/user/update`, userData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string
) => {
  const token = await AsyncStorage.getItem("token");
  if (!token) throw new Error("No token found");

  try {
    const response = await axios.put(
      `${API_URL}/user/change-password`,
      { oldPassword: currentPassword, newPassword: newPassword },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    throw new Error("Password change failed");
  }
};

export const saveRecipe = async (recipeData: Recipe) => {
  const token = await AsyncStorage.getItem("token");
  if (!token) throw new Error("No token found");

  try {
    console.log("Attempting to save recipe with data:", recipeData); // Logging request data
    const response = await axios.post(`${API_URL}/recipes/save`, recipeData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Recipe saved successfully:", response.data); // Logging response data
    return response.data;
  } catch (error: any) {
    console.error("Save recipe error:", error.response?.data || error.message);
    throw new Error(
      "Save failed: " + (error.response?.data?.message || "Request failed")
    );
  }
};

export const getSavedRecipes = async () => {
  const token = await AsyncStorage.getItem("token");
  const response = await axios.get(`${API_URL}/recipes/all`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getUserProfile = async (token: string) => {
  const response = await axios.get(`${API_URL}/user/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
