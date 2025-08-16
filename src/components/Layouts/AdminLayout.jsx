import React, { useState } from "react";
import { AdminNavbar } from "../Admin/AdminNavbar";
import { AdminSidebar } from "../Admin/AdminSidebar";

export const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f4f4f4",
      }}
    >
      {/* Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main content area */}
      <div
        style={{
          flex: 1,
          marginLeft: isSidebarOpen ? "260px" : "60px", // Matches sidebar width
          transition: "margin-left 0.3s ease",
        }}
      >
        {/* Navbar */}
        <div
          style={{
            background: "white",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            padding: "10px 20px",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <AdminNavbar />
        </div>

        {/* Page Content */}
        <div style={{ padding: "20px" }}>
          {children}
        </div>
      </div>
    </div>
  );
};
