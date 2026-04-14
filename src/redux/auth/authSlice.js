import { createSlice } from "@reduxjs/toolkit";

const getStoredUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user && user !== "undefined" ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

const savedUser = getStoredUser();
const savedToken = localStorage.getItem("token");
const savedRole = localStorage.getItem("role");

const initialState = {
  user: savedUser,
  token: savedToken && savedToken !== "undefined" ? savedToken : null,
  role: savedRole && savedRole !== "undefined" ? savedRole : null,
  isAuthenticated: !!savedUser,
  loading: false,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { user, token, role } = action.payload;
      state.user = user || null;
      state.token = token || null;
      state.role = role || null;
      state.isAuthenticated = !!user;
      state.loading = false;

      if (user) localStorage.setItem("user", JSON.stringify(user));
      if (token) localStorage.setItem("token", token);
      if (role) localStorage.setItem("role", role);
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
