import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EXPO_PUBLIC_API_URL } from '@env'; // Added import to access API_URL from .env file

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

const getToken = async () => {
  return await AsyncStorage.getItem('token');
};

export const login = async (email: string, password: string) => {
  const response = await axios.post(`${EXPO_PUBLIC_API_URL}/auth/login`, {
    email,
    password,
  }); // Replaced hardcoded URL with API_URL
  return response.data;
};

export const signup = async (
  lastName: string,
  firstName: string,
  middleInitial: string,
  email: string,
  password: string
) => {
  const response = await axios.post(`${EXPO_PUBLIC_API_URL}/auth/signup`, {
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
  const response = await axios.put(
    `${EXPO_PUBLIC_API_URL}/user/update`,
    userData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string
) => {
  const token = await getToken();
  if (!token) throw new Error('No token found');

  try {
    const response = await axios.put(
      `${EXPO_PUBLIC_API_URL}/user/change-password`,
      { oldPassword: currentPassword, newPassword },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    throw new Error('Password change failed');
  }
};

export const saveRecipe = async (recipeData: Recipe) => {
  const token = await getToken();
  if (!token) throw new Error('No token found');

  try {
    const response = await axios.post(
      `${EXPO_PUBLIC_API_URL}/recipes/save`,
      recipeData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Save failed');
  }
};

export const getSavedRecipes = async () => {
  const token = await getToken();
  const response = await axios.get(`${EXPO_PUBLIC_API_URL}/recipes/all`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getUserProfile = async (token: string) => {
  const response = await axios.get(`${EXPO_PUBLIC_API_URL}/user/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
