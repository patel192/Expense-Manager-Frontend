import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiBell, FiSearch, FiUser, FiLogOut } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
export const AdminDashboardLayout = () => {
  const {user,logout} = useAuth();
  const location = useLocation();
const navigate = useNavigate();
  // Admin Navigation Tabs
  const adminId = user?._id;
  const navTabs = [
    { label: "Dashboard", path: "/admin/admindashboard" },
    { label: "Manage Users", path: "/admin/manageusers" },
    { label: "Categories", path: "/admin/managecategories" },
    { label: "Access Control", path: "/admin/accesscontrol" },
    { label: "Reports", path: "/admin/reportadmins" },
    { label: "Logs", path: "/admin/systemlogs" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0c0e12] via-[#0f1115] to-[#0b0c10] text-white flex flex-col">
      {/* ========== ADMIN NAVBAR ========== */}
      <header className="sticky top-0 z-50 bg-[#0d0f12]/80 backdrop-blur-xl border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
          {/* LEFT: LOGO + TABS */}
          <div className="flex items-center gap-10">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <img
                src="/expense-colored-icon-design-good-for-web-or-mobile-app-vector.jpg"
                className="h-9 w-9 rounded-md object-cover"
                alt="Admin Logo"
              />
              <span className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                FinTrack | Admin
              </span>
            </div>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-6 text-gray-300">
              {navTabs.map((tab, i) => (
                <Link
                  key={i}
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

          {/* RIGHT: SEARCH + ICONS */}
          <div className="flex items-center gap-4 text-gray-300">
            {/* Search */}
            <div className="hidden sm:flex items-center bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
              <FiSearch className="text-gray-400" />
              <input
                type="text"
                placeholder="Search admin..."
                className="bg-transparent text-sm text-gray-200 ml-2 focus:outline-none"
              />
            </div>

            {/* Notifications */}
            <button className="p-2 rounded-lg hover:bg-white/10 transition">
              <FiBell size={20} />
            </button>

            {/* Admin Profile */}
            <button
              onClick={() => navigate(`/admin/account/${adminId}`)}
              className="p-2 rounded-lg hover:bg-white/10 transition"
              title="My Account"
            >
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
