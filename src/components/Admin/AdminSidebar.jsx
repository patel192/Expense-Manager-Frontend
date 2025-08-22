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
    {
      label: "Access Control",
      path: "/admin/accesscontrol",
      icon: <FaUserShield />,
    },
    {
      label: "Dashboard",
      path: "/admin/admindashboard",
      icon: <FaTachometerAlt />,
    },
    {
      label: "Manage Categories",
      path: "/admin/managecategories",
      icon: <FaClipboardList />,
    },
    { label: "Manage Users", path: "/admin/manageusers", icon: <FaUsersCog /> },
    {
      label: "Report Admins",
      path: "/admin/reportadmins",
      icon: <FaFileAlt />,
    },
    { label: "System Logs", path: "/admin/systemlogs", icon: <FaFileAlt /> },
    { label: "Account", path: `/admin/account/${userId}`, icon: <FaUser /> },
  ];

  const filteredMenu = menuItems.filter((item) =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      id="sidebar"
      className={isOpen ? "sidebar open" : "sidebar closed"}
      style={{
        width: isOpen ? "260px" : "60px",
        background: "#1e1e2f",
        color: "white",
        transition: "width 0.3s ease",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        overflowY: "auto",
      }}
    >
      <div
        style={{
          padding: "10px",
          display: "flex",
          justifyContent: isOpen ? "space-between" : "center",
          alignItems: "center",
        }}
      >
        {isOpen && <h2 style={{ fontSize: "1.2rem" }}>Admin Panel</h2>}
        <button
          onClick={toggleSidebar}
          style={{
            background: "none",
            border: "none",
            color: "white",
            fontSize: "1.3rem",
            cursor: "pointer",
          }}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {isOpen && (
        <div style={{ padding: "10px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "#2d2d44",
              borderRadius: "6px",
              padding: "5px 8px",
            }}
          >
            <FaSearch style={{ marginRight: "8px", color: "#bbb" }} />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "white",
                width: "100%",
              }}
            />
          </div>
        </div>
      )}

      <nav style={{ marginTop: "20px" }}>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {filteredMenu.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 15px",
                  color: location.pathname === item.path ? "#f56a6a" : "white",
                  background:
                    location.pathname === item.path ? "#2d2d44" : "transparent",
                  textDecoration: "none",
                  fontWeight:
                    location.pathname === item.path ? "bold" : "normal",
                }}
              >
                {item.icon}
                {isOpen && item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {isOpen && (
        <>
          <div style={{ padding: "15px" }}>
            <h4 style={{ marginBottom: "5px", color: "#f56a6a" }}>
              Get in Touch
            </h4>
            <p style={{ fontSize: "0.9rem", lineHeight: "1.4" }}>
              Hello, I'm{" "}
              <strong style={{ color: "#f56a6a" }}>Muhammad Patel</strong>, a
              passionate web developer.
            </p>
            <ul style={{ listStyle: "none", padding: 0, fontSize: "0.85rem" }}>
              <li>Email: patelmuhammad192@gmail.com</li>
              <li>Phone: +91 8980380280</li>
              <li>
                GitHub:{" "}
                <a
                  href="https://github.com/patel192"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#f56a6a" }}
                >
                  patel192
                </a>
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};
