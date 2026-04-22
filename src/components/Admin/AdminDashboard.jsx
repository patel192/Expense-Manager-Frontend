// AdminDashboard.jsx
import  { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers } from "../../redux/user/userSlice";
import { fetchAllTransactions } from "../../redux/transaction/transactionSlice";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiUsers, 
  FiShield, 
  FiActivity, 
  FiLayout, 
  FiTrendingUp, 
  FiTrendingDown, 
  FiGrid, 
  FiSearch, 
  FiFilter,
  FiPieChart,
  FiBarChart2,
  FiCalendar,
  FiDatabase
} from "react-icons/fi";

export const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { users, loading: userLoading } = useSelector((state) => state.user);
  const { transactions, summary, loading: txLoading } = useSelector((state) => state.transaction);

  const [txSearch, setTxSearch] = useState("");
  const [filterType, setFilterType] = useState("All"); // All, Income, Expense
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const loadingDashboard = userLoading || txLoading;

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchAllTransactions());
  }, [dispatch]);

  // --- DATA AGGREGATION ---

  // User Acquisition Monthly
  const userGrowthData = useMemo(() => {
    const monthly = {};
    const monthsOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    (users || []).forEach(u => {
      const m = new Date(u.createdAt).toLocaleString("default", { month: "short" });
      monthly[m] = (monthly[m] || 0) + 1;
    });

    return monthsOrder.map(m => ({ name: m, users: monthly[m] || 0 }));
  }, [users]);

  // Roles distribution
  const roleDistribution = useMemo(() => [
    { name: "Admins", value: (users || []).filter(u => u.role === "Admin").length },
    { name: "Users", value: (users || []).filter(u => u.role !== "Admin").length },
  ], [users]);

  // Global Category Breakdown (Across all users)
  const categoryData = useMemo(() => {
    const counts = {};
    transactions.filter(t => t.type === "Expense").forEach(t => {
      const catName = t.categoryID?.name || "Uncategorized";
      counts[catName] = (counts[catName] || 0) + (t.amount || 0);
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [transactions]);

  // Financial Trend (Income vs Expenses Monthly)
  const financialTrend = useMemo(() => {
    const trend = {};
    const monthsOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    transactions.forEach(t => {
      const m = new Date(t.createdAt).toLocaleString("default", { month: "short" });
      if (!trend[m]) trend[m] = { income: 0, expense: 0 };
      if (t.type === "Income") trend[m].income += t.amount || 0;
      else trend[m].expense += t.amount || 0;
    });

    return monthsOrder.map(m => ({ 
      name: m, 
      income: trend[m]?.income || 0, 
      expense: trend[m]?.expense || 0 
    }));
  }, [transactions]);

  // Filtered Ledger
  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchesSearch = 
        tx.userID?.name?.toLowerCase().includes(txSearch.toLowerCase()) || 
        tx.categoryID?.name?.toLowerCase().includes(txSearch.toLowerCase()) ||
        tx.description?.toLowerCase().includes(txSearch.toLowerCase());
      
      const matchesType = filterType === "All" || tx.type === filterType;
      
      return matchesSearch && matchesType;
    });
  }, [transactions, txSearch, filterType]);

  const COLORS = ["#22d3ee", "#6366f1", "#10b981", "#f59e0b", "#f43f5e"];

  if (loadingDashboard) return <DashboardSkeleton />;

  return (
    <div className="space-y-10 pb-20">
      {/* ---------- HEADER ---------- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text)] mb-2">
            System <span className="text-cyan-400">Intelligence</span>
          </h1>
          <p className="text-[var(--muted)] text-sm max-w-md leading-relaxed">
            Real-time infrastructure overview, system-wide financial flow, and operational audit trail.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-bold text-cyan-400 tracking-widest flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            LIVE SYSTEM FEED
          </div>
        </div>
      </div>

      {/* ---------- CORE SYSTEM PILLARS (KPIs) ---------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Registrations", value: users.length, icon: <FiUsers />, color: "from-cyan-500/10 to-blue-600/5", accent: "text-cyan-400" },
          { label: "Active Transactions", value: transactions.length, icon: <FiActivity />, color: "from-indigo-500/10 to-purple-600/5", accent: "text-indigo-400" },
          { label: "System Health", value: "99.9%", icon: <FiLayout />, color: "from-emerald-500/10 to-teal-600/5", accent: "text-emerald-400" },
          { label: "Database Latency", value: "24ms", icon: <FiDatabase />, color: "from-rose-500/10 to-orange-600/5", accent: "text-rose-400" },
        ].map((kpi, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5 }}
            className={`p-6 rounded-[2rem] bg-gradient-to-br ${kpi.color} border border-white/5 relative group overflow-hidden`}
          >
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 bg-white/5 border border-white/5 ${kpi.accent}`}>
               {kpi.icon}
            </div>
            <p className="text-xs font-bold text-[var(--muted)] uppercase tracking-widest mb-1">{kpi.label}</p>
            <h3 className="text-3xl font-bold text-[var(--text)]">{kpi.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* ---------- FINANCIAL SYSTEM ANALYSIS ---------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Financial Flow Summary Cards */}
        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
           {[
             { label: "System Inflow", value: summary.totalIncome, icon: <FiTrendingUp />, color: "text-emerald-400", bg: "bg-emerald-500/10" },
             { label: "System Outflow", value: summary.totalExpense, icon: <FiTrendingDown />, color: "text-rose-400", bg: "bg-rose-500/10" },
             { label: "Net Infrastructure Flow", value: summary.balance, icon: <FiActivity />, color: "text-cyan-400", bg: "bg-cyan-500/10" },
           ].map((card, i) => (
             <div key={i} className="p-6 rounded-3xl bg-[#0d0f14]/80 border border-white/5 backdrop-blur-md flex items-center gap-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl ${card.bg} ${card.color} border border-white/5 shadow-xl`}>
                   {card.icon}
                </div>
                <div>
                   <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mb-1">{card.label}</p>
                   <h4 className="text-2xl font-bold text-[var(--text)]">₹{card.value.toLocaleString()}</h4>
                </div>
             </div>
           ))}
        </div>

        {/* Global Finance Trend Chart */}
        <div className="lg:col-span-8 p-8 rounded-[2.5rem] bg-[#0d0f14]/50 border border-white/5 backdrop-blur-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-10">
             <div>
                <h3 className="text-lg font-bold text-[var(--text)] flex items-center gap-2">
                   <FiBarChart2 className="text-cyan-400" />
                   System-wide Fiscal Trend
                </h3>
                <p className="text-xs text-[var(--muted)] mt-1">Cross-platform revenue vs expenditure metrics</p>
             </div>
          </div>
          <div className="h-[350px] w-full">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={financialTrend}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: "#4b5563", fontSize: 11}} dy={10} />
                   <YAxis axisLine={false} tickLine={false} tick={{fill: "#4b5563", fontSize: 11}} tickFormatter={(v) => `₹${v/1000}k`} />
                   <Tooltip 
                     cursor={{fill: "#ffffff05"}}
                     contentStyle={{ background: "#0d0f14", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
                   />
                   <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                   <Bar dataKey="expense" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* Category Saturation Chart */}
        <div className="lg:col-span-4 p-8 rounded-[2.5rem] bg-[#0d0f14]/50 border border-white/5 backdrop-blur-sm flex flex-col">
           <h3 className="text-lg font-bold text-[var(--text)] mb-2 flex items-center gap-2">
              <FiPieChart className="text-indigo-400" />
              Category Saturation
           </h3>
           <p className="text-xs text-[var(--muted)] mb-8">Heavyweight sectors by investment volume</p>
           
           <div className="flex-1 min-h-[250px] relative">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie data={categoryData} innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value">
                       {categoryData.map((_, i) => (
                         <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
                       ))}
                    </Pie>
                    <Tooltip />
                 </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <span className="text-2xl font-bold text-[var(--text)] leading-none">{categoryData.length}</span>
                 <span className="text-[10px] text-[var(--muted)] uppercase font-bold tracking-tighter">Sectors</span>
              </div>
           </div>

           <div className="space-y-3 mt-6">
              {categoryData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                   <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ background: COLORS[idx % COLORS.length] }} />
                      <span className="text-[11px] font-medium text-[var(--muted)] truncate w-24">{item.name}</span>
                   </div>
                   <span className="text-xs font-bold text-[var(--text)]">₹{item.value.toLocaleString()}</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* ---------- UNIFIED GLOBAL LEDGER ---------- */}
      <div className="p-8 rounded-[2.5rem] bg-[#0d0f14]/50 border border-white/5 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
           <div>
              <h3 className="text-xl font-bold text-[var(--text)] flex items-center gap-3">
                 <FiGrid className="text-indigo-400" />
                 Global Unified Ledger
              </h3>
              <p className="text-xs text-[var(--muted)] mt-1">Holistic record of all financial operations across the system infra.</p>
           </div>

           <div className="flex flex-wrap items-center gap-4">
              {/* Search Bar */}
              <div className="relative group min-w-[300px]">
                 <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)] group-focus-within:text-indigo-400 transition-colors" />
                 <input 
                   type="text" 
                   value={txSearch}
                   onChange={(e) => setTxSearch(e.target.value)}
                   placeholder="Search ledger by principal, category or hash..."
                   className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-[var(--card)] border border-white/5 text-xs text-gray-200 placeholder-gray-600 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                 />
              </div>

              {/* Type Filter */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/5">
                 {["All", "Income", "Expense"].map(t => (
                   <button 
                     key={t}
                     onClick={() => setFilterType(t)}
                     className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all
                       ${filterType === t ? "bg-indigo-500 text-[var(--text)] shadow-lg shadow-indigo-500/20" : "text-[var(--muted)] hover:text-gray-300"}`}
                   >
                     {t}
                   </button>
                 ))}
              </div>
           </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left text-sm">
             <thead>
                <tr className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest border-b border-white/5">
                   <th className="pb-6 px-4">Principal Identity</th>
                   <th className="pb-6 px-4">Taxonomy</th>
                   <th className="pb-6 px-4">Classification</th>
                   <th className="pb-6 px-4">Transaction Quantum</th>
                   <th className="pb-6 px-4 text-right">Synchronization Timestamp</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-white/[0.03]">
                {filteredTransactions.slice(0, itemsPerPage).map((tx, idx) => (
                   <motion.tr 
                     key={tx._id || idx}
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     className="group hover:bg-white/[0.01] transition-colors"
                   >
                      <td className="py-5 px-4 font-mono">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 border border-[var(--border)] flex items-center justify-center text-[var(--text)] font-bold text-xs shadow-lg">
                               {tx.userID?.name?.charAt(0) || "U"}
                            </div>
                            <div>
                               <p className="text-xs font-bold text-[var(--text)] group-hover:text-indigo-400 transition-colors uppercase tracking-tighter">
                                  {tx.userID?.name || "System Anonymous"}
                               </p>
                               <p className="text-[10px] text-gray-600 mt-0.5">{tx.userID?.email || "N/A"}</p>
                            </div>
                         </div>
                      </td>
                      <td className="py-5 px-4">
                         <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/40" />
                            <span className="text-xs font-semibold text-[var(--muted)]">{tx.categoryID?.name || "General"}</span>
                         </div>
                      </td>
                      <td className="py-5 px-4 uppercase tracking-[0.2em] text-[9px] font-black">
                         <span className={tx.type === "Income" ? "text-emerald-500/80" : "text-rose-500/80"}>
                            {tx.type || "Expense"}
                         </span>
                      </td>
                      <td className="py-5 px-4 font-mono font-bold text-[var(--text)] text-base">
                         ₹{tx.amount?.toLocaleString()}
                      </td>
                      <td className="py-5 px-4 text-right text-[10px] font-medium text-gray-600">
                         {new Date(tx.createdAt).toLocaleDateString()} @ {new Date(tx.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </td>
                   </motion.tr>
                ))}
             </tbody>
          </table>
          
          {filteredTransactions.length === 0 && (
             <div className="py-20 flex flex-col items-center justify-center grayscale opacity-30">
                <FiDatabase size={48} className="text-[var(--muted)] mb-4" />
                <p className="text-sm font-bold text-[var(--muted)] uppercase tracking-widest">No matching records found in system cache</p>
             </div>
          )}
        </div>

        {/* Scalability: Items Per Page Toggle */}
        <div className="mt-10 border-t border-white/5 pt-6 flex items-center justify-between">
           <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
              Showing {Math.min(filteredTransactions.length, itemsPerPage)} of {filteredTransactions.length} system entries
           </p>
           <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Page Size:</span>
              <div className="flex items-center gap-1.5">
                 {[10, 20, 50].map(sz => (
                   <button 
                     key={sz}
                     onClick={() => setItemsPerPage(sz)}
                     className={`w-8 h-8 rounded-lg text-[10px] font-bold border transition-all
                       ${itemsPerPage === sz ? "bg-white/10 border-indigo-500/50 text-[var(--text)]" : "border-white/5 text-gray-600 hover:text-gray-300"}`}
                   >
                     {sz}
                   </button>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- LOADING SKELETON ---------- */
const DashboardSkeleton = () => (
  <div className="space-y-8 animate-pulse p-4">
    <div className="flex justify-between items-end">
       <div className="space-y-3">
          <div className="h-10 w-64 bg-white/5 rounded-2xl" />
          <div className="h-4 w-96 bg-white/5 rounded-xl" />
       </div>
       <div className="h-10 w-40 bg-white/5 rounded-2xl" />
    </div>
    <div className="grid grid-cols-4 gap-6">
      {[1, 2, 3, 4].map(i => <div key={i} className="h-32 rounded-[2rem] bg-white/5" />)}
    </div>
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 h-[450px] rounded-[2.5rem] bg-white/5" />
      <div className="h-[450px] rounded-[2.5rem] bg-white/5" />
    </div>
    <div className="h-[600px] rounded-[2.5rem] bg-white/5" />
  </div>
);


export default AdminDashboard;

