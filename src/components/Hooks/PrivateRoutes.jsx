import React, { useEffect } from "react";
import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
const useAuth = () => {
  const [authState, setauthState] = useState({ isLoggedin: false, role: "" });
  const [loading, setloading] = useState(true);
  useEffect(() => {
    const id = localStorage.getItem("id");
    const role = localStorage.getItem("role");
    if (id) {
      setauthState({ isLoggedin: true, role });
    }
    setloading(false);
  }, []);
  return { ...authState, loading };
};
export const PrivateRoutes = () => {
 
    const auth = useAuth();
  
    if (auth.loading) return <h1>Loading...</h1>;
  
    const currentPath = window.location.pathname;
  
    // role-based control
    if (auth.isLoggedin) {
      if (auth.role === "Admin" && currentPath.startsWith("/admin")) {
        return <Outlet />;
      } else if (auth.role === "User" && currentPath.startsWith("/private")) {
        return <Outlet />;
      } else {
        return <Navigate to="/login" />;
      }
    }
  
    return <Navigate to="/login" />;
  };
  

