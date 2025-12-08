import React, { useEffect, useState } from "react";
import axiosInstance from "../Utils/axiosInstance";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

export const UserDashboard = () => {
  const [budget, setBudget] = useState([]);
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [bills, setBills] = useState([]);
  const [recurring, setRecurring] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const COLORS = ["#06b6d4", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];
  const userId = localStorage.getItem("id");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          budgetRes,
          incomeRes,
          expenseRes,
          billsRes,
          recurringRes,
          txnRes,
        ] = await Promise.all([
          axiosInstance.get(`/budgetsbyUserID/${userId}`),
          axiosInstance.get(`/incomesbyUserID/${userId}`),
          axiosInstance.get(`/expensesbyUserID/${userId}`),
          axiosInstance.get(`/billByuserId/${userId}`),
          axiosInstance.get(`/recurring/${userId}`),
          axiosInstance.get(`/transactionsByUserID/${userId}`),
        ]);

        setBudget(budgetRes.data.data);
        setIncome(incomeRes.data.data);
        setExpenses(expenseRes.data.data);
        setBills(billsRes.data.data);
        setRecurring(recurringRes.data.data);
        setTransactions(txnRes.data.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };
    fetchData();
  }, [userId]);

  const totalBudget = budget.reduce((a, i) => a + i.amount, 0);
  const totalIncome = income.reduce((a, i) => a + i.amount, 0);
  const totalExpenses = expenses.reduce((a, e) => a + e.amount, 0);

  return (
    <div className="text-white space-y-10">

      {/* ========== HEADER ========== */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold">
          Financial Overview
        </h1>
        <p className="text-gray-400 mt-2">
          A consolidated view of your financial performance.
        </p>
      </motion.div>

      {/* ========== METRICS ========== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: "Total Budget", value: totalBudget, color: "text-cyan-400" },
          { title: "Total Income", value: totalIncome, color: "text-emerald-400" },
          { title: "Total Expenses", value: totalExpenses, color: "text-rose-400" },
        ].map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl bg-[#111318] border border-white/10 p-6 shadow-lg"
          >
            <h2 className="text-gray-400 text-sm">{item.title}</h2>
            <p className={`mt-2 text-3xl font-bold ${item.color}`}>
              ₹{item.value.toLocaleString()}
            </p>
          </motion.div>
        ))}
      </div>

      {/* ========== CHARTS ========== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* ==== Income vs Expenses Chart ==== */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl bg-[#111318] border border-white/10 p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold mb-4 text-white">
            Income vs Expenses
          </h3>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={[
                { name: "Income", amount: totalIncome },
                { name: "Expenses", amount: totalExpenses },
              ]}
            >
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111318",
                  border: "1px solid #2a2d34",
                  color: "#fff",
                }}
              />
              <Bar dataKey="amount" fill="#3b82f6" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* ==== Expense Distribution Pie Chart ==== */}
        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl bg-[#111318] border border-white/10 p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold mb-4 text-white">
            Expense Distribution
          </h3>

          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={expenses.map((e) => ({
                  name: e.category,
                  value: e.amount,
                }))}
                cx="50%"
                cy="50%"
                outerRadius={95}
                dataKey="value"
                label
              >
                {expenses.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>

              <Legend
                wrapperStyle={{ color: "#d1d5db", fontSize: 12 }}
                verticalAlign="bottom"
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#111318",
                  border: "1px solid #2a2d34",
                  color: "#fff",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

      </div>
    </div>
  );
};
