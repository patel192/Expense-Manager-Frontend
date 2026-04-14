import  { useEffect, useState } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector, useDispatch } from "react-redux";
import { FaTrash, FaEye } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchUsers, deleteUser } from "../../redux/user/userSlice";
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
  // filter logic
  useEffect(() => {
    let filtered = [...users];

    if (search) {
      filtered = filtered.filter((u) =>
        u.name.toLowerCase().includes(search.toLowerCase()),
      );
    }
    if (roleFilter !== "all") {
      filtered = filtered.filter((u) => u.role === roleFilter);
    }
    setDisplayedUsers(filtered);
    setCurrentPage(1);
  }, [search, roleFilter, users]);

  // pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = displayedUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(displayedUsers.length / usersPerPage);

  // delete
  const handleDelete = async (userId) => {
    if (!window.confirm("Delete this user permanently?")) return;

    try {
      await dispatch(deleteUser(userId));

      toast.success("User deleted", {
        autoClose: 1800,
        style: {
          backgroundColor: "#16a34a",
          color: "white",
        },
      });
    } catch {
      toast.error("Error deleting user", {
        autoClose: 1800,
        style: {
          backgroundColor: "#dc2626",
          color: "white",
        },
      });
    }
  };

  return (
    <div className="pb-10">
      <ToastContainer theme="dark" transition={Bounce} />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
              User <span className="text-cyan-400">Registry</span>
            </h1>
            <p className="text-gray-400 text-sm max-w-md">
              Audit, moderate, and manage the system's user base with granular controls and real-time status updates.
            </p>
          </div>
          
          <div className="flex items-center gap-3 bg-white/5 border border-white/5 p-1.5 rounded-2xl">
             <div className="px-4 py-2 rounded-xl bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase tracking-widest border border-cyan-500/20">
                {displayedUsers.length} TOTAL RECORDS
             </div>
          </div>
        </div>

        {/* FILTER & SEARCH BAR */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-4 rounded-3xl bg-[#0d0f14]/50 border border-white/5 backdrop-blur-md shadow-2xl">
          <div className="md:col-span-2 relative group">
            <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
            <input
              type="text"
              placeholder="Query by name or identifier..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-black/20 border border-white/5 text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="relative">
            <select
              className="w-full py-3 px-4 rounded-2xl bg-black/20 border border-white/5 text-gray-300 focus:ring-2 focus:ring-purple-500/20 outline-none appearance-none cursor-pointer font-medium"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">Global Scope (All Roles)</option>
              <option value="Admin">Privileged (Admin)</option>
              <option value="Manager">Executive (Manager)</option>
              <option value="User">Standard (User)</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
               <motion.div animate={{ rotate: 90 }}>
                 <FiGrid size={12} />
               </motion.div>
            </div>
          </div>
        </div>

        {/* DATA REPRESENTATION */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
             <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
             <p className="text-sm font-semibold text-cyan-400/60 uppercase tracking-widest animate-pulse">Syncing Registry...</p>
          </div>
        ) : displayedUsers.length === 0 ? (
          <div className="py-24 text-center rounded-3xl bg-white/5 border border-dashed border-white/10">
             <FiUsers size={48} className="mx-auto text-gray-700 mb-4" />
             <p className="text-lg font-medium text-gray-500">No matching subjects found in the database.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block rounded-3xl overflow-hidden border border-white/5 bg-[#0d0f14]/30 backdrop-blur-xl shadow-2xl">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-white/5 text-gray-500 font-bold uppercase tracking-widest text-[10px] border-b border-white/5">
                    <th className="px-6 py-5">Full Name</th>
                    <th className="px-6 py-5">Metric (Age)</th>
                    <th className="px-6 py-5">Email Address</th>
                    <th className="px-6 py-5">Assigned Role</th>
                    <th className="px-6 py-5 text-center">Protocol Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/[0.03]">
                  {currentUsers.map((user, index) => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="group hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-5">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 border border-white/10 flex items-center justify-center text-white font-bold shadow-lg">
                               {user.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-semibold text-gray-200 group-hover:text-white transition">{user.name}</span>
                         </div>
                      </td>
                      <td className="px-6 py-5 font-mono text-gray-400">{user.age || "—"}</td>
                      <td className="px-6 py-5 text-gray-400">{user.email}</td>
                      <td className="px-6 py-5 text-gray-400">
                        <span className={`px-3 py-1 transparent rounded-lg text-[10px] font-bold border ${
                          user.role === "Admin"
                            ? "border-purple-500/30 bg-purple-500/10 text-purple-400"
                            : user.role === "Manager"
                              ? "border-blue-500/30 bg-blue-500/10 text-blue-400"
                              : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                        }`}>
                          {user.role?.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => navigate(`/admin/user/${user._id}`)}
                            className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-cyan-400 hover:bg-cyan-500 hover:text-white transition-all duration-300 shadow-lg"
                            title="Inspect Profile"
                          >
                            <FaEye size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-rose-400 hover:bg-rose-500 hover:text-white transition-all duration-300 shadow-lg"
                            title="Terminate Account"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
               {currentUsers.map((user, i) => (
                  <motion.div
                    key={user._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-5 rounded-3xl bg-white/5 border border-white/5 shadow-xl space-y-4"
                  >
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white font-bold text-lg">
                           {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                           <h4 className="font-bold text-white truncate">{user.name}</h4>
                           <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold border ${
                          user.role === "Admin" ? "border-purple-500/30 text-purple-400" : "border-cyan-500/30 text-cyan-400"
                        }`}>
                           {user.role?.toUpperCase()}
                        </span>
                     </div>
                     
                     <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5">
                        <button
                          onClick={() => navigate(`/admin/user/${user._id}`)}
                          className="flex-1 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold transition active:scale-95"
                        >
                          INSPECT
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="flex-1 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold transition active:scale-95"
                        >
                          TERMINATE
                        </button>
                     </div>
                  </motion.div>
               ))}
            </div>
          </>
        )}

        {/* PAGINATION ENGINE */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <div className="flex items-center gap-1 p-1 bg-white/5 rounded-2xl border border-white/5">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`min-w-[40px] h-10 rounded-xl text-xs font-bold transition-all duration-300
                    ${currentPage === i + 1
                      ? "bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                      : "text-gray-500 hover:text-white hover:bg-white/5"
                    }`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {String(i + 1).padStart(2, '0')}
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

