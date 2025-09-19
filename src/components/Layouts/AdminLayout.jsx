import React, { useState } from "react";
import { AdminNavbar } from "../Admin/AdminNavbar";
import { AdminSidebar } from "../Admin/AdminSidebar";

export const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main content area */}
      <div
        className="flex-1 transition-all duration-300"
        style={{
          marginLeft: isSidebarOpen ? "260px" : "60px", // Matches sidebar width
        }}
      >
        {/* Navbar */}
        <div className="sticky top-0 z-20 backdrop-blur-xl bg-white/10 border-b border-white/20 shadow-lg px-6 py-3">
          <AdminNavbar />
        </div>

        {/* Page Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};
