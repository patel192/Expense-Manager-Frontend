import React from "react";
import { Link, Outlet } from "react-router-dom";
export const Navbar = () => {
  return (
    <div>
      <header id="header">
        <nav class="nav">
         <div>

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
