import React from "react";
import { Link, Outlet } from "react-router-dom";
export const Navbar = ({ toggleSidebar }) => {
  return (
    <div>
      <header id="header">
        <nav class="nav">
          <div>
            <a href="#sidebar" class="toggle" onClick={toggleSidebar}>
              <i class="fa-solid fa-bars"></i>
            </a>
          </div>
          <div class="links">
            <Link to="/">Home</Link>
            <Link to="#">Contact</Link>
            <Link to="#">About</Link>
            <Link to="#">Features</Link>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </div>
        </nav>
      </header>
      <div className="content">
        <Outlet></Outlet>
      </div>

    </div>
  );
};
