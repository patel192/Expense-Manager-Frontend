import React from "react";
import { Link, Outlet } from "react-router-dom";
import { motion } from "framer-motion";

export const Navbar = () => {
  const navLinks = [
    { name: "Home", to: "/" },
    { name: "Features", to: "#" },
    { name: "About", to: "#" },
    { name: "Contact", to: "#" },
    { name: "Login", to: "/login" },
    { name: "Signup", to: "/signup" },
  ];

  return (
    <div>
      {/* Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/10 border-b border-white/20 shadow-lg">
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
              className="h-10 w-10 object-contain drop-shadow-lg"
            />
            <span className="text-2xl font-extrabold text-white tracking-wide">
              MyWebsite
            </span>
          </motion.div>

          {/* Links Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex gap-6 font-semibold text-gray-200"
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
                {/* Underline animation */}
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </motion.div>
        </nav>
      </header>

      {/* Main Content Wrapper */}
      <div className="p-6 bg-gradient-to-b from-gray-900 to-gray-950 min-h-screen text-white">
        <Outlet />
      </div>
    </div>
  );
};
