// src/utils/logout.js
export const logout = () => {
    localStorage.removeItem("id");
    localStorage.removeItem("role");
    window.location.href = "/login"; // This forces redirect to login
  };
  