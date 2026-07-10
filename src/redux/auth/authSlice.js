import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../components/Utils/axiosInstance";

/**
 * --- ASYNC ACTIONS ---
 */
export const logoutUser = createAsyncThunk("auth/logout", async () => {
  // Let the backend know we're logging out (clears cookies, etc.)
  await axiosInstance.post("/user/logout");
});

/**
 * --- SESSION PERSISTENCE ---
 * We check localStorage on startup so the user doesn't have 
 * to log in again after a page refresh.
 */
const getStoredUser = () => {
  try {
    const user = localStorage.getItem("user:v1");
    return user && user !== "undefined" ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

const savedUser = getStoredUser();
const savedRole = localStorage.getItem("role:v1");
const savedToken = localStorage.getItem("token:v1");

const initialState = {
  user: savedUser,
  role: savedRole && savedRole !== "undefined" ? savedRole : null,
  token: savedToken && savedToken !== "undefined" ? savedToken : null,
  isAuthenticated: !!savedUser,
  loading: false,
};

/**
 * --- AUTH SLICE ---
 */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Called after a successful login API call
    loginSuccess: (state, action) => {
      const { user, role, token } = action.payload;
      state.user = user || null;
      state.role = role || null;
      state.token = token || null;
      state.isAuthenticated = !!user;
      state.loading = false;

      // Persist to local storage so session survives refresh
      if (user) localStorage.setItem("user:v1", JSON.stringify(user));
      if (role) localStorage.setItem("role:v1", role);
      if (token) localStorage.setItem("token:v1", token);
    },

    // Used if we need to manually update the JWT
    updateToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem("token:v1", action.payload);
    },

    // Merge updated user fields (e.g. profilePic) into auth state
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem("user:v1", JSON.stringify(state.user));
    },

    // Wipe everything (Local state + Storage)
    logout: (state) => {
      state.user = null;
      state.role = null;
      state.token = null;
      state.isAuthenticated = false;

      localStorage.removeItem("user:v1");
      localStorage.removeItem("role:v1");
      localStorage.removeItem("token:v1");
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Handle the cleanup after the logout async thunk finishes
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.role = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user:v1");
      localStorage.removeItem("role:v1");
      localStorage.removeItem("token:v1");
    });
  },
});
export const { loginSuccess, logout, setLoading, updateToken, updateUser } =
  authSlice.actions;
export default authSlice.reducer;
