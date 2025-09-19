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
    <div>
      {/* Navbar */}
      <header className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">
          
          {/* Left: Sidebar Toggle + Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md hover:bg-white hover:text-pink-600 transition-colors"
            >
              <FaBars size={22} />
            </button>

            <Link
              to="/"
              className="flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <strong className="text-lg font-bold tracking-wide">Trackit</strong>
              <span className="hidden sm:inline font-medium">| Expense App</span>
            </Link>
          </div>

          {/* Right: Logout + Social Icons */}
          <div className="flex items-center gap-4">
            <button
              onClick={logout}
              className="px-3 py-1 bg-white text-pink-600 hover:bg-pink-100 rounded-md text-sm font-semibold transition-colors shadow-sm"
            >
              Logout
            </button>

            <ul className="flex items-center gap-3">
              <li>
                <Link to="#" className="hover:text-blue-300 transition-colors">
                  <FaTwitter size={20} />
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-blue-800 transition-colors">
                  <FaFacebookF size={20} />
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-yellow-300 transition-colors">
                  <FaSnapchatGhost size={20} />
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-pink-300 transition-colors">
                  <FaInstagram size={20} />
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-green-300 transition-colors">
                  <FaMediumM size={20} />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="bg-auto min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};
