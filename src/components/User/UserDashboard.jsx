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

  const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#3B82F6"];
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

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-indigo-900 via-gray-900 to-black text-white">
      <motion.h1
        className="text-4xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-500"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        User Dashboard
      </motion.h1>

      {/* Budget Overview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {[
          { title: "Budget", value: budget.reduce((a, i) => a + i.amount, 0), color: "text-indigo-400" },
          { title: "Total Income", value: income.reduce((a, i) => a + i.amount, 0), color: "text-green-400" },
          { title: "Total Expenses", value: expenses.reduce((a, e) => a + e.amount, 0), color: "text-red-400" },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-lg font-medium">{item.title}</h2>
            <p className={`text-2xl font-bold ${item.color}`}>
              ₹{item.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6"
        >
          <h2 className="text-lg font-semibold mb-4">Income vs Expenses</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                { name: "Income", amount: income.reduce((a, i) => a + i.amount, 0) },
                { name: "Expenses", amount: expenses.reduce((a, e) => a + e.amount, 0) },
              ]}
            >
              <XAxis dataKey="name" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip />
              <Bar dataKey="amount" fill="#818CF8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6"
        >
          <h2 className="text-lg font-semibold mb-4">Expense Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenses.map((e) => ({ name: e.category, value: e.amount }))}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {expenses.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};
