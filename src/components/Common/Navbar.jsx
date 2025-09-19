import React from "react";
import { Link, Outlet } from "react-router-dom";
import { motion } from "framer-motion";

export const Navbar = () => {
  const navLinks = [
    { name: "Dashboard", to: "/" },
    { name: "Income", to: "/income" },
    { name: "Expenses", to: "/expenses" },
    { name: "Budgets", to: "/budgets" },
    { name: "Reports", to: "/reports" },
    { name: "Profile", to: "/profile" },
  ];

  return (
    <div>
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-gray-900 border-b border-gray-700 shadow-lg">
        <nav className="flex justify-between items-center max-w-7xl mx-auto px-6 py-4">
          {/* Logo Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3"
          >
            <img
              src="src/assets/Images/Expense Manager.png"
              alt="Logo"
              className="h-10 w-10 object-contain"
            />
            <span className="text-2xl font-extrabold text-white tracking-wide">
              FinTrack
            </span>
          </motion.div>

          {/* Links Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex gap-6 font-semibold text-gray-300"
          >
            {navLinks.map((link, idx) => (
              <Link
                key={idx}
                to={link.to}
                className="relative group transition"
              >
                <span className="transition-colors duration-200 group-hover:text-white">
                  {link.name}
                </span>
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </motion.div>
        </nav>
      </header>

      {/* Main Content */}
      <div className="p-6 bg-gradient-to-b from-gray-950 to-gray-900 min-h-screen text-white">
        <Outlet />
      </div>
    </div>
  );
};
