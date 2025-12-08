import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { logout } from "../Utils/Logout";
import {
  FaBars,
  FaTimes,
  FaArrowDown,
  FaTwitter,
  FaFacebookF,
  FaInstagram,
  FaGithub,
} from "react-icons/fa";

export const UserNavbar = ({ toggleSidebar }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-gray-900/70 border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
          {/* Left: Sidebar toggle + Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md hover:bg-white/10 hover:text-cyan-400 transition-all"
            >
              <FaBars size={22} />
            </button>

            <Link
              to="/"
              className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent hover:opacity-90 transition-all"
            >
              Trackit
            </Link>
          </div>

          {/* Right: Desktop menu */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex gap-4 text-gray-300 text-lg">
              <a
                href="#"
                className="hover:text-cyan-400 hover:scale-110 transition-transform"
              >
                <FaTwitter />
              </a>
              <a
                href="#"
                className="hover:text-blue-500 hover:scale-110 transition-transform"
              >
                <FaFacebookF />
              </a>
              <a
                href="#"
                className="hover:text-pink-500 hover:scale-110 transition-transform"
              >
                <FaInstagram />
              </a>
              <a
                href="https://github.com/patel192"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-100 hover:scale-110 transition-transform"
              >
                <FaGithub />
              </a>
            </div>

            <button
              onClick={logout}
              className="px-4 py-2 rounded-md bg-gradient-to-r from-red-500 to-pink-500 font-semibold text-white hover:shadow-lg hover:shadow-pink-500/30 transition-all"
            >
              Logout
            </button>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-white/10 transition-all"
          >
            {menuOpen ? <FaTimes size={20} /> : <FaArrowDown size={20} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden bg-gray-900/95 border-t border-white/10 shadow-lg">
            <div className="flex flex-col items-center px-6 py-4 space-y-4">
              <div className="flex gap-5 text-xl text-gray-300">
                <a href="#" className="hover:text-cyan-400 transition-all">
                  <FaTwitter />
                </a>
                <a href="#" className="hover:text-blue-500 transition-all">
                  <FaFacebookF />
                </a>
                <a href="#" className="hover:text-pink-500 transition-all">
                  <FaInstagram />
                </a>
                <a
                  href="https://github.com/patel192"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-100 transition-all"
                >
                  <FaGithub />
                </a>
              </div>

              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="w-full py-2 rounded-md bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold hover:shadow-lg hover:shadow-pink-500/30 transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Page content */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6">
        <Outlet />
      </main>
    </div>
  );
};
