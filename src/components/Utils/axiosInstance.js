import axios from "axios";
import { startLoading, stopLoading } from "../../redux/ui/uiSlice";

let store;

export const injectStore = (_store) => {
  store = _store;
};

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
    // Start global loader unless skipped
    if (store && !config.skipGlobalLoader) {
      config._globalLoading = true;
      store.dispatch(startLoading(config.loadingText));
    }
    
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    if (store && error.config?._globalLoading) {
      store.dispatch(stopLoading());
    }
    return Promise.reject(error);
  }
);

// Add retry logic for cold starts and network errors
axiosInstance.interceptors.response.use(
  (response) => {
    if (store && response.config?._globalLoading) {
      store.dispatch(stopLoading());
    }
    return response;
  },
  async (error) => {
    const { config, message } = error;
    
    // Retry logic... (unchanged logic omitted for brevity in instruction, will be handled in ReplacementContent)
    if (config && !config._retry) {
      config._retry = true;
      
      const isTimeout = message.includes("timeout") || error.code === "ECONNABORTED";
      const isNetworkError = message.includes("Network Error") || !error.response;

      if (isTimeout || isNetworkError) {
        console.warn("API Error (Possible Cold Start): Retrying request...", message);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return axiosInstance(config);
      }
    }
    
    if (store && config?._globalLoading) {
      store.dispatch(stopLoading());
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
