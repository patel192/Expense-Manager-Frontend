import React, { useState } from "react";
import { UserNavbar } from "../User/UserNavbar";
import { UserSidebar } from "../User/UserSidebar";

export const PrivateLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // start closed

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Sidebar */}
      <UserSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        {/* Navbar */}
        <div className="sticky top-0 z-20 backdrop-blur-xl bg-white/10 border-b border-white/20 shadow-lg">
          <UserNavbar toggleSidebar={toggleSidebar} />
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Routed pages here */}
        </main>
      </div>
    </div>
  );
};
