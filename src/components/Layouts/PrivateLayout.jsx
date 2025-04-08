import React from "react";
import { UserNavbar } from "../User/UserNavbar";
import { UserSidebar } from "../User/UserSidebar";
import { useState } from "react";
export const PrivateLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };
  return (
    <div id="wrapper" className={`user-layout ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      <div id="main">
        <div className="inner">
          <UserNavbar></UserNavbar>
        </div>
      </div>
      <UserSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar}></UserSidebar>
    </div>  
  );
};
