import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EXPO_PUBLIC_API_URL } from '@env';
import { Alert } from 'react-native';

const axiosInstance = axios.create({
  baseURL: EXPO_PUBLIC_API_URL,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
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
    if (
      error.response?.status === 403 &&
      error.response?.data?.message === 'Token expired, please log in again.'
    ) {
      await AsyncStorage.clear();
      Alert.alert('Session expired', 'Please log in again.');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
