import  { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaClipboardList } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { fetchLogs } from "../../redux/log/logSlice";
import { FiLayout, FiSearch, FiClipboard } from "react-icons/fi";
export const Systemlog = () => {
  const dispatch = useDispatch();
  const { logs, loading } = useSelector((state) => state.log);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchLogs());
  }, [dispatch]);

  const filteredLogs = logs.filter(
    (log) =>
      log.user?.toLowerCase().includes(search.toLowerCase()) ||
      log.action?.toLowerCase().includes(search.toLowerCase()) ||
      log.description?.toLowerCase().includes(search.toLowerCase()),
  );

  // Badge Color System
  const getBadgeColor = (action) => {
    if (!action) return "bg-gray-500/20 text-gray-300";
    if (action.toLowerCase().includes("delete"))
      return "bg-red-500/20 text-red-400";
    if (action.toLowerCase().includes("update"))
      return "bg-blue-500/20 text-blue-400";
    if (action.toLowerCase().includes("create"))
      return "bg-green-500/20 text-green-400";
    return "bg-gray-500/20 text-gray-300";
  };

  return (
    <div className="pb-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text)] mb-2">
            System <span className="text-purple-400">Audits</span>
          </h1>
          <p className="text-[var(--muted)] text-sm max-w-md">
            Immutable operation ledger documenting administrative actions, security overrides, and system-level events.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-xs font-bold text-[var(--muted)]">
              <FiLayout size={14} className="text-purple-400" />
              {logs.length} EVENTS LOGGED
           </div>
        </div>
      </div>

      {/* SEARCH BAR LAYER */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-4 p-4 mb-8 bg-[#0d0f14]/50 border border-white/5 backdrop-blur-md rounded-3xl shadow-2xl items-center"
      >
        <div className="flex-1 relative group w-full">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)] group-focus-within:text-purple-400 transition-colors" />
          <input
            type="text"
            placeholder="Search taxonomy cache by user, action or payload..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-black/20 border border-white/5 text-sm text-gray-200 placeholder-gray-600 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none font-medium"
          />
        </div>
        
        <div className="px-4 py-3 rounded-2xl bg-white/5 text-[10px] font-bold text-purple-400 uppercase tracking-widest border border-purple-500/20 whitespace-nowrap">
           Real-time Monitoring Active
        </div>
      </motion.div>

      {/* LOGS PANEL */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-[#0d0f14]/30 backdrop-blur-xl border border-white/5 shadow-2xl overflow-hidden"
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
             <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
             <p className="text-xs font-bold text-gray-600 tracking-widest uppercase animate-pulse">Synchronizing Ledger...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="py-24 text-center">
             <FiClipboard size={48} className="mx-auto text-gray-700 mb-4" />
             <p className="text-[var(--muted)] font-medium">No operational records match the current criteria.</p>
          </div>
        ) : (
          <>
            {/* DESKTOP TABLE */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-white/5 text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest border-b border-white/5">
                    <th className="px-6 py-5">Sequence Time</th>
                    <th className="px-6 py-5">Initiating User</th>
                    <th className="px-6 py-5">Execution Action</th>
                    <th className="px-6 py-5">Transaction Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03] font-mono">
                  {filteredLogs.map((log, index) => (
                    <motion.tr
                      key={log._id || index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.01 }}
                      className="group hover:bg-white/[0.01] transition-colors"
                    >
                      <td className="px-6 py-5 text-[var(--muted)] text-xs">
                        {new Date(log.timestamp || log.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-5 font-bold text-purple-400 group-hover:text-purple-300 transition-colors">
                        {log.user}
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold border ${getBadgeColor(log.action)}`}>
                          {log.action?.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-[var(--muted)] group-hover:text-gray-300 transition-colors max-w-xs truncate" title={log.description}>
                        {log.description}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE VIEW */}
            <div className="lg:hidden p-4 space-y-4">
              {filteredLogs.map((log, index) => (
                <motion.div
                  key={log._id || index}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.02 }}
                  className="p-5 rounded-3xl bg-white/5 border border-white/5 shadow-lg space-y-3"
                >
                  <div className="flex items-center justify-between">
                     <p className="text-[10px] font-mono text-[var(--muted)]">
                        {new Date(log.timestamp || log.createdAt).toLocaleString()}
                     </p>
                     <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold border ${getBadgeColor(log.action)}`}>
                        {log.action?.toUpperCase()}
                     </span>
                  </div>

                  <p className="font-bold text-purple-400 text-sm">
                    @{log.user}
                  </p>

                  <p className="text-[var(--muted)] text-xs leading-relaxed">
                    {log.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

