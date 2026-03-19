import { useLocation } from "react-router-dom";
import { Outlet, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiBell, FiSearch, FiUser, FiLogOut } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
export const UserDashboardLayout = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const navTabs = [
    { label: "Overview", path: "/private/userdashboard" },
    { label: "Income", path: "/private/income" },
    { label: "Expenses", path: "/private/expenses" },
    { label: "Recurring", path: "/private/recurring" },
    { label: "Budgets", path: "/private/budget" },
    { label: "Reports", path: "/private/reports" },
    { label: "Transaction", path: "/private/transactions" },
  ];

  return (
    <div
      className="min-h-screen 
  bg-white dark:bg-gradient-to-b dark:from-[#0c0e12] dark:via-[#0f1115] dark:to-[#0b0c10] 
  text-black dark:text-white 
  flex flex-col"
    >
      {" "}
      {/* ========== TOP NAVBAR ========== */}
      <header
        className="sticky top-0 z-50 
  bg-white/80 dark:bg-[#0d0f12]/80 
  backdrop-blur-xl 
  border-b border-gray-200 dark:border-white/10 
  shadow-lg"
      >
        {" "}
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
            <nav className="hidden md:flex items-center gap-4 relative">
              {navTabs.map((tab, index) => {
                const isActive = location.pathname === tab.path;
                return (
                  <div key={index} className="relative">
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-white/10 rounded-lg"
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                    <Link
                      to={tab.path}
                      className={`relative px-4 py-2 text-sm z-10 ${
                        isActive
                          ? "text-white"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      {tab.label}
                    </Link>
                  </div>
                );
              })}
            </nav>
          </div>

          {/* RIGHT SECTION: SEARCH + ICONS */}
          <div className="flex items-center gap-4 text-gray-300">
            <button
              onClick={() => {
                console.log("clicked"); // debug
                setTheme(theme === "dark" ? "light" : "dark");
              }}
            >
              Toggle Theme
            </button>

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
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-6"
      >
        <Outlet />
      </motion.main>
    </div>
  );
};
