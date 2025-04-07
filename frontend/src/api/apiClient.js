// src/api/apiClient.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000", // Fallback for safety
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["x-auth-token"] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;