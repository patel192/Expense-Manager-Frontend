import React, { useState } from "react";
import { UserNavbar } from "../User/UserNavbar";
import { UserSidebar } from "../User/UserSidebar";

export const PrivateLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="relative min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:z-auto
        `}
      >
        <UserSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Main Content */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300
          ${isSidebarOpen ? "md:ml-64" : "ml-0"}
        `}
      >
        {/* Navbar */}
        <div className="sticky top-0 z-20 backdrop-blur-xl bg-white/10 border-b border-white/10 shadow-lg">
          <UserNavbar toggleSidebar={toggleSidebar} />
        </div>

        {/* Main page content */}
        <main className="min-h-screen bg-transparent flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          {/* Routed pages go here */}
        </main>
      </div>
    </div>
  );
};
