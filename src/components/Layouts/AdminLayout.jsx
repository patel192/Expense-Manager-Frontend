import React, { useState } from "react";
import { AdminNavbar } from "../Admin/AdminNavbar";
import { AdminSidebar } from "../Admin/AdminSidebar";

/**
 * --- ADMIN DASHBOARD LAYOUT ---
 * The primary wrapper for all administrative pages.
 * Includes a persistent sidebar and a top navigation bar.
 */
export const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-[var(--text)]">
      
      {/* ── SIDEBAR ── */}
      {/* Handles navigation between different admin modules */}
      <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* ── MAIN CONTENT AREA ── */}
      <div className="flex-1 flex flex-col transition-all duration-300">
        
        {/* ── TOP NAVBAR ── */}
        <div className="sticky top-0 z-20 backdrop-blur-xl bg-white/10 border-b border-[var(--border)] shadow-lg px-4 md:px-6 py-3 flex justify-between items-center">
          {/* Mobile Hamburger: Only visible on small screens */}
          <button
            className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20"
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
          >
            <div className="w-5 h-0.5 bg-white mb-1"></div>
            <div className="w-5 h-0.5 bg-white mb-1"></div>
            <div className="w-5 h-0.5 bg-white"></div>
          </button>

          {/* User Profile / Admin Actions */}
          <div className="flex-1 flex justify-center md:justify-end">
            <AdminNavbar />
          </div>
        </div>

        {/* ── PAGE CONTENT ── */}
        <div
          className={`p-4 md:p-6 transition-all duration-300 ${
            isSidebarOpen ? "ml-64" : "ml-0"
          } md:ml-64`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

