import React, { useState } from "react";
import { UserNavbar } from "../User/UserNavbar";
import { UserSidebar } from "../User/UserSidebar";

export const PrivateLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // start closed

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar */}
      <UserSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <UserNavbar toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-4">
          {/* Routed pages here */}
        </main>
      </div>
    </div>
  );
};
