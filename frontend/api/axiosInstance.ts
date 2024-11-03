// src/api/axiosInstance.ts (or directly in api/axiosInstance.ts)

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://192.168.43.166:5000/api", // Update with your backend's IP and base path
});

export default axiosInstance;
