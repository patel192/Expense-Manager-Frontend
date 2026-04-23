import { useLocation, Outlet, Link } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiLogOut,
  FiMenu,
  FiX,
  FiTrendingUp,
  FiTrendingDown,
  FiPieChart,
  FiRepeat,
  FiTarget,
  FiBarChart2,
  FiList,
  FiSun,
  FiMoon,
  FiUser,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const navTabs = [
  { label: "Matrix", path: "/private/userdashboard", icon: <FiBarChart2 size={16} /> },
  { label: "Inflow", path: "/private/income", icon: <FiTrendingUp size={16} /> },
  { label: "Outflow", path: "/private/expenses", icon: <FiTrendingDown size={16} /> },
  { label: "Flows", path: "/private/recurring", icon: <FiRepeat size={16} /> },
  { label: "Budgets", path: "/private/budget", icon: <FiTarget size={16} /> },
  { label: "Reports", path: "/private/reports", icon: <FiPieChart size={16} /> },
  { label: "History", path: "/private/transactions", icon: <FiList size={16} /> },
];

const bottomTabs = [
  { label: "Matrix", path: "/private/userdashboard", icon: <FiBarChart2 size={18} /> },
  { label: "Inflow", path: "/private/income", icon: <FiTrendingUp size={18} /> },
  { label: "Outflow", path: "/private/expenses", icon: <FiTrendingDown size={18} /> },
  { label: "Budgets", path: "/private/budget", icon: <FiTarget size={18} /> },
  { label: "More", path: null, icon: <FiMenu size={18} />, isMore: true },
];

export const UserDashboardLayout = () => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <div className="min-h-screen flex flex-col bg-[var(--surface-secondary)]/50 text-[var(--text-primary)] font-sans antialiased">
      {/* ══ PARAMETRIC TOP NAV ══ */}
      <header className="sticky top-0 z-[60] bg-[var(--surface-primary)]/80 backdrop-blur-2xl border-b border-[var(--border)] shadow-xl transition-all duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-6">
          <Link to="/private/userdashboard" className="flex items-center gap-3.5 group flex-shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-xl shadow-cyan-500/20 group-hover:rotate-12 transition-all duration-300">
              <span className="font-black text-white text-xl">T</span>
            </div>
            <span className="text-xl font-black bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)] bg-clip-text text-transparent group-hover:from-cyan-500 group-hover:to-blue-600 transition-all duration-300 uppercase tracking-tighter">
              Trackit
            </span>
          </Link>

          {/* DESKTOP NAV MATRIX */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-[var(--surface-secondary)]/50 p-1.5 rounded-2xl border border-[var(--border)] shadow-inner">
            {navTabs.map((tab, i) => {
              const isActive = location.pathname === tab.path;
              return (
                <Link key={i} to={tab.path} className="relative group">
                  <div className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 z-10 relative
                    ${isActive ? "text-white" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"}`}>
                    {tab.icon}
                    <span>{tab.label}</span>
                  </div>
                  {isActive && (
                    <motion.div layoutId="activeTab" className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/20" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* COMMAND CENTER */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={toggleTheme} className="w-10 h-10 rounded-xl border border-[var(--border)] bg-[var(--surface-primary)] text-[var(--text-primary)] hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all flex items-center justify-center shadow-sm group">
              {theme === "dark" ? <FiSun size={18} className="group-hover:rotate-90 transition-transform duration-500" /> : <FiMoon size={18} className="group-hover:-rotate-12 transition-transform duration-500" />}
            </button>

            <Link to={`/private/account/${user?._id || user?.id || ""}`} className="flex items-center gap-3 pl-1 pr-1 py-1 rounded-2xl hover:bg-cyan-500/5 transition-all group border border-transparent hover:border-cyan-500/20 shadow-none hover:shadow-lg hover:shadow-cyan-500/5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 flex items-center justify-center border border-cyan-500/20 group-hover:border-cyan-500 transition-colors">
                <FiUser size={16} className="text-cyan-500" />
              </div>
              <span className="hidden xl:block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest max-w-[80px] truncate group-hover:text-cyan-500">
                {user?.name?.split(" ")[0] || "USER"}
              </span>
            </Link>

            <button onClick={logout} className="w-10 h-10 rounded-xl text-[var(--text-muted)] hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/30 border border-transparent transition-all flex items-center justify-center">
              <FiLogOut size={18} />
            </button>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center transition-all shadow-lg shadow-cyan-500/10">
              {mobileMenuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
            </button>
          </div>
        </div>

        {/* MOBILE OVERLAY MENU */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="lg:hidden absolute top-full left-0 w-full bg-[var(--surface-primary)] border-b border-[var(--border)] shadow-2xl overflow-hidden">
              <div className="p-6 grid grid-cols-2 gap-3 sm:gap-4">
                {navTabs.map((tab, i) => {
                  const isActive = location.pathname === tab.path;
                  return (
                    <Link key={i} to={tab.path} onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border shadow-sm
                        ${isActive ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white border-transparent shadow-lg shadow-cyan-500/20" : "bg-[var(--surface-secondary)]/50 text-[var(--text-muted)] border-[var(--border)] hover:bg-[var(--surface-tertiary)]"}`}>
                      {tab.icon}
                      {tab.label}
                    </Link>
                  );
                })}
              </div>
              <div className="px-6 pb-6 pt-4 border-t border-[var(--border)]/50 bg-[var(--surface-secondary)]/30">
                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-rose-500 bg-rose-500/5 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                  <FiLogOut size={16} /> EMERGENCY LOGOUT
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ══ APPLICATION CORE ══ */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 pb-32 lg:pb-12">
        <AnimatePresence mode="wait">
          <motion.div key={location.pathname} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4, ease: "circOut" }}>
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ══ DOCK NAVIGATION (MOBILE) ══ */}
      <nav className="lg:hidden fixed bottom-6 left-6 right-6 z-[60]">
        <div className="bg-[var(--surface-primary)]/80 backdrop-blur-2xl border border-[var(--border)] rounded-[2.5rem] shadow-2xl px-6 py-3 flex items-center justify-around">
          {bottomTabs.map((tab, i) => {
            const isActive = !tab.isMore && location.pathname === tab.path;
            const isMoreActive = tab.isMore && mobileMenuOpen;
            return (
              <button key={i} onClick={() => { if (tab.isMore) setMobileMenuOpen(!mobileMenuOpen); }} className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 min-w-[50px]
                            ${isActive || isMoreActive ? "text-cyan-500 scale-110" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"}`}>
                {tab.isMore ? (
                  <>
                    <div className={`p-2 rounded-xl ${isMoreActive ? "bg-cyan-500 text-white" : "bg-[var(--surface-secondary)]"}`}>{tab.icon}</div>
                    <span className="text-[8px] font-black uppercase tracking-widest mt-1">Protocal</span>
                  </>
                ) : (
                  <Link to={tab.path} className="flex flex-col items-center w-full">
                    <div className={`p-2 rounded-xl transition-all ${isActive ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20" : "bg-transparent group-hover:bg-[var(--surface-secondary)]"}`}>{tab.icon}</div>
                    <span className="text-[8px] font-black uppercase tracking-widest mt-1">{tab.label}</span>
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

export default UserDashboardLayout;
