import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";

export const Navbar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const links = [
    { label: "Home", to: "/" },
    { label: "Income", id: "income" },
    { label: "Expenses", id: "expenses" },
    { label: "Budgets", id: "budgets" },
    { label: "Reports", id: "reports" },
  ];

  const scrollToSection = (e, id) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      window.location.href = `/#${id}`;
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0d0f12]/80 backdrop-blur-xl border-b border-white/10">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-5 py-4">
        
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <img src="/expense-colored-icon-design-good-for-web-or-mobile-app-vector.jpg"
            className="h-9 w-9 rounded-md object-cover"
          />
          <span className="text-xl font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            FinTrack
          </span>
        </motion.div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-gray-300 font-medium">
          {links.map((link, i) =>
            link.id ? (
              <button
                key={i}
                onClick={(e) => scrollToSection(e, link.id)}
                className="hover:text-white transition-colors"
              >
                {link.label}
              </button>
            ) : (
              <Link key={i} to={link.to} className="hover:text-white transition-colors">
                {link.label}
              </Link>
            )
          )}

          <Link
            to="/login"
            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 transition"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-gray-300"
        >
          {open ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-[#0f1115] border-t border-white/10 p-5"
        >
          <div className="flex flex-col gap-4 text-gray-300">
            {links.map((link, i) =>
              link.id ? (
                <button
                  key={i}
                  onClick={(e) => scrollToSection(e, link.id)}
                  className="text-left py-2 hover:text-white"
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={i}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="py-2 hover:text-white"
                >
                  {link.label}
                </Link>
              )
            )}

            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-center"
            >
              Login
            </Link>

            <Link
              to="/signup"
              onClick={() => setOpen(false)}
              className="py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-center"
            >
              Sign Up
            </Link>
          </div>
        </motion.div>
      )}
    </header>
  );
};
