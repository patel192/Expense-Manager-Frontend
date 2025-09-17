import React, { useEffect, useState } from "react";
import Card from "../Common/Card";
import { motion } from "framer-motion";
import axios from "axios";
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

const COLORS = ["#4e79a7", "#59a14f", "#f28e2b", "#e15759"];

export const ReportAdmins = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get("/adminreport");
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
        className="text-center mt-10 text-lg font-semibold text-gray-600"
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
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Page Title */}
      <motion.h2
        initial={{ y: -15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center text-4xl font-extrabold text-gray-800 mb-10"
      >
        📊 Admin Analytics Dashboard
      </motion.h2>

      {/* Stat Cards */}
      <div className="flex flex-wrap justify-center gap-6 mb-12">
        {reportStats.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
            }}
            className="bg-white rounded-2xl p-5 shadow-md w-56 text-center"
          >
            <p className="text-sm text-gray-500">{item.title}</p>
            <p className="text-2xl font-bold text-gray-800 mt-2">
              {item.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-10">
        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
            💰 Income vs Expenses
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Bar
                dataKey="amount"
                fill="#4e79a7"
                radius={[6, 6, 0, 0]}
                barSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
            📂 Category-wise Distribution
          </h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#4e79a7"
                  dataKey="value"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-400">
              No category data available.
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
};
