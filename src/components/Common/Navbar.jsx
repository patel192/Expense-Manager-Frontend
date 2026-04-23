import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX ,FiMoon,FiSun } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);

  // Shrink navbar slightly on scroll for a polished feel
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  // Close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

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

  const isHomeActive = location.pathname === "/";

  return (
    <header
      ref={menuRef}
      className={`sticky top-0 z-50 border-b border-[var(--border)] transition-all duration-300 ${
        scrolled
          ? "bg-[var(--bg)]/95 backdrop-blur-2xl py-0"
          : "bg-[var(--bg)]/80 backdrop-blur-xl"
      }`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3.5">
        {/* ── Logo ── */}
        <motion.div
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2.5 flex-shrink-0"
        >
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            {/* Inline SVG fallback — no broken image on mobile */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-4 h-4 text-[var(--text)]"
              stroke="currentColor"
              strokeWidth={2.2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8v1m0 9v1M5.05 5.05A9 9 0 1118.95 18.95"
              />
            </svg>
          </div>
          <span className="text-[1.1rem] font-semibold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            FinTrack
          </span>
        </motion.div>

        {/* ── Desktop Links ── */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="hidden md:flex items-center gap-1 text-sm font-medium"
        >
          {links.map((link, i) =>
            link.id ? (
              <button
                key={i}
                onClick={(e) => scrollToSection(e, link.id)}
                className="px-3 py-2 rounded-lg text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-secondary)] transition-all duration-200"
              >
                {link.label}
              </button>
            ) : (
              <Link
                key={i}
                to={link.to}
                className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                  isHomeActive
                    ? "text-[var(--text)] bg-[var(--surface-secondary)]"
                    : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-secondary)]"
                }`}
              >
                {link.label}
              </Link>
            ),
          )}

          {/* Divider */}
          <div className="w-px h-5 bg-[var(--border)] mx-2" />
          <button
            onClick={toggleTheme}
            className="
    px-3 py-2
    rounded-lg
    border
    border-[var(--border)]
    bg-[var(--card)]
    text-[var(--text)]
    hover:bg-[var(--muted)]
    transition
  "
          >
            {theme === "dark" ? <FiSun size={17} /> : <FiMoon size={17} />}
          </button>
          <Link
            to="/login"
            className="px-4 py-2 rounded-lg text-[var(--text-secondary)] bg-[var(--surface-secondary)] hover:bg-[var(--surface-tertiary)] border border-[var(--border)] hover:border-[var(--border)] transition-all duration-200"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-[var(--text)] font-medium hover:opacity-90 hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-200 ml-1"
          >
            Sign Up
          </Link>
        </motion.div>

        {/* ── Mobile: auth buttons + hamburger ── */}
        <div className="flex md:hidden items-center gap-2">
          <button
  onClick={toggleTheme}
  className="
    px-3 py-2
    rounded-lg
    border
    border-[var(--border)]
    bg-[var(--card)]
    text-[var(--text)]
    hover:bg-[var(--muted)]
    transition
  "
>
  {theme === "dark" ? "☀️" : "🌙"}
</button>
          <Link
            to="/login"
            className="px-3 py-1.5 text-sm rounded-lg text-[var(--text-secondary)]
bg-[var(--surface-secondary)]
hover:bg-[var(--surface-tertiary)] transition-all"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-3 py-1.5 text-sm rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-[var(--text)] font-medium hover:opacity-90 transition-all"
          >
            Sign Up
          </Link>
          {/* Hamburger — proper touch target */}
          <button
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="ml-1 p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-white/10 transition-all duration-200 min-w-[40px] min-h-[40px] flex items-center justify-center"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? "close" : "open"}
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.15 }}
              >
                {open ? <FiX size={20} /> : <FiMenu size={20} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </nav>

      {/* ── Mobile Dropdown Menu ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t border-[var(--border)] bg-[var(--bg)]/98 backdrop-blur-2xl"
          >
            <div className="px-4 py-3 flex flex-col">
              {/* Nav section label */}
              <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-medium px-2 mb-1">
                Navigate
              </p>

              {links.map((link, i) =>
                link.id ? (
                  <button
                    key={i}
                    onClick={(e) => scrollToSection(e, link.id)}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] text-sm font-medium transition-all text-left min-h-[44px]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/60 flex-shrink-0" />
                    {link.label}
                  </button>
                ) : (
                  <Link
                    key={i}
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all min-h-[44px] ${
                      isHomeActive
                        ? "text-cyan-400 bg-cyan-500/8"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isHomeActive ? "bg-cyan-400" : "bg-[var(--text-muted)]"}`}
                    />
                    {link.label}
                  </Link>
                ),
              )}

              {/* Divider */}
              <div className="my-3 border-t border-[var(--border)]" />

              {/* Auth section label */}
              <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-medium px-2 mb-1">
                Account
              </p>

              <div className="flex flex-col gap-2 pb-2">
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="w-full py-3 rounded-xl bg-[var(--surface-secondary)] hover:bg-[var(--surface-tertiary)] border border-[var(--border)] hover:border-[var(--border)] text-center text-sm font-medium text-[var(--text-secondary)] transition-all min-h-[44px] flex items-center justify-center"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setOpen(false)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-[var(--text)] text-center text-sm font-medium hover:opacity-90 transition-all min-h-[44px] flex items-center justify-center shadow-lg shadow-cyan-500/20"
                >
                  Sign Up — It's Free
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
