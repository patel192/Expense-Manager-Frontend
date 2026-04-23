import  { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import { FiChevronLeft, FiShield } from "react-icons/fi";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers, deleteUser } from "../../redux/user/userSlice";
export const AccessControl = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const roleColors = {
    Admin: "from-cyan-400 to-blue-500 text-[var(--text-primary)]",
    User: "from-indigo-400 to-purple-500 text-[var(--text-primary)]",
    Manager: "from-emerald-400 to-teal-500 text-[var(--text-primary)]",
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole =
      filterRole === "All" || user.roleId?.name === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleDelete = async (userId) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await dispatch(deleteUser(userId));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
        <p className="text-xs font-bold text-cyan-500/60 uppercase tracking-widest animate-pulse">Syncing Permissions...</p>
      </div>
    );
  }

  return (
    <div className="pb-10">
      {/* ======= Header ======= */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] mb-2">
            Access <span className="text-cyan-400">Governance</span>
          </h1>
          <p className="text-[var(--text-secondary)] text-sm max-w-md">
            Manage system-wide permissions and security roles. Audit user clearance levels and active status.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-[var(--surface-secondary)] border border-[var(--border)] px-4 py-2 rounded-xl">
           <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
           <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Security Override Active</span>
        </div>
      </div>

      {/* ======= Filters Panel ======= */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-4 mb-8 bg-[var(--surface-primary)] border border-[var(--border)] backdrop-blur-md rounded-3xl shadow-2xl"
      >
        <div className="md:col-span-2 relative group">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-cyan-400 transition-colors" />
          <input
            type="text"
            placeholder="Search by identity or email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-[var(--surface-secondary)] border border-[var(--border)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all font-medium shadow-inner"
          />
        </div>

        <div className="relative">
          <select
            value={filterRole}
            onChange={(e) => {
              setFilterRole(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full py-3 px-4 rounded-2xl bg-[var(--surface-secondary)] border border-[var(--border)] text-[var(--text-secondary)] focus:ring-2 focus:ring-indigo-500/20 outline-none appearance-none cursor-pointer font-medium shadow-inner"
          >
            <option value="All" className="bg-[var(--surface-primary)]">All Clearance Levels</option>
            <option value="Admin" className="bg-[var(--surface-primary)]">Tier 1: Admin</option>
            <option value="Manager" className="bg-[var(--surface-primary)]">Tier 2: Manager</option>
            <option value="User" className="bg-[var(--surface-primary)]">Tier 3: Standard User</option>
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-muted)]">
             <FiChevronLeft className="rotate-[-90deg]" size={14} />
          </div>
        </div>
      </motion.div>

      {/* ======= User Cards Layout ======= */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {paginatedUsers.length > 0 ? (
          paginatedUsers.map((user, index) => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="group p-6 rounded-3xl bg-[var(--surface-primary)] border border-[var(--border)] backdrop-blur-md shadow-xl hover:bg-[var(--surface-secondary)] transition-all duration-300 border-t-2 border-t-[var(--border)] overflow-hidden relative"
            >
               {/* Accent Gradient */}
               <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${roleColors[user.roleId?.name]?.split(' ')[0] || "from-gray-500"} to-transparent opacity-[0.03] -mr-8 -mt-8 rounded-full blur-2xl group-hover:opacity-[0.08] transition-opacity`} />

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-4">
                   <div className="w-12 h-12 rounded-2xl bg-[var(--surface-tertiary)] border border-[var(--border)] flex items-center justify-center text-[var(--text-primary)] font-bold text-lg shadow-inner">
                      {user.name?.charAt(0).toUpperCase()}
                   </div>
                   <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[var(--text-primary)] text-lg truncate group-hover:text-cyan-400 transition-colors">
                        {user.name}
                      </h3>
                      <p className="text-[var(--text-muted)] text-xs truncate">{user.email}</p>
                   </div>
                </div>

                <div className="space-y-4 flex-1">
                   <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
                        user.roleId?.name === "Admin" ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400" : 
                        user.roleId?.name === "Manager" ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400" : 
                        "bg-[var(--surface-tertiary)] border-[var(--border)] text-[var(--text-muted)]"
                      }`}>
                         {user.roleId?.name || "UNASSIGNED"}
                      </span>
                      
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
                        user.is_active ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                      }`}>
                         {user.is_active ? "VERIFIED" : "RESTRICTED"}
                      </span>
                   </div>

                   <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-[var(--surface-secondary)] border border-[var(--border)]">
                      <div>
                         <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest mb-0.5">METRIC/AGE</p>
                         <p className="text-xs font-mono text-[var(--text-secondary)]">{user.age || "N/A"}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest mb-0.5">ENROLLED</p>
                         <p className="text-xs font-mono text-[var(--text-secondary)]">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</p>
                      </div>
                   </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 mt-6 pt-6 border-t border-[var(--border)] group-hover:border-[var(--text-muted)] transition-colors">
                  <button className="flex-1 py-2.5 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border)] hover:bg-[var(--surface-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all text-xs font-bold uppercase tracking-widest shadow-sm">
                    CONFIG
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="flex-1 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-[var(--text)] transition-all text-xs font-bold uppercase tracking-widest shadow-sm"
                  >
                    TERMINATE
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-24 text-center rounded-3xl bg-[var(--surface-secondary)] border border-dashed border-[var(--border)]">
             <FiShield size={48} className="mx-auto text-[var(--text-muted)] mb-4" />
             <p className="text-[var(--text-secondary)] font-medium">No subjects detected in current cache scope.</p>
          </div>
        )}
      </div>

      {/* ======= Pagination ======= */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-12 overflow-x-auto pb-2">
          <div className="flex items-center gap-1 p-1 bg-[var(--surface-secondary)] rounded-2xl border border-[var(--border)] shadow-lg">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`min-w-[40px] h-10 px-3 rounded-xl text-xs font-bold transition-all duration-300
                  ${currentPage === i + 1
                    ? "bg-cyan-500 text-[var(--text)] shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-tertiary)]"
                  }`}
              >
                {String(i + 1).padStart(2, '0')}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

