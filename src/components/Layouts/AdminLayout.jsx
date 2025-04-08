import React from "react";
import { AdminNavbar } from "../Admin/AdminNavbar";
import { AdminSidebar } from "../Admin/AdminSidebar";
import { useState } from "react";
export const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
    const toggleSidebar = () => {
      setIsSidebarOpen((prev) => !prev);
    };
  return (
    <div id="wrapper" className={`admin-layout ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      <div id="main">
        <div className="inner">
          <AdminNavbar></AdminNavbar>
        </div>
      </div>
      <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar}></AdminSidebar>
    </div>
  );
};
