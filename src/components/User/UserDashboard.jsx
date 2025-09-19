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
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <motion.h1
        className="text-3xl font-bold mb-8 text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        User Dashboard
      </motion.h1>

      {/* Budget Overview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {[
          {
            title: "Budget",
            value: budget.reduce((a, i) => a + i.amount, 0),
            color: "text-indigo-400",
          },
          {
            title: "Total Income",
            value: income.reduce((a, i) => a + i.amount, 0),
            color: "text-green-400",
          },
          {
            title: "Total Expenses",
            value: expenses.reduce((a, e) => a + e.amount, 0),
            color: "text-red-400",
          },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.03 }}
            className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg p-6 transition-all duration-200`}
          >
            <h2 className="text-lg font-medium text-white/80">{item.title}</h2>
            <p className={`text-2xl font-bold mt-2 ${item.color}`}>
              ₹{item.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-4">
            Income vs Expenses
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                {
                  name: "Income",
                  amount: income.reduce((a, i) => a + i.amount, 0),
                },
                {
                  name: "Expenses",
                  amount: expenses.reduce((a, e) => a + e.amount, 0),
                },
              ]}
            >
              <XAxis dataKey="name" stroke="#D1D5DB" />
              <YAxis stroke="#D1D5DB" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  borderRadius: 8,
                  color: "#fff",
                }}
              />
              <Bar dataKey="amount" fill="#4F46E5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-4">
            Expense Breakdown
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenses.map((e) => ({
                  name: e.category,
                  value: e.amount,
                }))}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={{ fill: "#fff" }}
              >
                {expenses.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend wrapperStyle={{ color: "#fff" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  borderRadius: 8,
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
