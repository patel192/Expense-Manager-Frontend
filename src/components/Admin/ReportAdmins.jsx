import React from "react";
import Card from "../Common/Card";
import { motion } from "framer-motion";
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

export const ReportAdmins = () => {
  const reportStats = [
    { title: "Total Users", value: 15 },
    { title: "Active Users", value: 13 },
    { title: "Deactivated Users", value: 2 },
    { title: "Total Categories", value: 9 },
    { title: "Total Income (₹)", value: "₹55,000" },
    { title: "Total Expenses (₹)", value: "₹38,000" },
    { title: "Top Category", value: "Marketing" },
    { title: "Most Active User", value: "Patel Muhammad" },
  ];

  const barData = [
    { name: "Income", amount: 55000 },
    { name: "Expenses", amount: 38000 },
  ];

  const pieData = [
    { name: "Marketing", value: 30000 },
    { name: "Rent", value: 12000 },
    { name: "Travel", value: 8000 },
    { name: "Maintenance", value: 6000 },
  ];

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

  return (
    <div style={{ padding: "30px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "25px" }}>
        📊 Admin Report Dashboard
      </h2>

      {/* Cards */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "20px",
        }}
      >
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
      <div style={{ marginTop: "40px", textAlign: "center" }}>
        <h3>💰 Income vs Expenses</h3>
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
      <div style={{ marginTop: "40px", textAlign: "center" }}>
        <h3>📂 Category-wise Distribution</h3>
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
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
