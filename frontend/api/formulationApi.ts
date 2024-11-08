// formulationApi.ts

import axios from "axios";
import axiosInstance from "./axiosInstance";

export const saveFormulation = async (formulationData: any, token: string) => {
  const response = await axios.post(
    "http://192.168.43.166:5000/api/formulations/save",
    formulationData,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const getFormulations = async (token: string) => {
  const response = await axios.get(
    "http://192.168.43.166:5000/api/formulations/user-formulations", // Verify correct URL here
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

// Define a type for the delete response to ensure consistent structure
interface DeleteResponse {
  success: boolean;
  data?: any;
  error?: any;
}

export const deleteFormulation = async (
  formulationId: string
): Promise<DeleteResponse> => {
  try {
    const response = await axiosInstance.delete(
      `/formulations/${formulationId}`
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error deleting formulation:", error);
    return { success: false, error };
  }
};
