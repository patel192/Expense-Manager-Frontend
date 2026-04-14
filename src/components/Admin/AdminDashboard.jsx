// AdminDashboard.jsx
import  { useEffect, useState } from "react";
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
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  UserCog,
  CreditCard,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { FiUsers, FiShield, FiActivity, FiLayout } from "react-icons/fi";

export const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { users, loading: userLoading } = useSelector((state) => state.user);
  const { transactions, loading: txLoading } = useSelector((state) => state.transaction);

  const loadingDashboard = userLoading || txLoading;

  const userCountsPerMonth = (() => {
    const monthlyCounts = {};

    (users || []).forEach((user) => {
      const month = new Date(user.createdAt).toLocaleString("default", {
        month: "short",
      });

      monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
    });

    const monthsOrder = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return monthsOrder.map((m) => ({
      name: m,
      users: monthlyCounts[m] || 0,
    }));
  })();
  const roleDistribution = [
    {
      name: "Admins",
      value: (users || []).filter((u) => u.role === "Admin").length,
    },

    {
      name: "Users",
      value: (users || []).filter((u) => u.role !== "Admin").length,
    },
  ];

  const recentUsers = (users || []).slice(-5).reverse();
  // UI state for collapsible blocks
  const [openKPIs, setOpenKPIs] = useState(true);
  const [openUsersChart, setOpenUsersChart] = useState(true);
  const [openRoleChart, setOpenRoleChart] = useState(true);
  const [openRecentTx, setOpenRecentTx] = useState(true);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchAllTransactions());
  }, [dispatch]);

  const COLORS = ["#06b6d4", "#6366F1"]; // cyan + indigo

  // Small helper to format currency
  const fmt = (v) => (typeof v === "number" ? `₹${v.toLocaleString()}` : v);

  // Compose KPI values
  const totalUsers = (users || []).length;
  const totalAdmins = (users || []).filter((u) => u.role === "Admin").length;
  const totalTransactions = (transactions || []).length;
  const recentTxCount = (transactions || []).length
    ? (transactions || []).slice(0, 5).length
    : 0;

  if (loadingDashboard) return <DashboardSkeleton />;

  return (
    <div className="space-y-8 pb-10">
      {/* ---------- HEADER ---------- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
            System <span className="text-cyan-400">Intelligence</span>
          </h1>
          <p className="text-gray-400 text-sm max-w-md">
            Real-time infrastructure overview, user growth analytics, and global financial transaction flow.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-xs font-semibold text-cyan-400 tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            LIVE SYSTEM FEED
          </div>
        </div>
      </div>

      {/* ---------- KPI BENTO GRID ---------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Total Registrations",
            value: totalUsers,
            sub: "+12% this month",
            icon: <FiUsers size={24} />,
            color: "from-blue-600/20 to-cyan-500/10",
            accent: "text-cyan-400",
          },
          {
            label: "Privileged Admins",
            value: totalAdmins,
            sub: `${((totalAdmins / totalUsers) * 100).toFixed(1)}% of total`,
            icon: <FiShield size={24} />,
            color: "from-purple-600/20 to-indigo-500/10",
            accent: "text-purple-400",
          },
          {
            label: "Global Transactions",
            value: totalTransactions,
            sub: "across all accounts",
            icon: <FiActivity size={24} />,
            color: "from-emerald-600/20 to-teal-500/10",
            accent: "text-emerald-400",
          },
          {
            label: "System Health",
            value: "99.9%",
            sub: "All services active",
            icon: <FiLayout size={24} />,
            color: "from-rose-600/20 to-orange-500/10",
            accent: "text-rose-400",
          },
        ].map((kpi, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5 }}
            className={`relative overflow-hidden p-6 rounded-3xl bg-gradient-to-br ${kpi.color} border border-white/5 group`}
          >
            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
              {kpi.icon}
            </div>
            <p className="text-sm font-medium text-gray-400 mb-1">{kpi.label}</p>
            <h3 className="text-3xl font-bold text-white mb-2">{kpi.value}</h3>
            <p className={`text-xs font-medium ${kpi.accent} tracking-wide`}>
              {kpi.sub}
            </p>
          </motion.div>
        ))}
      </div>

      {/* ---------- ANALYTICS SECTION ---------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Growth Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#0d0f14]/50 border border-white/5 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-semibold text-white">Acquisition Trends</h3>
              <p className="text-xs text-gray-500">Monthly user registration metrics</p>
            </div>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userCountsPerMonth}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: "#6b7280", fontSize: 12}}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: "#6b7280", fontSize: 12}}
                />
                <Tooltip 
                  cursor={{fill: "#ffffff05"}}
                  contentStyle={{
                    background: "#0d0f14",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.5)"
                  }}
                />
                <Bar 
                  dataKey="users" 
                  fill="url(#barGradient)" 
                  radius={[6, 6, 0, 0]}
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Role Distribution */}
        <div className="p-6 rounded-3xl bg-[#0d0f14]/50 border border-white/5 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-white mb-1">Role Allocation</h3>
          <p className="text-xs text-gray-500 mb-6">User privilege distribution</p>
          <div className="h-[280px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roleDistribution}
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill="#06b6d4" stroke="none" />
                  <Cell fill="#6366f1" stroke="none" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-white">{totalUsers}</span>
              <span className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">Total Users</span>
            </div>
          </div>
          <div className="space-y-3 mt-4">
             {roleDistribution.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                   <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${idx === 0 ? "bg-cyan-400" : "bg-indigo-500"}`} />
                      <span className="text-xs font-medium text-gray-300">{item.name}</span>
                   </div>
                   <span className="text-xs font-bold text-white">{item.value}</span>
                </div>
             ))}
          </div>
        </div>
      </div>

      {/* ---------- RECENT ACTIVITY ---------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions Table */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#0d0f14]/50 border border-white/5 overflow-hidden">
          <div className="flex items-center justify-between mb-6">
             <h3 className="text-lg font-semibold text-white">Global Transactions</h3>
             <button className="text-xs font-semibold text-cyan-400 hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-gray-500 font-medium border-b border-white/5">
                  <th className="pb-4 pr-4">Principal</th>
                  <th className="pb-4 pr-4">Type</th>
                  <th className="pb-4 pr-4">Amount</th>
                  <th className="pb-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {transactions.slice(0, 8).map((tx, idx) => (
                  <tr key={tx._id || idx} className="group hover:bg-white/[0.02] transition">
                    <td className="py-4 pr-4">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-xs font-bold">
                             {tx.userID?.name?.charAt(0) || "U"}
                          </div>
                          <span className="font-medium group-hover:text-white transition">{tx.userID?.name || "Unknown"}</span>
                       </div>
                    </td>
                    <td className="py-4 pr-4">
                       <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider
                                       ${tx.type === "Income" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
                          {tx.type || "Expense"}
                       </span>
                    </td>
                    <td className="py-4 pr-4 font-mono font-semibold text-white">
                      ₹{tx.amount?.toLocaleString()}
                    </td>
                    <td className="py-4 text-right text-xs text-gray-500">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Users */}
        <div className="p-6 rounded-3xl bg-[#0d0f14]/50 border border-white/5">
          <h3 className="text-lg font-semibold text-white mb-6 text-center lg:text-left">New Citizens</h3>
          <div className="space-y-4">
             {recentUsers.map((u, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-cyan-500/30 transition group">
                   <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 border border-white/10 flex items-center justify-center text-white font-bold text-sm">
                      {u.name?.charAt(0) || "U"}
                   </div>
                   <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate group-hover:text-cyan-400 transition">{u.name}</p>
                      <p className="text-[10px] text-gray-500 truncate">{u.email}</p>
                   </div>
                   <span className="text-[10px] font-bold text-gray-400 bg-white/5 px-2 py-1 rounded-md">
                      {u.role?.toUpperCase()}
                   </span>
                </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- LOADING SKELETON ---------- */
const DashboardSkeleton = () => (
  <div className="space-y-8 animate-pulse">
    <div className="h-20 w-1/3 bg-white/5 rounded-3xl" />
    <div className="grid grid-cols-4 gap-6">
      {[1, 2, 3, 4].map(i => <div key={i} className="h-32 rounded-3xl bg-white/5" />)}
    </div>
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 h-[400px] rounded-3xl bg-white/5" />
      <div className="h-[400px] rounded-3xl bg-white/5" />
    </div>
  </div>
);

export default AdminDashboard;

