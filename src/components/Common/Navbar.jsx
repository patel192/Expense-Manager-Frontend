import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";

export const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Dashboard", to: "/" },
    { name: "Income", id: "income" },
    { name: "Expenses", id: "expenses" },
    { name: "Budgets", id: "budgets" },
    { name: "Reports", id: "reports" },
  ];

  const handleScroll = (e, id) => {
    e.preventDefault();
    setIsOpen(false);
    if (location.pathname !== "/") {
      window.location.href = `/#${id}`;
    } else {
      const section = document.getElementById(id);
      if (section) section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div>
      <header className="sticky top-0 z-50 bg-gray-900 border-b border-gray-700 shadow-lg">
        <nav className="flex justify-between items-center max-w-7xl mx-auto px-6 py-4">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3"
          >
            <img
              src="/expense-colored-icon-design-good-for-web-or-mobile-app-vector.jpg"
              alt="Logo"
              className="h-10 w-10 object-contain"
            />
            <span className="text-2xl font-extrabold text-white tracking-wide">
              FinTrack
            </span>
          </motion.div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6 font-semibold text-gray-300">
            {navLinks.map((link, idx) =>
              link.id ? (
                <a
                  key={idx}
                  href={`#${link.id}`}
                  onClick={(e) => handleScroll(e, link.id)}
                  className="relative group transition cursor-pointer"
                >
                  <span className="transition-colors duration-200 group-hover:text-white">
                    {link.name}
                  </span>
                  <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300 group-hover:w-full"></span>
                </a>
              ) : (
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
              )
            )}

            <Link
              to="/login"
              className="px-3 py-1 rounded hover:bg-gray-800 transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700 transition"
            >
              Signup
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? (
                <FiX className="w-7 h-7 text-white" />
              ) : (
                <FiMenu className="w-7 h-7 text-white" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-gray-900 text-white px-6 py-4 border-t border-gray-700 shadow-lg"
          >
            <ul className="flex flex-col gap-4 font-semibold">
              {navLinks.map((link, idx) =>
                link.id ? (
                  <li key={idx}>
                    <a
                      href={`#${link.id}`}
                      onClick={(e) => handleScroll(e, link.id)}
                      className="block py-2 px-3 rounded hover:bg-gray-800 transition"
                    >
                      {link.name}
                    </a>
                  </li>
                ) : (
                  <li key={idx}>
                    <Link
                      to={link.to}
                      onClick={() => setIsOpen(false)}
                      className="block py-2 px-3 rounded hover:bg-gray-800 transition"
                    >
                      {link.name}
                    </Link>
                  </li>
                )
              )}

              <li>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block py-2 px-3 rounded hover:bg-gray-800 transition"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="block py-2 px-3 rounded bg-blue-600 hover:bg-blue-700 transition"
                >
                  Signup
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </header>

      <div className="p-6 bg-gradient-to-b from-gray-950 to-gray-900 min-h-screen text-white scroll-smooth">
        <Outlet />
      </div>
    </div>
  );
};
