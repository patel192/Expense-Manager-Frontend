import  { useEffect } from "react";
import { motion } from "framer-motion";
import { useSelector,useDispatch } from "react-redux";
import { fetchAdminReport } from "../../redux/adminReport/adminReportSlice";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#818cf8", "#34d399", "#fbbf24", "#f87171", "#a855f7"];

export const ReportAdmins = () => {
  const dispatch = useDispatch();
  const {stats,loading} = useSelector((state)=> state.adminReport)
  useEffect(() => {
   dispatch(fetchAdminReport());    
  }, [dispatch]);

  if (loading || !stats)
    return (
      <div className="flex items-center justify-center h-[70vh] text-gray-400 text-xl">
        Loading report...
      </div>
    );

  // KPI DATA
  const kpis = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      trend: "+12%",
      color: "from-indigo-400 to-purple-500",
    },
    {
      label: "Active Users",
      value: stats.activeUsers,
      trend: "+4%",
      color: "from-emerald-400 to-green-500",
    },
    {
      label: "Deactivated Users",
      value: stats.deactivatedUsers,
      trend: "-3%",
      color: "from-pink-400 to-red-500",
    },
    {
      label: "Total Income",
      value: `₹${stats.totalIncome}`,
      trend: "+8%",
      color: "from-blue-400 to-cyan-500",
    },
    {
      label: "Total Expense",
      value: `₹${stats.totalExpense}`,
      trend: "+6%",
      color: "from-yellow-400 to-orange-500",
    },
    {
      label: "Most Active User",
      value: stats.mostActiveUser || "N/A",
      trend: "Top performer",
      color: "from-purple-400 to-pink-500",
    },
  ];

  const barData = [
    { name: "Income", amount: stats.totalIncome },
    { name: "Expenses", amount: stats.totalExpense },
  ];

  const pieData = stats.categoryDistribution || [];

  return (
    <div className="pb-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white mb-2">
            Intelligence <span className="text-cyan-400">Reports</span>
          </h1>
          <p className="text-gray-500 text-sm max-w-lg font-medium">
            Aggregated analytical insights across all system nodes. High-fidelity data visualization for ecosystem health monitoring.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-[#0d0f14]/80 px-4 py-2.5 rounded-2xl border border-white/5 shadow-2xl backdrop-blur-md">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Node Analytics: Synchronized</span>
        </div>
      </div>

      {/* KPIs GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-10">
        {kpis.map((kpi, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="group p-5 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-md hover:bg-white/10 transition-all duration-300 relative overflow-hidden"
          >
             <div className="relative z-10">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">{kpi.label}</p>
                <h3 className={`text-2xl font-black text-white group-hover:text-cyan-400 transition-colors truncate`}>
                  {kpi.value}
                </h3>
                <div className="mt-4 flex items-center justify-between">
                   <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">{kpi.trend}</span>
                   <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${kpi.color} opacity-20 filter blur-sm group-hover:opacity-40 transition-opacity`} />
                </div>
             </div>
          </motion.div>
        ))}
      </div>

      {/* CHARTS ECOSYSTEM */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 mb-10">
        
        {/* BAR CHART LAYER */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="xl:col-span-3 rounded-[2.5rem] bg-[#0d0f14]/50 border border-white/5 p-8 shadow-2xl backdrop-blur-xl group"
        >
          <div className="flex items-center justify-between mb-8">
             <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-gray-400">Financial Convergence</h2>
             <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-cyan-400">
                <FiActivity size={18} />
             </div>
          </div>

          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                 <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.1}/>
                 </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#4b5563', fontSize: 10, fontWeight: 700 }} />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                contentStyle={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }} 
              />
              <Bar dataKey="amount" fill="url(#barGradient)" radius={[15, 15, 5, 5]} barSize={60} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* PIE CHART LAYER */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="xl:col-span-2 rounded-[2.5rem] bg-[#0d0f14]/50 border border-white/5 p-8 shadow-2xl backdrop-blur-xl"
        >
          <div className="flex items-center justify-between mb-8">
             <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-gray-400">Class Distribution</h2>
             <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-purple-400">
                <FiPieChart size={18} />
             </div>
          </div>

          {pieData.length > 0 ? (
            <div className="flex flex-col items-center">
               <ResponsiveContainer width="100%" height={280}>
                 <PieChart>
                   <Pie
                     data={pieData}
                     cx="50%"
                     cy="50%"
                     outerRadius={100}
                     innerRadius={70}
                     paddingAngle={8}
                     dataKey="value"
                     stroke="none"
                   >
                     {pieData.map((entry, idx) => (
                       <Cell key={idx} fill={COLORS[idx % COLORS.length]} fillOpacity={0.8} />
                     ))}
                   </Pie>
                   <Tooltip 
                      contentStyle={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px' }}
                   />
                 </PieChart>
               </ResponsiveContainer>
               <div className="mt-4 grid grid-cols-2 gap-4 w-full">
                  {pieData.slice(0, 4).map((entry, i) => (
                     <div key={i} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="text-[10px] font-bold text-gray-500 uppercase truncate">{entry.name}</span>
                     </div>
                  ))}
               </div>
            </div>
          ) : (
            <div className="h-[280px] flex items-center justify-center border border-dashed border-white/10 rounded-3xl">
               <p className="text-gray-600 font-bold uppercase tracking-widest text-[10px]">Registry Empty</p>
            </div>
          )}
        </motion.div>

      </div>

      {/* HIGHLIGHTS / INSIGHTS PANEL */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[2.5rem] bg-gradient-to-br from-[#0d0f14] to-[#040506] border border-white/5 p-10 shadow-3xl relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
           <FiGrid size={120} className="text-gray-400" />
        </div>
        
        <div className="relative z-10 w-full lg:w-2/3">
           <h2 className="text-2xl font-bold text-white mb-6">Strategic Highlights</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                 <div className="flex items-start gap-4">
                    <div className="mt-1 p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                       <FiActivity size={18} />
                    </div>
                    <div>
                       <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Peak Capital Flow</p>
                       <h4 className="text-xl font-bold text-gray-200">₹{stats.totalIncome.toLocaleString()}</h4>
                    </div>
                 </div>
                 <div className="flex items-start gap-4">
                    <div className="mt-1 p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                       <FiUsers size={18} />
                    </div>
                    <div>
                       <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Primary Operator</p>
                       <h4 className="text-xl font-bold text-gray-200">{stats.mostActiveUser || "STANDBY"}</h4>
                    </div>
                 </div>
              </div>

              <div className="space-y-6">
                 <div className="flex items-start gap-4">
                    <div className="mt-1 p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                       <FiXCircle size={18} />
                    </div>
                    <div>
                       <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Dormant Accounts</p>
                       <h4 className="text-xl font-bold text-gray-200">{stats.deactivatedUsers} NODES</h4>
                    </div>
                 </div>
                 <div className="flex items-start gap-4">
                    <div className="mt-1 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                       <FiFileText size={18} />
                    </div>
                    <div>
                       <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Operational Outlay</p>
                       <h4 className="text-xl font-bold text-gray-200">₹{stats.totalExpense.toLocaleString()}</h4>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

