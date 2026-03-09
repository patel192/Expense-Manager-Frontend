import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
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
import { useAuth } from "../../context/AuthContext";

export const UserDashboard = () => {
  const { user } = useAuth();
  const userId = user?._id;

  const [budget, setBudget] = useState([]);
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [bills, setBills] = useState([]);
  const [recurring, setRecurring] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const COLORS = ["#06b6d4", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

  // AI EXPENSE INSIGHTS STATE
  const [expenseInsights, setExpenseInsights] = useState("");
  const [loadingInsights, setLoadingInsights] = useState(false);

  // =========================
  // AI CHAT STATE
  // =========================
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  // =========================
  // SEND MESSAGE TO AI
  // =========================
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      setLoadingAI(true);

      const res = await axiosInstance.post("/ai/ask", {
        message: input,
      });

      const aiMessage = {
        role: "ai",
        text: res.data?.reply || "AI returned no response.",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI chat error:", error);

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "AI failed to respond." },
      ]);
    } finally {
      setLoadingAI(false);
    }
  };

  const fetchExpenseInsights = async () => {
    try {
      setLoadingInsights(true);
      const res = await axiosInstance.get(`/ai/expense-insights/${userId}`);
      setExpenseInsights(res.data.insights);
    } catch (err) {
      console.error("Insights Error", err);
    } finally {
      setLoadingInsights(false);
    }
  };
  // =========================
  // FETCH DASHBOARD DATA
  // =========================
  useEffect(() => {
    if (!userId) return;

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

        fetchExpenseInsights();
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
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold">Financial Overview</h1>
        <p className="text-gray-400 mt-2">
          A consolidated view of your financial performance.
        </p>
      </motion.div>

      {/* METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: "Total Budget", value: totalBudget, color: "text-cyan-400" },
          {
            title: "Total Income",
            value: totalIncome,
            color: "text-emerald-400",
          },
          {
            title: "Total Expenses",
            value: totalExpenses,
            color: "text-rose-400",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -4 }}
            className="rounded-2xl bg-[#111318] border border-white/10 p-6 shadow-lg"
          >
            <h2 className="text-gray-400 text-sm">{item.title}</h2>
            <p className={`mt-2 text-3xl font-bold ${item.color}`}>
              ₹{item.value.toLocaleString()}
            </p>
          </motion.div>
        ))}
      </div>

      {/* ========================= */}
      {/* AI CHAT SECTION */}
      {/* ========================= */}
      <motion.div className="rounded-3xl bg-[#111318] border border-white/10 p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">AI Financial Assistant</h3>

        {/* Chat messages */}
        <div className="h-64 overflow-y-auto space-y-3 mb-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg max-w-[80%] ${
                msg.role === "user"
                  ? "bg-blue-500 ml-auto text-white"
                  : "bg-gray-700 text-gray-200"
              }`}
            >
              {msg.text}
            </div>
          ))}

          {loadingAI && <p className="text-gray-400">AI is thinking...</p>}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI about your finances..."
            className="flex-1 p-2 rounded bg-[#1a1d24] border border-gray-700 text-white"
          />

          <button
            onClick={sendMessage}
            className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </motion.div>

      {/* EXPENSE SUMMARY SECTION  */}
      <motion.div className="rounded-3xl bg-[#111318] border border-white/10 p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">AI Financial Insights</h3>

        {loadingInsights ? (
          <p className="text-gray-400">Analyzing your spending...</p>
        ) : (
          <div className="prose prose-invert max-w-none text-gray-300">
            <ReactMarkdown>{expenseInsights}</ReactMarkdown>
          </div>
        )}
      </motion.div>
      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div className="rounded-3xl bg-[#111318] border border-white/10 p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Income vs Expenses</h3>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={[
                { name: "Income", amount: totalIncome },
                { name: "Expenses", amount: totalExpenses },
              ]}
            >
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip />
              <Bar dataKey="amount" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div className="rounded-3xl bg-[#111318] border border-white/10 p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Expense Distribution</h3>

          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={expenses.map((e) => ({
                  name: e.categoryID?.name || "Other",
                  value: e.amount,
                }))}
                dataKey="value"
                outerRadius={95}
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
