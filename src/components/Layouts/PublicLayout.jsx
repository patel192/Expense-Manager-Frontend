import React from "react";
import { Navbar } from "../Common/Navbar";
import { Outlet } from "react-router-dom";

export const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white">
      <Navbar />
      
      {/* Smooth fade-in animation for all public pages */}
      <div className="px-4 md:px-8 lg:px-16 py-10 animate__animated animate__fadeIn">
        <Outlet />
      </div>
    </div>
  );
};
