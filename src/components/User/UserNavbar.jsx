import { useState } from "react";
import { Link } from "react-router-dom";
import { logout } from "../Utils/Logout";
import {
  FaBars,
  FaTimes,
  FaChevronDown,
  FaTwitter,
  FaFacebookF,
  FaInstagram,
  FaGithub,
} from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

export const UserNavbar = ({ toggleSidebar }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[var(--surface-primary)]/80 border-b border-[var(--border)] shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 h-16">
        {/* Left: Sidebar toggle + Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-xl text-[var(--text-secondary)] hover:text-cyan-400 hover:bg-cyan-500/10 transition-all active:scale-95"
            aria-label="Toggle Sidebar"
          >
            <FaBars size={20} />
          </button>

          <Link
            to="/user/dashboard"
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 group-hover:rotate-6 transition-transform">
              <span className="font-bold text-lg">T</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)] bg-clip-text text-transparent group-hover:from-cyan-400 group-hover:to-blue-500 transition-all">
              Trackit
            </span>
          </Link>
        </div>

        {/* Right: Desktop menu */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex gap-5 text-[var(--text-muted)]">
            {[
              { icon: <FaTwitter />, color: "hover:text-cyan-400" },
              { icon: <FaFacebookF />, color: "hover:text-blue-500" },
              { icon: <FaInstagram />, color: "hover:text-pink-500" },
              { icon: <FaGithub />, color: "hover:text-[var(--text-primary)]" },
            ].map((social, i) => (
              <a
                key={i}
                href="#"
                className={`${social.color} transition-all hover:-translate-y-0.5`}
              >
                {social.icon}
              </a>
            ))}
          </div>

          <div className="h-6 w-px bg-[var(--border)]" />

          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--surface-tertiary)] border border-[var(--border)] text-sm font-semibold text-[var(--text-primary)] hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/30 transition-all active:scale-95 shadow-sm"
          >
            <FiLogOut size={16} />
            Logout
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--surface-tertiary)] transition-all active:scale-95"
        >
          {menuOpen ? <FaTimes size={20} /> : <FaChevronDown size={20} className={menuOpen ? "rotate-180" : ""} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[var(--surface-primary)] border-b border-[var(--border)] shadow-xl animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col items-center px-6 py-6 gap-6">
            <div className="flex gap-8 text-2xl text-[var(--text-muted)]">
              <a href="#" className="hover:text-cyan-400 transition-all"><FaTwitter /></a>
              <a href="#" className="hover:text-blue-500 transition-all"><FaFacebookF /></a>
              <a href="#" className="hover:text-pink-500 transition-all"><FaInstagram /></a>
              <a href="#" className="hover:text-[var(--text-primary)] transition-all"><FaGithub /></a>
            </div>

            <button
              onClick={() => {
                logout();
                setMenuOpen(false);
              }}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold shadow-lg shadow-rose-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <FiLogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
