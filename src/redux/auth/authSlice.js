import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  user: null,
  token: null,
  role: null,
  isAuthenticated: false,
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
      state.loading = false;

      localStorage.setItem("user", JSON.stringify(action.payload.user));

      localStorage.setItem("token", action.payload.token);

      localStorage.setItem("role", action.payload.role);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;

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
