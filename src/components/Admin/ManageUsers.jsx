import { useEffect, useState } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector, useDispatch } from "react-redux";
import { FaTrash, FaEye } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { fetchUsers, deleteUser } from "../../redux/user/userSlice";
import { FiGrid, FiUsers, FiFilter, FiActivity, FiArrowLeft, FiArrowRight, FiUserCheck } from "react-icons/fi";

export const ManageUsers = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.user);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    setDisplayedUsers(users);
  }, [users]);

  // Command Filter Logic
  useEffect(() => {
    let filtered = [...users];

    if (search) {
      filtered = filtered.filter((u) =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (roleFilter !== "all") {
      filtered = filtered.filter((u) => u.role === roleFilter);
    }
    setDisplayedUsers(filtered);
    setCurrentPage(1);
  }, [search, roleFilter, users]);

  // Navigation Logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = displayedUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(displayedUsers.length / usersPerPage);

  // Archive Sequence
  const handleDelete = async (userId) => {
    if (!window.confirm("Commence permanent data deletion for this entity?")) return;

    try {
      await dispatch(deleteUser(userId));
      toast.success("ENTRY ARCHIVED", {
        autoClose: 1800,
        style: {
          backgroundColor: "#10b981",
          color: "white",
          fontWeight: "900",
          borderRadius: "1rem",
        },
      });
    } catch {
      toast.error("PROTOCOL FAILURE", {
        autoClose: 1800,
        style: {
          backgroundColor: "#f43f5e",
          color: "white",
          fontWeight: "900",
          borderRadius: "1rem",
        },
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-10 space-y-10 text-[var(--text-primary)]"
    >
      <ToastContainer theme="dark" transition={Bounce} />

      {/* ══ REGISTRY HEADER ══ */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)] bg-clip-text text-transparent uppercase tracking-tighter">
            User Registry
          </h1>
          <p className="text-sm font-bold text-[var(--text-muted)] mt-1 uppercase tracking-[0.2em]">
            Central Entity Access & Vector Management
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 text-[10px] font-black uppercase tracking-widest shadow-sm flex items-center gap-3">
            <FiActivity size={12} className="animate-pulse" />
            {displayedUsers.length} DATA NODES ACTIVE
          </div>
        </div>
      </div>

      {/* ── COMMAND HUB (SEARCH & FILTER) ── */}
      <div className="relative overflow-hidden p-8 sm:p-10 rounded-[2.5rem] bg-[var(--surface-primary)] border border-[var(--border)] shadow-2xl group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 blur-[100px] pointer-events-none" />
        
        <div className="relative grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 relative group w-full">
            <IoSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-cyan-500 transition-colors z-10" />
            <input
              type="text"
              placeholder="Query registry by entity name or comm signature..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-4 py-4 rounded-2xl bg-[var(--surface-secondary)]/50 border border-[var(--border)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/5 transition-all duration-300 font-bold tracking-tight"
            />
          </div>
          
          <div className="relative group">
            <FiFilter className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-indigo-500 transition-colors z-10 pointer-events-none" />
            <select
              className="w-full pl-14 pr-10 py-4 rounded-2xl bg-[var(--surface-secondary)]/50 border border-[var(--border)] text-xs font-black uppercase tracking-widest text-[var(--text-primary)] focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 appearance-none cursor-pointer transition-all duration-300"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">GLOBAL PERSPECTIVE</option>
              <option value="Admin">ADMIN OVERRIDE</option>
              <option value="Manager">EXECUTIVE ACCESS</option>
              <option value="Standard">STANDARD NODE</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── ENTITY MATRIX ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="rounded-[2.5rem] bg-[var(--surface-primary)] border border-[var(--border)] shadow-2xl overflow-hidden backdrop-blur-md"
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <div className="w-12 h-12 rounded-2xl border-4 border-cyan-500/10 border-t-cyan-500 animate-spin" />
            <div className="space-y-1 text-center">
              <p className="text-xs font-black text-[var(--text-primary)] uppercase tracking-widest animate-pulse">Synchronizing Nodes...</p>
              <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Querying Distributed Registry</p>
            </div>
          </div>
        ) : displayedUsers.length === 0 ? (
          <div className="py-32 text-center space-y-4">
            <div className="w-20 h-20 rounded-[2.5rem] bg-[var(--surface-secondary)] border border-[var(--border)] flex items-center justify-center mx-auto shadow-inner">
              <FiUsers size={40} className="text-[var(--text-muted)] opacity-20" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-black text-[var(--text-primary)] uppercase tracking-widest">No entities detected</p>
              <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Broaden your search parameters.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[var(--surface-secondary)]/50 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] border-b border-[var(--border)]">
                    <th className="px-8 py-6">Identity Vector</th>
                    <th className="px-8 py-6">Metric (Age)</th>
                    <th className="px-8 py-6">Comm Signature</th>
                    <th className="px-8 py-6">Privilege Level</th>
                    <th className="px-8 py-6 text-center">Operational Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  <AnimatePresence>
                    {currentUsers.map((user, index) => (
                      <motion.tr
                        key={user._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className="group hover:bg-cyan-500/5 transition-all duration-300"
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-[var(--surface-secondary)] border border-[var(--border)] flex items-center justify-center font-black text-xs text-cyan-500 shadow-inner group-hover:border-cyan-500/50 transition-colors">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-black text-[var(--text-primary)] uppercase tracking-tighter group-hover:text-cyan-500 transition-colors">
                              {user.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6 font-mono text-xs font-bold text-[var(--text-muted)]">
                          {user.age || "--"} YRS
                        </td>
                        <td className="px-8 py-6 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider group-hover:text-[var(--text-secondary)] transition-colors">
                          {user.email}
                        </td>
                        <td className="px-8 py-6">
                          <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black border uppercase tracking-widest shadow-sm ${
                            user.role === "Admin"
                              ? "bg-violet-500/10 border-violet-500/20 text-violet-500"
                              : user.role === "Manager"
                                ? "bg-blue-500/10 border-blue-500/20 text-blue-500"
                                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex justify-center gap-3">
                            <button
                              onClick={() => navigate(`/admin/user/${user._id}`)}
                              className="w-10 h-10 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border)] text-cyan-500 hover:bg-cyan-500 hover:text-white transition-all shadow-sm flex items-center justify-center active:scale-90"
                              title="INSPECT VECTOR"
                            >
                              <FaEye size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(user._id)}
                              className="w-10 h-10 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border)] text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm flex items-center justify-center active:scale-90"
                              title="ARCHIVE ENTITY"
                            >
                              <FaTrash size={14} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* RESPONSIVE ENTITIES (MOBILE) */}
            <div className="lg:hidden p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentUsers.map((user, i) => (
                <motion.div
                  key={user._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-8 rounded-[2.5rem] bg-[var(--surface-secondary)]/30 border border-[var(--border)] shadow-xl space-y-6 relative overflow-hidden group"
                >
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-500/5 blur-[50px] pointer-events-none group-hover:scale-150 transition-transform duration-700" />
                  
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-[var(--surface-primary)] border border-[var(--border)] flex items-center justify-center text-cyan-500 font-black text-xl shadow-inner">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-[var(--text-primary)] uppercase tracking-tighter truncate">{user.name}</h4>
                      <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest truncate">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-[var(--border)]">
                    <span className={`px-3 py-1 rounded-lg text-[8px] font-black border uppercase tracking-widest ${
                      user.role === "Admin" ? "bg-violet-500/10 border-violet-500/20 text-violet-500" : "bg-cyan-500/10 border-cyan-500/20 text-cyan-500"
                    }`}>
                      {user.role} ACCESS
                    </span>
                    <div className="flex gap-2">
                       <button onClick={() => navigate(`/admin/user/${user._id}`)} className="p-3 rounded-xl bg-cyan-500 text-white shadow-lg shadow-cyan-500/20 active:scale-90 transition-all"><FaEye size={14}/></button>
                       <button onClick={() => handleDelete(user._id)} className="p-3 rounded-xl bg-rose-500 text-white shadow-lg shadow-rose-500/20 active:scale-90 transition-all"><FaTrash size={14}/></button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </motion.div>

      {/* ── NAVIGATION ENGINE ── */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-10">
          <div className="flex items-center gap-2 p-2 bg-[var(--surface-primary)] rounded-3xl border border-[var(--border)] shadow-2xl">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--surface-secondary)] disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              <FiArrowLeft size={18} />
            </button>
            
            <div className="flex items-center gap-1.5 px-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`min-w-[44px] h-11 rounded-2xl text-[10px] font-black transition-all duration-500
                    ${currentPage === i + 1
                      ? "bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30 active:scale-95"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]"
                    }`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {String(i + 1).padStart(2, '0')}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--surface-secondary)] disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              <FiArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

