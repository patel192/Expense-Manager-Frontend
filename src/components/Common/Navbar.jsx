import React from "react";
import { Link, Outlet } from "react-router-dom";

export const Navbar = () => {
  return (
    <div>
      <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-lg">
        <nav className="flex justify-between items-center max-w-7xl mx-auto px-4 py-4 flex-row">
          {/* Logo Section */}
          <div className="flex items-center gap-3 w-1/3">
            <img
              src="src/assets/Images/Expense Manager.png"
              alt="Logo"
              className="h-10 w-10 object-contain drop-shadow-lg"
            />
            <span className="text-2xl font-extrabold text-white tracking-wide">
              MyWebsite
            </span>
          </div>

          {/* Links Section */}
          <div className="flex gap-6 text-gray-300 font-bold flex-row-reverse">
            <Link
              to="/"
              className="hover:text-white hover:underline underline-offset-4 transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              to="#"
              className="hover:text-white hover:underline underline-offset-4 transition-colors duration-200"
            >
              Contact
            </Link>
            <Link
              to="#"
              className="hover:text-white hover:underline underline-offset-4 transition-colors duration-200"
            >
              About
            </Link>
            <Link
              to="#"
              className="hover:text-white hover:underline underline-offset-4 transition-colors duration-200"
            >
              Features
            </Link>
            <Link
              to="/login"
              className="hover:text-white hover:underline underline-offset-4 transition-colors duration-200"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="hover:text-white hover:underline underline-offset-4 transition-colors duration-200"
            >
              Signup
            </Link>
          </div>
        </nav>
      </header>

      <div className="p-4 bg-gray-50 min-h-screen">
        <Outlet />
      </div>
    </div>
  );
};
