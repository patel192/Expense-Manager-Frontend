import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";

export const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navLinks = [
    { name: "Dashboard", to: "/" },
    { name: "Income", id: "income" },
    { name: "Expenses", id: "expenses" },
    { name: "Budgets", id: "budgets" },
    { name: "Reports", id: "reports" },
  ];

  // Add scroll shadow animation
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleScroll = (e, id) => {
    e.preventDefault();
    setIsOpen(false);

    if (location.pathname !== "/") {
      window.location.href = `/#${id}`;
      return;
    }

    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Navbar */}
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className={`fixed top-0 w-full z-50 backdrop-blur-md 
        ${scrolled ? "bg-gray-900/80 shadow-lg border-b border-gray-700/40" : "bg-transparent"} 
        transition-all duration-300`}
      >
        <nav className="flex justify-between items-center max-w-7xl mx-auto px-6 py-4">

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3"
          >
            <img
              src="/expense-colored-icon-design-good-for-web-or-mobile-app-vector.jpg"
              alt="Logo"
              className="h-10 w-10 object-contain rounded-lg"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
              FinTrack
            </span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 font-medium text-gray-300">
            {navLinks.map((link, idx) =>
              link.id ? (
                <button
                  key={idx}
                  onClick={(e) => handleScroll(e, link.id)}
                  className="relative group"
                >
                  <span className="transition text-gray-300 group-hover:text-white">
                    {link.name}
                  </span>
                  <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300 group-hover:w-full"></span>
                </button>
              ) : (
                <Link key={idx} to={link.to} className="relative group">
                  <span className="transition group-hover:text-white">
                    {link.name}
                  </span>
                  <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              )
            )}

            <Link
              to="/login"
              className="px-4 py-2 rounded-md hover:bg-gray-800/60 transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition shadow-md"
            >
              Signup
            </Link>
          </div>

          {/* Mobile Menu Icon */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FiX className="text-white w-7 h-7" /> : <FiMenu className="text-white w-7 h-7" />}
          </button>
        </nav>
      </motion.header>

      {/* Mobile Dropdown */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-gray-900/95 backdrop-blur-lg mt-[70px] px-6 py-6 shadow-lg border-b border-gray-800"
        >
          <ul className="flex flex-col gap-4 font-medium">
            {navLinks.map((link, idx) =>
              link.id ? (
                <li key={idx}>
                  <button
                    onClick={(e) => handleScroll(e, link.id)}
                    className="block w-full text-left py-3 px-3 rounded hover:bg-gray-800 transition"
                  >
                    {link.name}
                  </button>
                </li>
              ) : (
                <li key={idx}>
                  <Link
                    to={link.to}
                    onClick={() => setIsOpen(false)}
                    className="block py-3 px-3 rounded hover:bg-gray-800 transition"
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
                className="block py-3 px-3 rounded hover:bg-gray-800 transition"
              >
                Login
              </Link>
            </li>

            <li>
              <Link
                to="/signup"
                onClick={() => setIsOpen(false)}
                className="block py-3 px-3 bg-blue-600 hover:bg-blue-700 rounded transition"
              >
                Signup
              </Link>
            </li>
          </ul>
        </motion.div>
      )}
    </>
  );
};
