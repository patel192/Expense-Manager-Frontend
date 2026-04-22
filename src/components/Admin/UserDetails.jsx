import  { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../Utils/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area
} from "recharts";
import { FiUser, FiCalendar, FiArrowUpRight, FiArrowDownLeft, FiActivity, FiShield, FiChevronLeft } from "react-icons/fi";

export const UserDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [income, setIncome] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [budget, setBudget] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [incomeRes, budgetRes, txRes, userRes] = await Promise.all([
        axiosInstance.get(`/incomesbyUserID/${userId}`),
        axiosInstance.get(`/budgetsbyUserID/${userId}`),
        axiosInstance.get(`/transactionsByUserId/${userId}`),
        axiosInstance.get(`/user/${userId}`),
      ]);

      setIncome(incomeRes.data.data || []);
      setBudget(budgetRes.data.data || []);
      setTransactions(txRes.data.data || []);
      setUser(userRes.data.data || null);
    } catch (error) {
      console.log("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, i) => sum + (i.amount || 0), 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, e) => sum + (e.amount || 0), 0);
  const totalBudget = budget.reduce((sum, b) => sum + (b.amount || 0), 0);

  const monthlyData = (() => {
    const grouped = {};
    transactions.forEach((t) => {
      const date = new Date(t.date);
      const m = date.toLocaleString("default", { month: "short" });
      if (!grouped[m]) grouped[m] = { month: m, income: 0, expense: 0 };
      if (t.type === "income") grouped[m].income += t.amount;
      else grouped[m].expense += t.amount;
    });
    // Order by month if possible, or just return values
    return Object.values(grouped);
  })();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
         <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
         <p className="text-sm font-semibold text-cyan-400/60 uppercase tracking-widest animate-pulse">Accessing Encrypted Profile...</p>
      </div>
    );
  }

  return (
    <div className="pb-10">
      {/* HEADER NAVIGATION */}
      <div className="flex items-center gap-4 mb-8">
         <button 
           onClick={() => navigate(-1)}
           className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-[var(--muted)] hover:text-[var(--text)] hover:bg-white/10 transition shadow-lg"
         >
            <FiChevronLeft size={20} />
         </button>
         <div>
            <h1 className="text-sm font-bold text-[var(--muted)] uppercase tracking-[0.3em]">Subject Analysis</h1>
            <p className="text-xs text-cyan-500/60 font-mono">ID: {userId}</p>
         </div>
      </div>

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-8"
        >
          {/* ===================== PROFILE HERO ===================== */}
          <div className="relative group rounded-[2.5rem] bg-[#0d0f14]/50 border border-white/5 p-8 shadow-2xl backdrop-blur-md overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 p-10 opacity-10 blur-3xl group-hover:opacity-20 transition-opacity">
               <FiActivity size={200} className="text-cyan-500" />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
              <div className="relative">
                 {user?.profilePic ? (
                   <img src={user.profilePic} alt={user.name} className="w-32 h-32 rounded-3xl border-2 border-cyan-500/30 object-cover shadow-2xl p-1 bg-black/20" />
                 ) : (
                   <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-gray-700 to-gray-900 border border-[var(--border)] flex items-center justify-center shadow-2xl shadow-cyan-500/10">
                      <FiUser className="w-16 h-16 text-[var(--text)]/50" />
                   </div>
                 )}
                 <div className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 shadow-lg backdrop-blur-sm">
                    <FiShield size={16} />
                 </div>
              </div>

              <div className="flex-1 space-y-3">
                 <h2 className="text-4xl font-black text-[var(--text)] tracking-tight">{user.name}</h2>
                 <p className="text-[var(--muted)] font-medium">{user.email}</p>
                 
                 <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start pt-2">
                    <span className={`px-4 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                      user.role === "Admin" ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400" : "bg-white/5 border-[var(--border)] text-[var(--muted)]"
                    }`}>
                      {user.role} ACCESS
                    </span>
                    <div className="flex items-center gap-2 text-[var(--muted)] text-[10px] font-bold uppercase tracking-widest">
                       <FiCalendar className="text-cyan-500" />
                       DECRYPTED: {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                 </div>
              </div>

              <div className="flex gap-2">
                 <button className="px-6 py-3 rounded-2xl bg-white/5 border border-white/5 text-xs font-bold uppercase tracking-widest text-gray-300 hover:bg-white/10 hover:text-[var(--text)] transition">
                   MODERATE
                 </button>
              </div>
            </div>
          </div>

          {/* ===================== ANALYTICS STRIP ===================== */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Gross Inflow", value: totalIncome, icon: <FiArrowUpRight size={20} />, color: "from-emerald-600/20 to-teal-500/10", accent: "text-emerald-400" },
              { label: "Operational Outflow", value: totalExpense, icon: <FiArrowDownLeft size={20} />, color: "from-rose-600/20 to-orange-500/10", accent: "text-rose-400" },
              { label: "Allocated Reserves", value: totalBudget, icon: <FiActivity size={20} />, color: "from-blue-600/20 to-indigo-500/10", accent: "text-blue-400" },
            ].map((card, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className={`p-6 rounded-3xl bg-gradient-to-br ${card.color} border border-white/5 shadow-xl flex items-center justify-between group`}
              >
                <div>
                  <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mb-1">{card.label}</p>
                  <h3 className="text-3xl font-black text-[var(--text)]">₹{card.value.toLocaleString()}</h3>
                </div>
                <div className={`p-4 rounded-2xl bg-black/20 ${card.accent} shadow-inner group-hover:scale-110 transition-transform`}>
                   {card.icon}
                </div>
              </motion.div>
            ))}
          </div>

          {/* ===================== SPLIT CHARTS ===================== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Distribution View */}
            <motion.div className="p-8 rounded-[2.5rem] bg-[#0d0f14]/50 border border-white/5 backdrop-blur-xl shadow-2xl">
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--muted)] mb-8">Convergent Distribution</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={[{ name: "Inflow", amount: totalIncome }, { name: "Outflow", amount: totalExpense }]}>
                  <defs>
                    <linearGradient id="distGradient" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.8}/>
                       <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#4b5563', fontSize: 10, fontWeight: 700 }} />
                  <YAxis hide />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} contentStyle={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px' }} />
                  <Bar dataKey="amount" fill="url(#distGradient)" radius={[12, 12, 4, 4]} barSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Cyclical Trends */}
            <motion.div className="p-8 rounded-[2.5rem] bg-[#0d0f14]/50 border border-white/5 backdrop-blur-xl shadow-2xl">
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--muted)] mb-8">Cyclical Velocity</h3>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="areaIn" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity={0.3}/><stop offset="100%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
                    <linearGradient id="areaOut" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f43f5e" stopOpacity={0.3}/><stop offset="100%" stopColor="#f43f5e" stopOpacity={0}/></linearGradient>
                  </defs>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#4b5563', fontSize: 10, fontWeight: 700 }} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px' }} />
                  <Area type="monotone" dataKey="income" stroke="#10b981" fill="url(#areaIn)" strokeWidth={3} />
                  <Area type="monotone" dataKey="expense" stroke="#f43f5e" fill="url(#areaOut)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* ===================== TIMELINE (RECENT ACTIVITY) ===================== */}
          <motion.div className="p-8 rounded-[2.5rem] bg-[#0d0f14]/80 border border-white/5 backdrop-blur-2xl shadow-3xl">
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--muted)] mb-8 flex items-center gap-3">
               Sequence Transactional Log
               <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
            </h3>

            <div className="space-y-6 relative">
              <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-white/[0.03]"></div>

              {transactions.slice(0, 8).map((tx, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + idx * 0.05 }}
                  className="flex items-center gap-6 relative pl-8 group"
                >
                  <span className={`w-4 h-4 rounded-full absolute left-0 top-1/2 -translate-y-1/2 border-4 border-[#08090d] shadow-[0_0_10px_rgba(0,0,0,0.5)] z-20 transition-all duration-300 ${
                    tx.type === "income" ? "bg-emerald-500 scale-110 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.5)]" : "bg-rose-500 scale-110 group-hover:shadow-[0_0_15px_rgba(244,63,94,0.5)]"
                  }`} />

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 items-center p-5 rounded-2xl bg-white/[0.01] border border-white/[0.03] hover:bg-white/[0.03] transition-all">
                     <div className="md:col-span-2">
                        <p className="text-xs font-bold text-[var(--muted)] uppercase tracking-widest mb-1">{new Date(tx.date).toLocaleString()}</p>
                        <h4 className="font-bold text-gray-200">Execution Block: {tx.description || "System Payload"}</h4>
                     </div>
                     <div className="text-right flex items-center gap-3 md:justify-end">
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${tx.type === 'income' ? 'border-emerald-500/20 text-emerald-400' : 'border-rose-500/20 text-rose-400'}`}>
                           {tx.type?.toUpperCase()}
                        </span>
                        <p className={`text-xl font-black ${tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                           {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                        </p>
                     </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-8 flex justify-center">
               <button className="text-[10px] font-bold text-gray-600 uppercase tracking-widest hover:text-cyan-400 transition">
                  Load Full Operational History
               </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

