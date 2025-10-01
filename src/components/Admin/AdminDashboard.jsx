import React, { useEffect, useState } from "react";
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
import { Users, UserCog, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import axiosInstance from "../Utils/axiosInstance";

export const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [userCountsPerMonth, setUserCountsPerMonth] = useState([]);
  const [roleDistribution, setRoleDistribution] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axiosInstance.get("/users");
        const allUsers = userRes.data.data || [];
        setUsers(allUsers);

        const adminCount = allUsers.filter((u) => u.role === "Admin").length;
        const userCount = allUsers.length - adminCount;

        setRoleDistribution([
          { name: "Admins", value: adminCount },
          { name: "Users", value: userCount },
        ]);

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
        const monthlyData = monthsOrder.map((m) => ({
          name: m,
          users: monthlyCounts[m] || 0,
        }));
        setUserCountsPerMonth(monthlyData);

        const recent = [...allUsers]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        setRecentUsers(recent);

        const txRes = await axiosInstance.get("/transactions");
        setTransactions(txRes.data.data || []);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      }
    };
    fetchData();
  }, []);

  const COLORS = ["#4F46E5", "#10B981"];

  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white space-y-8 sm:space-y-10">
      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl sm:text-3xl font-bold text-center"
      >
        Admin Dashboard
      </motion.h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {[
          {
            title: "Total Users",
            value: users.length,
            icon: <Users size={32} className="sm:w-9 sm:h-9" />,
            gradient: "from-blue-500/80 to-indigo-600/80",
          },
          {
            title: "Total Admins",
            value: users.filter((u) => u.role === "Admin").length,
            icon: <UserCog size={32} className="sm:w-9 sm:h-9" />,
            gradient: "from-green-500/80 to-emerald-600/80",
          },
          {
            title: "Transactions",
            value: transactions.length,
            icon: <CreditCard size={32} className="sm:w-9 sm:h-9" />,
            gradient: "from-yellow-400/80 to-orange-500/80",
          },
        ].map((card, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            className={`p-4 sm:p-6 rounded-2xl shadow-lg backdrop-blur-lg bg-gradient-to-r ${card.gradient} border border-white/20`}
          >
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-white">{card.icon}</span>
              <h2 className="text-base sm:text-lg font-semibold">{card.title}</h2>
            </div>
            <p className="text-2xl sm:text-3xl font-bold">{card.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Users per Month (Bar Chart) */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="backdrop-blur-lg bg-white/10 border border-white/20 p-4 sm:p-6 rounded-2xl shadow-xl"
      >
        <h3 className="text-base sm:text-lg font-semibold mb-4">Users per Month</h3>
        <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
          <BarChart data={userCountsPerMonth}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip />
            <Legend />
            <Bar dataKey="users" fill="#6366F1" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Role Distribution (Pie Chart) */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="backdrop-blur-lg bg-white/10 border border-white/20 p-4 sm:p-6 rounded-2xl shadow-xl"
      >
        <h3 className="text-base sm:text-lg font-semibold mb-4">Role Distribution</h3>
        <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
          <PieChart>
            <Pie
              data={roleDistribution}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {roleDistribution.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Recent Users */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="backdrop-blur-lg bg-white/10 border border-white/20 p-4 sm:p-6 rounded-2xl shadow-xl"
      >
        <h3 className="text-base sm:text-lg font-semibold mb-4">Recent Users</h3>
        {recentUsers.length > 0 ? (
          <ul className="divide-y divide-white/10">
            {recentUsers.map((user, idx) => (
              <li
                key={idx}
                className="py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 hover:bg-white/5 px-3 rounded-lg transition"
              >
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-gray-400 text-sm">{user.email}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold w-fit sm:w-auto ${
                    user.role === "Admin"
                      ? "bg-purple-500/30 text-purple-300"
                      : "bg-blue-500/30 text-blue-300"
                  }`}
                >
                  {user.role}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No recent users found.</p>
        )}
      </motion.div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="backdrop-blur-lg bg-white/10 border border-white/20 p-4 sm:p-6 rounded-2xl shadow-xl overflow-x-auto"
      >
        <h3 className="text-base sm:text-lg font-semibold mb-4">Recent Transactions</h3>
        {transactions.length > 0 ? (
          <table className="w-full border-collapse text-sm sm:text-base">
            <thead>
              <tr className="bg-white/10 text-gray-300">
                <th className="p-2 sm:p-3 text-left">User</th>
                <th className="p-2 sm:p-3 text-left">Amount</th>
                <th className="p-2 sm:p-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 5).map((tx, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-white/5 transition border-b border-white/10"
                >
                  <td className="p-2 sm:p-3">{tx.userID?.name || "Unknown"}</td>
                  <td className="p-2 sm:p-3 font-semibold text-green-400">
                    ₹{tx.amount}
                  </td>
                  <td className="p-2 sm:p-3">
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-400">No transactions found.</p>
        )}
      </motion.div>
    </div>
  );
};
