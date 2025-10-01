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
} from "recharts";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444"];

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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center h-[70vh] text-lg sm:text-xl font-semibold text-gray-400 px-4 text-center"
      >
        Loading report...
      </motion.div>
    );

  const reportStats = [
    { title: "Total Users", value: stats.totalUsers },
    { title: "Active Users", value: stats.activeUsers },
    { title: "Deactivated Users", value: stats.deactivatedUsers },
    { title: "Total Income (₹)", value: `₹${stats.totalIncome}` },
    { title: "Total Expenses (₹)", value: `₹${stats.totalExpense}` },
    { title: "Most Active User", value: stats.mostActiveUser || "N/A" },
  ];

  const barData = [
    { name: "Income", amount: stats.totalIncome },
    { name: "Expenses", amount: stats.totalExpense },
  ];

  const pieData = stats.categoryDistribution || [];

  return (
    <div className="p-4 sm:p-6 bg-gray-900 min-h-screen text-white">
      {/* Page Title */}
      <motion.h2
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center text-2xl sm:text-3xl md:text-4xl font-extrabold mb-8 sm:mb-10 text-indigo-400"
      >
        Admin Analytics Dashboard
      </motion.h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10 sm:mb-12">
        {reportStats.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            }}
            className="bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-700"
          >
            <p className="text-xs sm:text-sm text-gray-400">{item.title}</p>
            <p className="text-lg sm:text-2xl font-bold text-indigo-400 mt-2 break-words">
              {item.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">
        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 border border-gray-700 min-w-0"
        >
          <h3 className="text-base sm:text-lg font-semibold text-gray-300 mb-4 text-center">
            Income vs Expenses
          </h3>
          <ResponsiveContainer width="100%" height={250} minWidth={0}>
            <BarChart data={barData}>
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ background: "#1f2937", color: "white" }} />
              <Bar dataKey="amount" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 border border-gray-700 min-w-0"
        >
          <h3 className="text-base sm:text-lg font-semibold text-gray-300 mb-4 text-center">
            Category-wise Distribution
          </h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250} minWidth={0}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#1f2937", color: "white" }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-400 text-sm">No category data available.</p>
          )}
        </motion.div>
      </div>
    </div>
  );
};
