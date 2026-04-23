import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { fetchLogs } from "../../redux/log/logSlice";
import { FiLayout, FiSearch, FiClipboard, FiClock, FiActivity, FiShield, FiRefreshCw } from "react-icons/fi";

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

  // Badge Color Protocol
  const getBadgeColor = (action) => {
    if (!action) return "bg-gray-500/10 border-gray-500/20 text-gray-500";
    const act = action.toLowerCase();
    if (act.includes("delete")) return "bg-rose-500/10 border-rose-500/20 text-rose-500";
    if (act.includes("update")) return "bg-cyan-500/10 border-cyan-500/20 text-cyan-500";
    if (act.includes("create")) return "bg-emerald-500/10 border-emerald-500/20 text-emerald-500";
    return "bg-violet-500/10 border-violet-500/20 text-violet-500";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-10 space-y-8 text-[var(--text-primary)]"
    >
      {/* ══ AUDIT HEADER ══ */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)] bg-clip-text text-transparent uppercase tracking-tighter">
            Operational Ledger
          </h1>
          <p className="text-sm font-bold text-[var(--text-muted)] mt-1 uppercase tracking-[0.2em]">
            Immutable Transactional Integrity Audit
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl border bg-violet-500/10 border-violet-500/20 text-violet-500 text-[10px] font-black uppercase tracking-widest shadow-sm flex items-center gap-3">
            <FiShield size={12} className="animate-pulse" />
            {logs.length} AUDIT NODES
          </div>
        </div>
      </div>

      {/* ── COMMAND OVERRIDE (SEARCH) ── */}
      <div className="relative overflow-hidden p-8 sm:p-10 rounded-[2.5rem] bg-[var(--surface-primary)] border border-[var(--border)] shadow-2xl group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/5 blur-[100px] pointer-events-none" />
        
        <div className="relative flex flex-col lg:flex-row items-center gap-6">
          <div className="flex-1 relative group w-full">
            <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-violet-500 transition-colors z-10" />
            <input
              type="text"
              placeholder="Search taxonomy cache by user, action or payload signature..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-4 py-4 rounded-2xl bg-[var(--surface-secondary)]/50 border border-[var(--border)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/5 transition-all duration-300 font-bold tracking-tight"
            />
          </div>
          <div className="px-6 py-4 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-[10px] font-black text-violet-500 uppercase tracking-[0.2em] whitespace-nowrap shadow-inner flex items-center gap-3">
            <FiActivity size={14} />
            REAL-TIME MONITORING ACTIVE
          </div>
        </div>
      </div>

      {/* ── CENTRAL LEDGER ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="rounded-[2.5rem] bg-[var(--surface-primary)] border border-[var(--border)] shadow-2xl overflow-hidden backdrop-blur-md"
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <div className="w-12 h-12 rounded-2xl border-4 border-violet-500/10 border-t-violet-500 animate-spin" />
            <div className="space-y-1 text-center">
              <p className="text-xs font-black text-[var(--text-primary)] uppercase tracking-widest animate-pulse">Synchronizing Ledger...</p>
              <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Compiling Historical Telemetry</p>
            </div>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="py-32 text-center space-y-4">
            <div className="w-20 h-20 rounded-[2.5rem] bg-[var(--surface-secondary)] border border-[var(--border)] flex items-center justify-center mx-auto shadow-inner">
              <FiClipboard size={40} className="text-[var(--text-muted)] opacity-20" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-black text-[var(--text-primary)] uppercase tracking-widest">No match in registry</p>
              <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Modify taxonomy filters to access data nodes.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[var(--surface-secondary)]/50 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] border-b border-[var(--border)]">
                    <th className="px-8 py-6">Timestamp Sequence</th>
                    <th className="px-8 py-6">Operational Actor</th>
                    <th className="px-8 py-6">Interaction Vector</th>
                    <th className="px-8 py-6">Transaction Signature</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  <AnimatePresence>
                    {filteredLogs.map((log, index) => (
                      <motion.tr
                        key={log._id || index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.01 }}
                        className="group hover:bg-violet-500/5 transition-all duration-300"
                      >
                        <td className="px-8 py-6 font-mono text-[11px] font-bold text-[var(--text-muted)] group-hover:text-violet-500 transition-colors">
                          <div className="flex items-center gap-3">
                            <FiClock size={12} className="opacity-50" />
                            {new Date(log.timestamp || log.createdAt).toLocaleString()}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border)] flex items-center justify-center font-black text-[10px] text-violet-500 shadow-inner group-hover:border-violet-500/50 transition-colors">
                              {log.user?.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-xs font-black text-[var(--text-primary)] uppercase tracking-tighter">
                              {log.user}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black border uppercase tracking-widest shadow-sm ${getBadgeColor(log.action)}`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-xs font-bold text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors max-w-sm truncate" title={log.description}>
                          {log.description}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* RESPONSIVE VECTOR STACK (MOBILE) */}
            <div className="lg:hidden p-6 space-y-6">
              {filteredLogs.map((log, index) => (
                <motion.div
                  key={log._id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-8 rounded-[2rem] bg-[var(--surface-secondary)]/30 border border-[var(--border)] shadow-xl relative overflow-hidden active:scale-[0.98] transition-all"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <FiShield size={48} />
                  </div>
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <p className="text-[10px] font-black font-mono text-violet-500 uppercase tracking-widest">
                      {new Date(log.timestamp || log.createdAt).toLocaleString()}
                    </p>
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black border uppercase tracking-widest ${getBadgeColor(log.action)}`}>
                      {log.action}
                    </span>
                  </div>
                  <h4 className="font-black text-[var(--text-primary)] text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-violet-500/20 flex items-center justify-center">
                      <FiUser size={12} className="text-violet-500" />
                    </div>
                    {log.user}
                  </h4>
                  <p className="text-[var(--text-muted)] text-[11px] font-bold leading-relaxed uppercase tracking-widest">
                    {log.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

