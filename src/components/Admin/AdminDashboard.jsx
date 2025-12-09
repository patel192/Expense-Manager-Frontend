// AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../Utils/axiosInstance";
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
import { Users, UserCog, CreditCard, ChevronDown, ChevronUp } from "lucide-react";

export const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [userCountsPerMonth, setUserCountsPerMonth] = useState([]);
  const [roleDistribution, setRoleDistribution] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // UI state for collapsible blocks
  const [openKPIs, setOpenKPIs] = useState(true);
  const [openUsersChart, setOpenUsersChart] = useState(true);
  const [openRoleChart, setOpenRoleChart] = useState(true);
  const [openRecentTx, setOpenRecentTx] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axiosInstance.get("/users");
        const allUsers = userRes.data.data || [];
        setUsers(allUsers);

        // Role distribution
        const adminCount = allUsers.filter((u) => u.role === "Admin").length;
        const userCount = allUsers.length - adminCount;
        setRoleDistribution([
          { name: "Admins", value: adminCount },
          { name: "Users", value: userCount },
        ]);

        // Monthly user counts (ordered)
        const monthlyCounts = {};
        allUsers.forEach((user) => {
          const month = new Date(user.createdAt).toLocaleString("default", {
            month: "short",
          });
          monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
        });

        const monthsOrder = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        ];
        setUserCountsPerMonth(
          monthsOrder.map((m) => ({ name: m, users: monthlyCounts[m] || 0 }))
        );

        // Recent users
        const recent = [...allUsers]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 6);
        setRecentUsers(recent);

        // Transactions
        const txRes = await axiosInstance.get("/transactions");
        setTransactions(txRes.data.data || []);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      }
    };
    fetchData();
  }, []);

  const COLORS = ["#06b6d4", "#6366F1"]; // cyan + indigo

  // Small helper to format currency
  const fmt = (v) => (typeof v === "number" ? `₹${v.toLocaleString()}` : v);

  // Compose KPI values
  const totalUsers = users.length;
  const totalAdmins = users.filter((u) => u.role === "Admin").length;
  const totalTransactions = transactions.length;
  const recentTxCount = transactions.length ? transactions.slice(0, 5).length : 0;

  return (
    <div className="min-h-screen p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white space-y-8">
      {/* Page heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Admin Insights Hub</h1>
          <p className="text-sm text-gray-400 mt-1">
            Consolidated analytics — quick KPIs, monthly trends, role split and recent activity.
          </p>
        </div>

        <div className="flex gap-3 items-center">
          <button
            onClick={() => { /* could open global filters */ }}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/6 hover:bg-white/10 transition"
          >
            Filter
          </button>
        </div>
      </div>

      {/* ---------- KPIs (collapsible block) ---------- */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Key Metrics</h2>
          <button
            onClick={() => setOpenKPIs((v) => !v)}
            className="flex items-center gap-2 text-sm text-gray-300 p-2 rounded hover:bg-white/5 transition"
            aria-expanded={openKPIs}
          >
            {openKPIs ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {openKPIs ? "Hide" : "Show"}
          </button>
        </div>

        <AnimatePresence initial={false}>
          {openKPIs && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {/* KPI card 1 */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-2xl backdrop-blur-lg bg-gradient-to-r from-indigo-600/20 to-violet-700/10 border border-white/10"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-white/6 p-2 rounded-lg">
                    <Users className="text-white" size={20} />
                  </div>
                  <div>
                    <div className="text-sm text-gray-300">Total Users</div>
                    <div className="text-2xl font-bold mt-1">{totalUsers}</div>
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-400">
                  New in last 30 days: {users.filter(u => {
                    const d = new Date(u.createdAt);
                    return d > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
                  }).length}
                </div>
              </motion.div>

              {/* KPI card 2 */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-2xl backdrop-blur-lg bg-gradient-to-r from-green-600/15 to-emerald-700/10 border border-white/10"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-white/6 p-2 rounded-lg">
                    <UserCog className="text-white" size={20} />
                  </div>
                  <div>
                    <div className="text-sm text-gray-300">Total Admins</div>
                    <div className="text-2xl font-bold mt-1">{totalAdmins}</div>
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-400">
                  Admin ratio: {totalUsers ? ((totalAdmins / totalUsers) * 100).toFixed(1) : 0}%
                </div>
              </motion.div>

              {/* KPI card 3 */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-2xl backdrop-blur-lg bg-gradient-to-r from-yellow-500/10 to-orange-600/10 border border-white/10"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-white/6 p-2 rounded-lg">
                    <CreditCard className="text-white" size={20} />
                  </div>
                  <div>
                    <div className="text-sm text-gray-300">Transactions</div>
                    <div className="text-2xl font-bold mt-1">{totalTransactions}</div>
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-400">Recent: {recentTxCount} shown below</div>
              </motion.div>

              {/* KPI card 4 (spare) */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-2xl backdrop-blur-lg bg-gradient-to-r from-cyan-600/10 to-blue-700/6 border border-white/10"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-white/6 p-2 rounded-lg">
                    <Users className="text-white" size={20} />
                  </div>
                  <div>
                    <div className="text-sm text-gray-300">Active (30d)</div>
                    <div className="text-2xl font-bold mt-1">
                      {users.filter(u => {
                        // some heuristic: users that logged in in last 30d - (if you store lastLogin), fallback to new users
                        return new Date(u.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
                      }).length}
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-400">Quick engagement estimate</div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ---------- Insights: Users per month (collapsible) ---------- */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Users Growth</h2>
          <button
            onClick={() => setOpenUsersChart((v) => !v)}
            className="flex items-center gap-2 text-sm text-gray-300 p-2 rounded hover:bg-white/5 transition"
          >
            {openUsersChart ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {openUsersChart ? "Hide" : "Show"}
          </button>
        </div>

        <AnimatePresence initial={false}>
          {openUsersChart && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-4"
            >
              {/* Big chart */}
              <div className="lg:col-span-2 p-4 rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">Users per Month</h3>
                    <p className="text-xs text-gray-400">Monthly sign-ups during the year</p>
                  </div>
                </div>

                <div style={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={userCountsPerMonth}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                      <XAxis dataKey="name" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip contentStyle={{ background: "#0b1220" }} />
                      <Bar dataKey="users" fill={COLORS[1]} radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Compact summary & top months */}
              <div className="p-4 rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10 shadow-lg flex flex-col gap-4">
                <div>
                  <h4 className="text-sm font-semibold">Top months</h4>
                  <p className="text-xs text-gray-400">Highest sign-up months</p>
                </div>

                <ul className="space-y-2">
                  {userCountsPerMonth
                    .slice()
                    .sort((a, b) => b.users - a.users)
                    .slice(0, 4)
                    .map((m) => (
                      <li key={m.name} className="flex items-center justify-between">
                        <div className="text-sm">{m.name}</div>
                        <div className="text-sm font-medium text-white">{m.users}</div>
                      </li>
                    ))}
                </ul>

                <div className="mt-auto text-xs text-gray-400">
                  Tip: Hover any bar to see details.
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ---------- Role Distribution + Recent Users block ---------- */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Community</h2>
          <button
            onClick={() => setOpenRoleChart((v) => !v)}
            className="flex items-center gap-2 text-sm text-gray-300 p-2 rounded hover:bg-white/5 transition"
          >
            {openRoleChart ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {openRoleChart ? "Hide" : "Show"}
          </button>
        </div>

        <AnimatePresence initial={false}>
          {openRoleChart && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-4"
            >
              {/* Pie chart */}
              <div className="lg:col-span-1 p-4 rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10 shadow-lg">
                <h3 className="font-semibold mb-3">Role Distribution</h3>
                <div style={{ height: 220 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={roleDistribution}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {roleDistribution.map((entry, idx) => (
                          <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent users */}
              <div className="lg:col-span-2 p-4 rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Recent Users</h3>
                  <div className="text-xs text-gray-400">Latest signups</div>
                </div>

                {recentUsers.length > 0 ? (
                  <ul className="space-y-3">
                    {recentUsers.map((u, i) => (
                      <li
                        key={u._id || i}
                        className="flex items-center justify-between gap-3 p-3 rounded-lg hover:bg-white/3 transition"
                      >
                        <div>
                          <div className="font-medium">{u.name || "Unnamed"}</div>
                          <div className="text-xs text-gray-400">{u.email || "—"}</div>
                        </div>
                        <div className="text-sm text-gray-300">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            u.role === "Admin" ? "bg-purple-600/20 text-purple-200" : "bg-blue-600/10 text-blue-200"
                          }`}>
                            {u.role}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-gray-400 text-sm">No recent users found.</div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ---------- Recent Transactions (collapsible, full-width) ---------- */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Transactions</h2>
          <button
            onClick={() => setOpenRecentTx((v) => !v)}
            className="flex items-center gap-2 text-sm text-gray-300 p-2 rounded hover:bg-white/5 transition"
          >
            {openRecentTx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {openRecentTx ? "Hide" : "Show"}
          </button>
        </div>

        <AnimatePresence initial={false}>
          {openRecentTx && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="p-4 rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10 shadow-lg overflow-x-auto"
            >
              {transactions.length > 0 ? (
                <table className="w-full min-w-[680px] text-sm">
                  <thead className="text-xs text-gray-300">
                    <tr>
                      <th className="p-3 text-left">User</th>
                      <th className="p-3 text-left">Amount</th>
                      <th className="p-3 text-left">Type</th>
                      <th className="p-3 text-left">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.slice(0, 12).map((tx, idx) => (
                      <tr key={tx._id || idx} className="border-t border-white/6 hover:bg-white/3 transition">
                        <td className="p-3">{tx.userID?.name || "Unknown"}</td>
                        <td className="p-3 font-semibold text-green-300">₹{tx.amount}</td>
                        <td className="p-3">{tx.type || (tx.amount < 0 ? "Expense" : "Income")}</td>
                        <td className="p-3 text-gray-300">{new Date(tx.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-gray-400 text-sm py-6 text-center">No transactions found.</div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <footer className="text-xs text-gray-500 text-center pt-4">
        Admin Insights • Data refreshed on load
      </footer>
    </div>
  );
};

export default AdminDashboard;
