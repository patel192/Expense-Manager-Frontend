import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiBell, FiSearch, FiMenu, FiLogOut, FiSettings } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { AdminSidebar } from "./AdminSidebar";

export const AdminDashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-[#08090d] text-gray-200 font-sans selection:bg-cyan-500/30">
      {/* Sidebar Component */}
      <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Wrapper */}
      <div 
        className={`transition-all duration-300 min-h-screen flex flex-col
                   ${isSidebarOpen ? "lg:pl-[260px]" : "lg:pl-[80px]"}`}
      >
        {/* ========== MODERN TOP NAVBAR ========== */}
        <header className="sticky top-0 z-[55] h-20 bg-[#0d0f14]/60 backdrop-blur-xl border-b border-white/5 flex items-center px-4 sm:px-8">
          <div className="flex-1 flex items-center justify-between gap-4">
            {/* Left: Mobile Toggle & Breadcrumbs */}
            <div className="flex items-center gap-4">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition lg:hidden"
              >
                <FiMenu size={20} className="text-gray-300" />
              </button>
              
              <div className="hidden sm:block">
                <h2 className="text-sm font-medium text-gray-400 capitalize">
                  Admin <span className="mx-2 text-gray-600">/</span> 
                  <span className="text-white">Workspace</span>
                </h2>
              </div>
            </div>

            {/* Middle: Search (Desktop) */}
            <div className="hidden md:flex flex-1 max-w-md mx-8 relative group">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
              <input
                type="text"
                placeholder="Search global records..."
                className="w-full bg-white/5 border border-white/5 rounded-2xl py-2.5 pl-11 pr-4 
                           text-sm text-gray-200 placeholder-gray-500 outline-none 
                           focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/30 transition-all font-medium"
              />
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Notifications */}
              <button className="relative p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition group">
                <FiBell size={20} className="text-gray-400 group-hover:text-white transition" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.5)] border-2 border-[#0d0f14]" />
              </button>

              {/* Settings */}
              <button 
                onClick={() => navigate(`/admin/account/${user?._id}`)}
                className="p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition group"
              >
                <FiSettings size={20} className="text-gray-400 group-hover:text-white transition" />
              </button>

              {/* Divider */}
              <div className="h-6 w-px bg-white/10 mx-1 sm:mx-2" />

              {/* Logout */}
              <button
                onClick={logout}
                className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl 
                           bg-rose-500/10 border border-rose-500/20 text-rose-400 
                           hover:bg-rose-500 hover:text-white transition-all duration-300 font-semibold text-xs sm:text-sm"
              >
                <FiLogOut size={16} />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </header>

        {/* ========== DYNAMIC MAIN CONTENT ========== */}
        <main className="flex-1 p-4 sm:p-8 lg:p-10">
          <div className="max-w-[1600px] mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={window.location.pathname}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-6 px-10 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-medium tracking-wide">
          <p>© 2026 FINTRACK ANALYTICS ENGINE. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-cyan-400 transition">SUPPORT</a>
            <a href="#" className="hover:text-cyan-400 transition">API DOCS</a>
            <a href="#" className="hover:text-cyan-400 transition">PRIVACY</a>
          </div>
        </footer>
      </div>
    </div>
  );
};

