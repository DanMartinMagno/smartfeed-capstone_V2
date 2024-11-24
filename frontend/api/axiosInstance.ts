import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env"; // Importing API_URL from .env
import { Alert } from "react-native"; // For showing alerts to users

// Create an axios instance with the base URL from .env
const axiosInstance = axios.create({
  baseURL: API_URL, // Dynamically uses API_URL from .env
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token"); // Retrieve token from AsyncStorage
    if (token) {
      // Use backticks for string interpolation
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error) // Pass request errors to be handled later
);

axiosInstance.interceptors.response.use(
  (response) => response, // Pass successful responses directly
  async (error) => {
    // Handle token expiration or other server-side errors
    if (
      error.response?.status === 403 &&
      error.response?.data?.message === "Token expired, please log in again."
    ) {
      await AsyncStorage.clear(); // Clear stored user data
      Alert.alert("Session expired", "Please log in again.");
    }
    return Promise.reject(error); // Pass errors to be handled by the caller
  }
);

export default axiosInstance;
