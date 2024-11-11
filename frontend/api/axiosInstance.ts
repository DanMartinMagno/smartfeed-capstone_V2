///api/axiosInstance.ts

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native"; // Import Alert to show messages to the user

const axiosInstance = axios.create({
  baseURL: "http://192.168.43.166:5000/api", // Update with backend IP and base path
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Check for 403 Forbidden error with token expiration
    if (
      error.response?.status === 403 &&
      error.response?.data?.message === "Token expired, please log in again."
    ) {
      await AsyncStorage.clear(); // Clear token and user data
      Alert.alert("Session expired", "Please log in again.");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
