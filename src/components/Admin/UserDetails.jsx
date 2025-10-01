import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../Utils/axiosInstance";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Legend,
  ResponsiveContainer,
  Line,
  CartesianGrid,
} from "recharts";
import { User } from "lucide-react";

export const UserDetails = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [income, setIncome] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [budget, setBudget] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [incomeRes, budgetRes, transactionRes, userRes] = await Promise.all([
        axiosInstance.get(`/incomesbyUserID/${userId}`),
        axiosInstance.get(`/budgetsbyUserID/${userId}`),
        axiosInstance.get(`/transactionsByUserId/${userId}`),
        axiosInstance.get(`/user/${userId}`),
      ]);

      setIncome(incomeRes.data.data || []);
      setBudget(budgetRes.data.data || []);
      setTransactions(transactionRes.data.data || []);
      setUser(userRes.data.data || null);
    } catch (err) {
      console.error("Error fetching user details", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  const totalIncome = income.reduce((sum, inc) => sum + (inc.amount || 0), 0);
  const totalBudget = budget.reduce((sum, b) => sum + (b.amount || 0), 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, exp) => sum + (exp.amount || 0), 0);

  return (
    <div className="p-4 md:p-6 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {loading ? (
        <div className="flex flex-col gap-4 items-center">
          <div className="h-6 w-40 md:w-48 bg-white/10 animate-pulse rounded-lg"></div>
          <div className="h-32 md:h-40 w-full max-w-2xl bg-white/10 animate-pulse rounded-2xl"></div>
        </div>
      ) : (
        <>
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="backdrop-blur-xl bg-white/10 p-4 md:p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row gap-6 items-center mb-8"
          >
            {/* Avatar */}
            {user?.profilePic ? (
              <img
                src={user.profilePic}
                alt={user.name}
                className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white/20 object-cover shadow-lg"
              />
            ) : (
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-2xl md:text-3xl shadow-lg">
                <User className="text-white w-10 h-10 md:w-14 md:h-14" />
              </div>
            )}

            {/* Details */}
            <div className="text-center sm:text-left flex-1">
              <h2 className="text-xl md:text-2xl font-bold">{user?.name || "Unknown User"}</h2>
              <p className="text-gray-300 text-sm md:text-base">{user?.email || "No Email"}</p>
              <span
                className={`inline-block mt-2 px-3 py-1 text-xs md:text-sm rounded-full ${
                  user?.role === "Admin"
                    ? "bg-red-500/20 text-red-300 border border-red-500/30"
                    : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                }`}
              >
                {user?.role || "User"}
              </span>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs md:text-sm">
                <div>
                  <p className="text-gray-400">Joined On</p>
                  <p>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-400">Total Transactions</p>
                  <p>{transactions.length}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-gray-400">Bio</p>
                  <p>{user?.bio || "No bio provided."}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8">
            {[
              { label: "Total Income", value: totalIncome, color: "from-indigo-500 to-purple-500" },
              { label: "Total Budget", value: totalBudget, color: "from-green-500 to-emerald-500" },
              { label: "Total Expenses", value: totalExpense, color: "from-red-500 to-pink-500" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                className={`backdrop-blur-xl bg-gradient-to-r ${stat.color} p-4 md:p-6 rounded-2xl shadow-lg text-center`}
              >
                <p className="text-xs md:text-sm text-white/80">{stat.label}</p>
                <p className="text-xl md:text-3xl font-bold">₹{stat.value.toFixed(2)}</p>
              </motion.div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Income vs Expense */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-lg p-4"
            >
              <h3 className="text-base md:text-lg font-semibold mb-4">Income vs Expense</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={[
                    { name: "Income", amount: totalIncome },
                    { name: "Expense", amount: totalExpense },
                  ]}
                >
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#6366F1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Monthly Income & Expenses */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-lg p-4"
            >
              <h3 className="text-base md:text-lg font-semibold mb-4">Monthly Income & Expenses</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={(() => {
                    const grouped = {};
                    transactions.forEach((t) => {
                      const date = new Date(t.date);
                      const month = date.toLocaleString("default", { month: "short" });
                      if (!grouped[month]) grouped[month] = { month, expense: 0, income: 0 };
                      if (t.type === "expense") grouped[month].expense += t.amount || 0;
                      else grouped[month].income += t.amount || 0;
                    });
                    return Object.values(grouped);
                  })()}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="income" fill="#10B981" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="expense" fill="#EF4444" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Yearly Trend */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6 backdrop-blur-xl bg-white/10 rounded-2xl shadow-lg p-4"
          >
            <h3 className="text-base md:text-lg font-semibold mb-4">Yearly Trend (All Months)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart
                data={(() => {
                  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                  const grouped = months.map((m) => ({ month: m, expense: 0, income: 0 }));
                  transactions.forEach((t) => {
                    const date = new Date(t.date);
                    const month = date.toLocaleString("default", { month: "short" });
                    const entry = grouped.find((g) => g.month === month);
                    if (entry) {
                      if (t.type === "expense") entry.expense += t.amount || 0;
                      else entry.income += t.amount || 0;
                    }
                  });
                  return grouped;
                })()}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#10B981" strokeWidth={3} dot />
                <Line type="monotone" dataKey="expense" stroke="#EF4444" strokeWidth={3} dot />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </>
      )}
    </div>
  );
};
