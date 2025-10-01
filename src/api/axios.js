// src/axiosConfig.js
import axios from "axios";

const instance = axios.create({
  baseURL: "https://learn-25-node.onrender.com/api",
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
