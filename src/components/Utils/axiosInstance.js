import axios from "axios";
import { startLoading, stopLoading } from "../../redux/ui/uiSlice";
import { logout } from "../../redux/auth/authSlice";

let store;

export const injectStore = (_store) => {
  store = _store;
};

const axiosInstance = axios.create({
  baseURL: "https://learn-25-node.onrender.com/api",
  timeout: 120000,
  withCredentials: true, // Send cookies with every request
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    if (store && !config.skipGlobalLoader) {
      config._globalLoading = true;
      store.dispatch(startLoading(config.loadingText));
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

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    if (store && response.config?._globalLoading) {
      store.dispatch(stopLoading());
    }
    return response;
  },
  async (error) => {
    const { config, response } = error;

    // Handle 401 Unauthorized (Token Expired)
    if (response?.status === 401 && !config._retry) {
      config._retry = true;
      try {
        // Attempt to refresh token
        await axios.post(
          "https://learn-25-node.onrender.com/api/user/refresh-token",
          {},
          { withCredentials: true }
        );
        // Retry original request
        return axiosInstance(config);
      } catch (refreshError) {
        // Refresh failed, logout user
        if (store) {
          store.dispatch(logout());
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    if (config && !config._retry) {
      config._retry = true;
      const message = error.message || "";
      const isTimeout = message.includes("timeout") || error.code === "ECONNABORTED";
      const isNetworkError = message.includes("Network Error") || !error.response;

      if (isTimeout || isNetworkError) {
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
