
import { Outlet, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FiBell, FiSearch, FiUser, FiLogOut } from "react-icons/fi";
import { logout } from "../Utils/Logout";

export const UserDashboardLayout = () => {
  const location = useLocation();

  const navTabs = [
    { label: "Overview", path: "/private/userdashboard" },
    { label: "Income", path: "/private/income" },
    { label: "Expenses", path: "/private/expenses" },
    { label: "Budgets", path: "/private/budget" },
    { label: "Reports", path: "/private/reports" },
    { label: "Transaction", path: "/private/transactions" },

  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0c0e12] via-[#0f1115] to-[#0b0c10] text-white flex flex-col">
      
      {/* ========== TOP NAVBAR ========== */}
      <header className="sticky top-0 z-50 bg-[#0d0f12]/80 backdrop-blur-xl border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">

          {/* LEFT SECTION: LOGO + TABS */}
          <div className="flex items-center gap-10">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <img
                src="/expense-colored-icon-design-good-for-web-or-mobile-app-vector.jpg"
                className="h-9 w-9 rounded-md object-cover"
                alt="Logo"
              />
              <span className="text-xl font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                FinTrack
              </span>
            </div>

            {/* Tabs */}
            <nav className="hidden md:flex items-center gap-6 text-gray-300">
              {navTabs.map((tab, index) => (
                <Link
                  key={index}
                  to={tab.path}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    location.pathname === tab.path
                      ? "bg-white/10 text-white"
                      : "hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {tab.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* RIGHT SECTION: SEARCH + ICONS */}
          <div className="flex items-center gap-4 text-gray-300">

            {/* Search */}
            <div className="hidden sm:flex items-center bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
              <FiSearch className="text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent text-sm text-gray-200 ml-2 focus:outline-none"
              />
            </div>

            {/* Notifications */}
            <button className="p-2 rounded-lg hover:bg-white/10 transition">
              <FiBell size={20} />
            </button>

            {/* Profile */}
            <button className="p-2 rounded-lg hover:bg-white/10 transition">
              <FiUser size={20} />
            </button>

            {/* Logout */}
            <button
              onClick={logout}
              className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition"
            >
              <FiLogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* ========== MAIN CONTENT ========== */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-6"
      >
        <Outlet />
      </motion.main>

    </div>
  );
};
