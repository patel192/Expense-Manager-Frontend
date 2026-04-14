
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://learn-25-node.onrender.com/api",
  timeout: 120000, // 120 seconds to allow for Render cold starts
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token automatically if available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add retry logic for cold starts and network errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, message } = error;
    
    // Retry logic: if it's a timeout or network error, and we haven't retried yet
    if (config && !config._retry) {
      config._retry = true;
      
      const isTimeout = message.includes("timeout") || error.code === "ECONNABORTED";
      const isNetworkError = message.includes("Network Error") || !error.response;

      if (isTimeout || isNetworkError) {
        console.warn("API Error (Possible Cold Start): Retrying request...", message);
        // Wait 2 seconds before retrying
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return axiosInstance(config);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
