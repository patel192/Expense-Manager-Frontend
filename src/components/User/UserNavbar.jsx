import React from "react";
import { Outlet, Link } from "react-router-dom";
import { logout } from "../Utils/Logout";
import {
  FaTwitter,
  FaFacebookF,
  FaSnapchatGhost,
  FaInstagram,
  FaMediumM,
  FaBars,
} from "react-icons/fa";

export const UserNavbar = ({ toggleSidebar }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/10 border-b border-white/10 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          {/* Left: Sidebar Toggle + Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md hover:bg-white/20 hover:text-pink-500 transition-all"
            >
              <FaBars size={22} />
            </button>

            <Link
              to="/"
              className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent hover:scale-105 transition-transform"
            >
              Trackit | Expense App
            </Link>
          </div>

          {/* Right Side: Logout + Socials */}
          <div className="flex items-center gap-5">
            <button
              onClick={logout}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200"
            >
              Logout
            </button>

            <div className="flex gap-4 text-xl">
              <a
                href="#"
                className="hover:text-blue-400 hover:scale-110 transition-transform"
              >
                <FaTwitter />
              </a>
              <a
                href="#"
                className="hover:text-blue-600 hover:scale-110 transition-transform"
              >
                <FaFacebookF />
              </a>
              <a
                href="#"
                className="hover:text-yellow-400 hover:scale-110 transition-transform"
              >
                <FaSnapchatGhost />
              </a>
              <a
                href="#"
                className="hover:text-pink-500 hover:scale-110 transition-transform"
              >
                <FaInstagram />
              </a>
              <a
                href="#"
                className="hover:text-green-400 hover:scale-110 transition-transform"
              >
                <FaMediumM />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
};
