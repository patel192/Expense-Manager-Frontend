import React from "react";
import { AdminNavbar } from "../Admin/AdminNavbar";
import { AdminSidebar } from "../Admin/AdminSidebar";

export const AdminLayout = () => {
  return (
    <div id="wrapper" className="admin-layout">
      <div id="main">
        <div className="inner">
          <AdminNavbar></AdminNavbar>
        </div>
      </div>
      <AdminSidebar></AdminSidebar>
    </div>
  );
};
