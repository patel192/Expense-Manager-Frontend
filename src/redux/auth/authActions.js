/**
 * Auth action creators - exported separately to avoid circular dependencies
 */

export const logout = (state) => {
  state.user = null;
  state.role = null;
  state.token = null;
  state.isAuthenticated = false;
  localStorage.removeItem("user:v1");
  localStorage.removeItem("role:v1");
  localStorage.removeItem("token:v1");
};

export const updateToken = (state, action) => {
  state.token = action.payload;
  localStorage.setItem("token:v1", action.payload);
};
