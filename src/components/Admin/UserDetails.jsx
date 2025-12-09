import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../Utils/axiosInstance";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";
import { User, Calendar, TrendingUp, TrendingDown } from "lucide-react";

export const UserDetails = () => {
  const { userId } = useParams();

  const [user, setUser] = useState(null);
  const [income, setIncome] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [budget, setBudget] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [incomeRes, budgetRes, txRes, userRes] = await Promise.all([
        axiosInstance.get(`/incomesbyUserID/${userId}`),
        axiosInstance.get(`/budgetsbyUserID/${userId}`),
        axiosInstance.get(`/transactionsByUserId/${userId}`),
        axiosInstance.get(`/user/${userId}`),
      ]);

      setIncome(incomeRes.data.data || []);
      setBudget(budgetRes.data.data || []);
      setTransactions(txRes.data.data || []);
      setUser(userRes.data.data || null);
    } catch (error) {
      console.log("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  const totalIncome = income.reduce((sum, i) => sum + (i.amount || 0), 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, e) => sum + (e.amount || 0), 0);
  const totalBudget = budget.reduce((sum, b) => sum + (b.amount || 0), 0);

  const monthlyData = (() => {
    const grouped = {};
    transactions.forEach((t) => {
      const m = new Date(t.date).toLocaleString("default", { month: "short" });
      if (!grouped[m]) grouped[m] = { month: m, income: 0, expense: 0 };
      if (t.type === "income") grouped[m].income += t.amount;
      else grouped[m].expense += t.amount;
    });
    return Object.values(grouped);
  })();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-gray-300">
        Loading user analytics…
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gradient-to-b from-[#0b0d11] via-[#0d0f13] to-black text-white">

      {/* ===================== PROFILE HERO ===================== */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full p-6 rounded-2xl bg-white/5 backdrop-blur-xl shadow-xl border border-white/10 mb-10"
      >
        <div className="flex flex-col sm:flex-row items-center gap-6">
          
          {/* Avatar */}
          {user?.profilePic ? (
            <img
              src={user.profilePic}
              alt={user.name}
              className="w-28 h-28 rounded-full border-4 border-white/20 object-cover shadow-lg"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <User className="w-14 h-14 text-white" />
            </div>
          )}

          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-gray-300">{user.email}</p>

            <div className="mt-3 flex flex-wrap gap-3 justify-center sm:justify-start">
              <span
                className={`px-4 py-1 rounded-full text-sm ${
                  user.role === "Admin"
                    ? "bg-red-500/20 text-red-300"
                    : "bg-blue-500/20 text-blue-300"
                }`}
              >
                {user.role}
              </span>

              <span className="flex items-center gap-1 text-gray-300 text-sm">
                <Calendar size={14} />
                Joined:{" "}
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ===================== ANALYTICS STRIP ===================== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          {
            label: "Total Income",
            value: totalIncome,
            icon: <TrendingUp className="text-green-400" />,
            color: "from-green-500 to-emerald-600",
          },
          {
            label: "Total Expenses",
            value: totalExpense,
            icon: <TrendingDown className="text-red-400" />,
            color: "from-red-500 to-pink-600",
          },
          {
            label: "Total Budget",
            value: totalBudget,
            icon: <TrendingUp className="text-blue-400" />,
            color: "from-blue-500 to-indigo-600",
          },
        ].map((card, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            className={`p-5 rounded-2xl bg-gradient-to-br ${card.color} shadow-lg backdrop-blur-xl border border-white/10 text-center`}
          >
            <div className="flex justify-center mb-2">{card.icon}</div>
            <p className="text-white/80 text-sm">{card.label}</p>
            <p className="text-2xl font-bold">₹{card.value}</p>
          </motion.div>
        ))}
      </div>

      {/* ===================== SPLIT CHARTS ===================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        
        {/* Income vs Expense */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl shadow-xl border border-white/10"
        >
          <h3 className="text-lg font-semibold mb-4">Income vs Expense</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={[
                { name: "Income", amount: totalIncome },
                { name: "Expense", amount: totalExpense },
              ]}
            >
              <XAxis dataKey="name" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip />
              <Bar dataKey="amount" fill="#6366f1" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Monthly Trends */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl shadow-xl border border-white/10"
        >
          <h3 className="text-lg font-semibold mb-4">Monthly Income / Expense</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={3} />
              <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* ===================== TIMELINE (RECENT ACTIVITY) ===================== */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl"
      >
        <h3 className="text-lg font-semibold mb-6">Recent Activity Timeline</h3>

        <div className="space-y-6 relative">

          {/* Vertical line */}
          <div className="absolute left-[8px] top-2 bottom-2 w-[2px] bg-white/20"></div>

          {transactions.slice(0, 6).map((tx, idx) => (
            <div key={idx} className="flex items-start gap-4 relative pl-6">
              <span
                className={`w-4 h-4 rounded-full absolute left-0 top-1.5 ${
                  tx.type === "income"
                    ? "bg-green-400"
                    : "bg-red-400"
                }`}
              ></span>

              <div>
                <p className="font-semibold">
                  {tx.type === "income" ? "Received" : "Spent"}: ₹{tx.amount}
                </p>
                <p className="text-gray-400 text-sm">
                  {new Date(tx.date).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
