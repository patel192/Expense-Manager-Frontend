import { useLocation, Outlet, Link } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiLogOut, FiMenu, FiX,
  FiTrendingUp, FiTrendingDown, FiPieChart,
  FiRepeat, FiTarget, FiBarChart2, FiList,
  FiSun, FiMoon,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const navTabs = [
  { label: "Overview",    path: "/private/userdashboard", icon: <FiBarChart2 size={17} /> },
  { label: "Income",      path: "/private/income",        icon: <FiTrendingUp size={17} /> },
  { label: "Expenses",    path: "/private/expenses",      icon: <FiTrendingDown size={17} /> },
  { label: "Recurring",   path: "/private/recurring",     icon: <FiRepeat size={17} /> },
  { label: "Budgets",     path: "/private/budget",        icon: <FiTarget size={17} /> },
  { label: "Reports",     path: "/private/reports",       icon: <FiPieChart size={17} /> },
  { label: "Transaction", path: "/private/transactions",  icon: <FiList size={17} /> },
];

const bottomTabs = [
  { label: "Overview",  path: "/private/userdashboard", icon: <FiBarChart2 size={20} /> },
  { label: "Income",    path: "/private/income",        icon: <FiTrendingUp size={20} /> },
  { label: "Expenses",  path: "/private/expenses",      icon: <FiTrendingDown size={20} /> },
  { label: "Budgets",   path: "/private/budget",        icon: <FiTarget size={20} /> },
  { label: "More",      path: null,                     icon: <FiMenu size={20} />, isMore: true },
];

export const UserDashboardLayout = () => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDark = theme === "dark";
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <div className="min-h-screen flex flex-col
                    bg-gray-50 dark:bg-[#0b0c10]
                    text-gray-900 dark:text-white
                    transition-colors duration-200">

      {/* ══ TOP NAVBAR ══ */}
      <header className="sticky top-0 z-50
                          bg-white/90 dark:bg-[#0d0f12]/90
                          backdrop-blur-xl
                          border-b border-gray-200 dark:border-white/10
                          shadow-sm dark:shadow-none
                          transition-colors duration-200">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">

          <Link to="/private/userdashboard" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600
                            flex items-center justify-center shadow-md shadow-cyan-500/20">
              <FiTrendingUp size={14} className="text-white" />
            </div>
            <span className="text-base font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
              FinTrack
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 flex-1 mx-6">
            {navTabs.map((tab, i) => {
              const isActive = location.pathname === tab.path;
              return (
                <div key={i} className="relative">
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-cyan-500/10 dark:bg-white/10 rounded-lg border border-cyan-500/20 dark:border-white/10"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <Link to={tab.path}
                    className={`relative flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg z-10 transition-colors duration-200
                      ${isActive
                        ? "text-cyan-600 dark:text-white font-medium"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      }`}>
                    {tab.icon}
                    <span className="hidden xl:inline">{tab.label}</span>
                  </Link>
                </div>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button onClick={() => setTheme(isDark ? "light" : "dark")}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/8 hover:text-gray-900 dark:hover:text-white transition-all">
              {isDark ? <FiSun size={17} /> : <FiMoon size={17} />}
            </button>

            <Link to={`/private/account/${user?._id || user?.id || ""}`}
              className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/8 transition-all group">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {userInitial}
              </div>
              <span className="hidden sm:block text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors max-w-[80px] truncate">
                {user?.name || "Account"}
              </span>
            </Link>

            <button onClick={logout}
              className="p-2 rounded-lg text-gray-400 dark:text-gray-500 hover:bg-red-50 dark:hover:bg-red-500/15 hover:text-red-500 dark:hover:text-red-400 transition-all">
              <FiLogOut size={17} />
            </button>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/8 transition-all">
              {mobileMenuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="lg:hidden overflow-hidden border-t border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d0f12]/98 backdrop-blur-2xl"
            >
              <div className="px-4 py-3 grid grid-cols-2 gap-1.5">
                {navTabs.map((tab, i) => {
                  const isActive = location.pathname === tab.path;
                  return (
                    <Link key={i} to={tab.path} onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all min-h-[44px]
                        ${isActive
                          ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/8 hover:text-gray-900 dark:hover:text-white"
                        }`}>
                      <span className={isActive ? "text-cyan-500" : ""}>{tab.icon}</span>
                      {tab.label}
                    </Link>
                  );
                })}
              </div>
              <div className="px-4 pb-3 pt-1 border-t border-gray-100 dark:border-white/8">
                <button onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all min-h-[44px]">
                  <FiLogOut size={17} /> Logout
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ══ MAIN CONTENT ══ */}
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 pb-24 lg:pb-8"
      >
        <Outlet />
      </motion.main>

      {/* ══ MOBILE BOTTOM NAV ══ */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50
                      bg-white/95 dark:bg-[#0d0f12]/95 backdrop-blur-xl
                      border-t border-gray-200 dark:border-white/10">
        <div className="flex items-center justify-around h-16 px-2">
          {bottomTabs.map((tab, i) => {
            const isActive = !tab.isMore && location.pathname === tab.path;
            const isMoreActive = tab.isMore && mobileMenuOpen;
            return (
              <button key={i}
                onClick={() => { if (tab.isMore) setMobileMenuOpen(!mobileMenuOpen); }}
                className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors duration-200 min-w-[44px]
                            ${isActive || isMoreActive ? "text-cyan-500 dark:text-cyan-400" : "text-gray-400 dark:text-gray-500"}`}
              >
                {tab.isMore ? (
                  <><span>{tab.icon}</span><span className="text-[10px] font-medium">More</span></>
                ) : (
                  <Link to={tab.path}
                    className={`flex flex-col items-center gap-1 w-full ${isActive ? "text-cyan-500 dark:text-cyan-400" : ""}`}>
                    <span className={`transition-transform duration-200 ${isActive ? "scale-110" : ""}`}>{tab.icon}</span>
                    <span className="text-[10px] font-medium">{tab.label}</span>
                  </Link>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};