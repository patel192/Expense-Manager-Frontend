import { createSlice } from "@reduxjs/toolkit";
const savedUser = localStorage.getItem("user");
const savedToken = localStorage.getItem("token");
const savedRole = localStorage.getItem("role");

const initialState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  token: savedToken || null,
  role: savedRole || null,
  isAuthenticated: !!savedUser,
  loading: false,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.isAuthenticated = true;
      state.loading = false;

      localStorage.setItem("user", JSON.stringify(action.payload.user));

      localStorage.setItem("token", action.payload.token);

      localStorage.setItem("role", action.payload.role);
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;

      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});
export const { loginSuccess, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;
