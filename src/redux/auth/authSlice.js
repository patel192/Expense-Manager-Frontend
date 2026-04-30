import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../components/Utils/axiosInstance";

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  await axiosInstance.post("/user/logout");
});

const getStoredUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user && user !== "undefined" ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

const savedUser = getStoredUser();
const savedRole = localStorage.getItem("role");
const savedToken = localStorage.getItem("token");

const initialState = {
  user: savedUser,
  role: savedRole && savedRole !== "undefined" ? savedRole : null,
  token: savedToken && savedToken !== "undefined" ? savedToken : null,
  isAuthenticated: !!savedUser,
  loading: false,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { user, role, token } = action.payload;
      state.user = user || null;
      state.role = role || null;
      state.token = token || null;
      state.isAuthenticated = !!user;
      state.loading = false;

      if (user) localStorage.setItem("user", JSON.stringify(user));
      if (role) localStorage.setItem("role", role);
      if (token) localStorage.setItem("token", token);
    },

    updateToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
    },

    logout: (state) => {
      state.user = null;
      state.role = null;
      state.token = null;
      state.isAuthenticated = false;

      localStorage.removeItem("user");
      localStorage.removeItem("role");
      localStorage.removeItem("token");
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.role = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
      localStorage.removeItem("role");
    });
  },
});
export const { loginSuccess, logout, setLoading, updateToken } = authSlice.actions;
export default authSlice.reducer;
