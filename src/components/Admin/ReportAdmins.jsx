import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axiosInstance from "../Utils/axiosInstance";
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
  LineChart,
  Line,
} from "recharts";

const COLORS = ["#818cf8", "#34d399", "#fbbf24", "#f87171", "#a855f7"];

export const ReportAdmins = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axiosInstance.get("/adminreport");
        setStats(res.data);
      } catch (error) {
        console.error("Failed to fetch report data", error);
      }
    };
    fetchReport();
  }, []);

  if (!stats)
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
    <div className="p-6 sm:p-10 min-h-screen text-white bg-gradient-to-br from-gray-900 via-[#0c0e12] to-black space-y-10">
      
      {/* HEADER */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl sm:text-4xl font-bold text-center bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent"
      >
        Admin Analytics Overview
      </motion.h1>

      {/* KPIs GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpis.map((kpi, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07 }}
            whileHover={{ scale: 1.04 }}
            className="rounded-2xl p-6 bg-white/10 backdrop-blur-xl shadow-xl border border-white/10 hover:border-white/20"
          >
            <p className="text-sm text-gray-300">{kpi.label}</p>

            <h3
              className={`text-3xl font-bold bg-gradient-to-r ${kpi.color} bg-clip-text text-transparent`}
            >
              {kpi.value}
            </h3>

            <p className="text-xs mt-3 opacity-70">{kpi.trend}</p>
          </motion.div>
        ))}
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* GLASS PANEL - BAR CHART */}
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl bg-white/10 backdrop-blur-xl p-6 shadow-xl border border-white/10"
        >
          <h2 className="text-lg font-semibold mb-4 text-gray-300 text-center">
            Income vs Expense Overview
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ background: "#111", borderRadius: 10 }} />
              <Bar dataKey="amount" fill="#818cf8" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* GLASS PANEL - PIE CHART */}
        <motion.div
          initial={{ opacity: 0, x: 25 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl bg-white/10 backdrop-blur-xl p-6 shadow-xl border border-white/10"
        >
          <h2 className="text-lg font-semibold mb-4 text-gray-300 text-center">
            Category Distribution
          </h2>

          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={55}
                  paddingAngle={4}
                  dataKey="value"
                  label
                >
                  {pieData.map((entry, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-center text-sm">No category data available.</p>
          )}
        </motion.div>

      </div>

      {/* BOTTOM HIGHLIGHT SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white/10 backdrop-blur-xl p-6 shadow-xl border border-white/10"
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-300">Highlights</h2>

        <ul className="space-y-3 text-gray-300">
          <li>• Highest Income Recorded: ₹{stats.totalIncome}</li>
          <li>• Most Active User: {stats.mostActiveUser || "N/A"}</li>
          <li>• Deactivated Users: {stats.deactivatedUsers}</li>
          <li>• Total Expense: ₹{stats.totalExpense}</li>
        </ul>
      </motion.div>
    </div>
  );
};
