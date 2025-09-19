import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsersCog,
  FaUserShield,
  FaFileAlt,
  FaClipboardList,
  FaBars,
  FaTimes,
  FaSearch,
  FaUser,
} from "react-icons/fa";

export const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = localStorage.getItem("id");
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();

  const menuItems = [
    { label: "Access Control", path: "/admin/accesscontrol", icon: <FaUserShield /> },
    { label: "Dashboard", path: "/admin/admindashboard", icon: <FaTachometerAlt /> },
    { label: "Manage Categories", path: "/admin/managecategories", icon: <FaClipboardList /> },
    { label: "Manage Users", path: "/admin/manageusers", icon: <FaUsersCog /> },
    { label: "Report Admins", path: "/admin/reportadmins", icon: <FaFileAlt /> },
    { label: "System Logs", path: "/admin/systemlogs", icon: <FaFileAlt /> },
    { label: "Account", path: `/admin/account/${userId}`, icon: <FaUser /> },
  ];

  const filteredMenu = menuItems.filter((item) =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={`fixed top-0 left-0 h-screen transition-all duration-300 ease-in-out 
      ${isOpen ? "w-64" : "w-20"} 
      bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white shadow-xl z-50`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
        {isOpen && (
          <h2 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Admin Panel
          </h2>
        )}
        <button
          onClick={toggleSidebar}
          className="text-gray-300 hover:text-white transition-colors text-xl"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Search */}
      {isOpen && (
        <div className="p-4">
          <div className="flex items-center bg-white/10 rounded-lg px-3 py-2">
            <FaSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent w-full text-sm outline-none placeholder-gray-400 text-white"
            />
          </div>
        </div>
      )}

      {/* Menu */}
      <nav className="mt-4">
        <ul className="space-y-1">
          {filteredMenu.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 transition-all duration-200 
                  ${isActive ? "bg-blue-600 text-white font-semibold" : "text-gray-300 hover:bg-white/10 hover:text-white"}
                  rounded-lg`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {isOpen && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer Info */}
      {isOpen && (
        <div className="absolute bottom-0 left-0 w-full p-4 border-t border-gray-700 text-sm">
          <h4 className="mb-2 text-red-400 font-semibold">Get in Touch</h4>
          <p className="mb-2 text-gray-300">
            Hello, I'm <span className="text-red-400 font-bold">Muhammad Patel</span>, a passionate web developer.
          </p>
          <ul className="space-y-1 text-gray-400">
            <li>Email: patelmuhammad192@gmail.com</li>
            <li>Phone: +91 8980380280</li>
            <li>
              GitHub:{" "}
              <a
                href="https://github.com/patel192"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                patel192
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
