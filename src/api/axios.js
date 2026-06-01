// =============== Imports  ===============
import axios from "axios";

// =============== API Configuration  ===============

// Base API URL from environment variable
const instance = axios.create({
  baseURL: "https://learn-25-node-1.onrender.com/api",
});

// Attach token automatically
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
