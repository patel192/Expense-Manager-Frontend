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

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

export const ReportAdmins = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/adminreport");
        setStats(res.data);
        console.log("Admin Report:", res.data);
      } catch (error) {
        console.error("Failed to fetch report data", error);
      }
    };

    fetchReport();
  }, []);

  if (!stats) return <div className="text-center mt-10">Loading report...</div>;

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
    { name: "Expenses", amount: stats.totalExpense }, // not totalExpenses
  ];

  const pieData = stats.categoryDistribution || [];
  console.log(stats.categoryDistribution);
  return (
    <div className="p-6">
      <h2 className="text-center text-2xl font-bold mb-6">
        📊 Admin Report Dashboard
      </h2>

      {/* Stat Cards */}
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        {reportStats.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card title={item.title} value={item.value} />
          </motion.div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-10">
        <h3 className="text-xl font-semibold text-center mb-4">
          💰 Income vs Expenses
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#2e7d32" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <h3 className="text-xl font-semibold text-center mb-4">
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
                fill="#8884d8"
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
          <p className="text-center text-gray-500">
            No category data available.
          </p>
        )}
      </div>
    </div>
  );
};
