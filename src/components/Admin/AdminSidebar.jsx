import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiLayout,
  FiUsers,
  FiGrid,
  FiShield,
  FiFileText,
  FiActivity,
  FiUser,
  FiX,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

export const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  const { user } = useAuth();
  const userId = user?._id || user?.id || "unknown";
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard", path: "/admin/admindashboard", icon: <FiLayout /> },
    { label: "Manage Users", path: "/admin/manageusers", icon: <FiUsers /> },
    { label: "Categories", path: "/admin/managecategories", icon: <FiGrid /> },
    { label: "Access Control", path: "/admin/accesscontrol", icon: <FiShield /> },
    { label: "Reports", path: "/admin/reportadmins", icon: <FiFileText /> },
    { label: "System Logs", path: "/admin/systemlogs", icon: <FiActivity /> },
    { label: "My Account", path: `/admin/account/${userId}`, icon: <FiUser /> },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.aside
        initial={false}
        animate={{ 
          width: isOpen ? 260 : 80,
          x: 0,
        }}
        className={`fixed top-0 left-0 h-screen z-[70] 
                   bg-[#0d0f14]/80 backdrop-blur-2xl border-r border-white/10
                   flex flex-col transition-shadow duration-300
                   ${isOpen ? "shadow-2xl shadow-cyan-500/5" : ""}
                   lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Header / Logo */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/5">
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="logo-full"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  <FiShield size={18} className="text-white" />
                </div>
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  FinTrack <span className="text-cyan-400">Admin</span>
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="logo-icon"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="mx-auto"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  <FiShield size={20} className="text-white" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile Close Button */}
          <button onClick={toggleSidebar} className="lg:hidden text-gray-400 hover:text-white transition">
            <FiX size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2 custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <motion.div
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200
                             ${isActive 
                               ? "bg-gradient-to-r from-cyan-500/20 to-blue-600/10 border border-cyan-500/30 text-white" 
                               : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
                >
                  <span className={`text-xl transition-colors duration-200 ${isActive ? "text-cyan-400" : "group-hover:text-cyan-300"}`}>
                    {item.icon}
                  </span>
                  
                  {isOpen && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm font-medium whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}

                  {isActive && isOpen && (
                    <motion.div 
                      layoutId="active-pill"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]"
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Footer / User Hub */}
        <div className="p-4 border-t border-white/5">
          <div className={`flex items-center gap-3 p-2 rounded-2xl bg-white/5 border border-white/5
                         ${!isOpen && "justify-center"}`}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 to-purple-700 flex items-center justify-center text-white font-bold text-sm shadow-inner">
              {user?.name?.charAt(0).toUpperCase() || "A"}
            </div>
            {isOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user?.name || "Admin"}</p>
                <p className="text-[10px] text-cyan-400/80 font-medium uppercase tracking-wider">System Administrator</p>
              </div>
            )}
          </div>
          
          {isOpen && (
             <div className="mt-4 px-2">
                <p className="text-[10px] text-gray-500 text-center">
                  © 2026 FinTrack • v2.4.0
                </p>
             </div>
          )}
        </div>

        {/* Desktop Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex absolute top-1/2 -right-3 w-6 h-6 rounded-full bg-cyan-500 
                     border border-white/10 shadow-lg shadow-cyan-500/30 items-center justify-center
                     text-white hover:bg-cyan-400 transition-colors z-[80]"
        >
          {isOpen ? <FiChevronLeft size={14} /> : <FiChevronRight size={14} />}
        </button>
      </motion.aside>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </>
  );
};

