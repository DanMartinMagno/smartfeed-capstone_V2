// formulationApi.ts

import axios from "axios";

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
