import React from "react";
import { Outlet, Link } from "react-router-dom";
import { logout } from "../Utils/Logout";
import { FaTwitter, FaFacebookF, FaSnapchatGhost, FaInstagram, FaMediumM } from "react-icons/fa";

export const AdminNavbar = () => {
  return (
    <div>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 20px",
          backgroundColor: "#1e1e2f",
          color: "white",
        }}
      >
        <Link to="/" style={{ textDecoration: "none", color: "white", fontWeight: "bold", fontSize: "1.2rem" }}>
          Trackit | Expense App
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <button
            onClick={logout}
            style={{
              padding: "6px 14px",
              backgroundColor: "#ff4d4d",
              border: "none",
              borderRadius: "6px",
              color: "white",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Logout
          </button>

          <a href="#" style={{ color: "white", fontSize: "1.2rem" }}>
            <FaTwitter />
          </a>
          <a href="#" style={{ color: "white", fontSize: "1.2rem" }}>
            <FaFacebookF />
          </a>
          <a href="#" style={{ color: "white", fontSize: "1.2rem" }}>
            <FaSnapchatGhost />
          </a>
          <a href="#" style={{ color: "white", fontSize: "1.2rem" }}>
            <FaInstagram />
          </a>
          <a href="#" style={{ color: "white", fontSize: "1.2rem" }}>
            <FaMediumM />
          </a>
        </div>
      </header>

      <div className="middle" style={{ padding: "20px" }}>
        <Outlet />
      </div>
    </div>
  );
};
