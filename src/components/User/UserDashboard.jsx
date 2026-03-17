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

  // =========================
  // EXPENSE INSIGHTS
  // =========================
  const [expenseInsights, setExpenseInsights] = useState("");
  const [loadingInsights, setLoadingInsights] = useState(false);

  //FINANCIAL FORECAST
  const [forecast, setForecast] = useState("");
  const [loadingForecast, setLoadingForecast] = useState(false);

  const [upcomingRecurring, setUpcomingRecurring] = useState([]);

  //SAVING OPPORTUNITY
  const [savingOpportunities, setSavingOpportunities] = useState("");
  const [loadingSavings, setLoadingSavings] = useState(false);

  //FINANCIAL HEALTH
  const [healthScore, setHealthScore] = useState("");
  const [loadingHealth, setLoadingHealth] = useState(false);

  // =========================
  // AI CHAT
  // =========================
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  // =========================
  // SPENDING RISK
  // =========================
  const [riskData, setRiskData] = useState(null);
  const [loadingRisk, setLoadingRisk] = useState(false);

  //ALL INSIGHTS
  const [allInsights, setAllInsights] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // =========================
  // SEND MESSAGE
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

  const fetchUpcomingRecurring = async () => {
    try {
      const res = await axiosInstance.get(`/recurring/upcoming/${userId}`);
      setUpcomingRecurring(res.data.data || []);
    } catch (error) {
      console.error("Error fetching upcoming recurring", error);
    }
  };
  // =========================
  // FETCH INSIGHTS
  // =========================
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

  //FETCH FORECAST
  const fetchForecast = async () => {
    try {
      setLoadingForecast(true);

      const res = await axiosInstance.get(`/ai/financial-forecast/${userId}`);
      setForecast(res.data.forecast);
    } catch (error) {
      console.error("Forecast error:", error);
    } finally {
      setLoadingForecast(false);
    }
  };

  //FETCH SAVING OPPORTUNITIES
  const fetchSavingOpportunities = async () => {
    try {
      setLoadingSavings(true);

      const res = await axiosInstance.get(`/ai/saving-opportunities/${userId}`);

      setSavingOpportunities(res.data.opportunities);
    } catch (error) {
      console.error("Saving opportunities error:", error);
    } finally {
      setLoadingSavings(false);
    }
  };

  //FETCH HEALTH SCORE
  const fetchHealthScore = async () => {
    try {
      setLoadingHealth(true);

      const res = await axiosInstance.get(`/ai/financial-health/${userId}`);

      setHealthScore(res.data.healthScore);
    } catch (error) {
      console.error("Health score error:", error);
    } finally {
      setLoadingHealth(false);
    }
  };

  // =========================
  // FETCH RISK
  // =========================
  const fetchRisk = async () => {
    try {
      setLoadingRisk(true);

      const res = await axiosInstance.get(`/ai/spending-risk/${userId}`);

      setRiskData(res.data.risk);
    } catch (error) {
      console.error("Risk detection error:", error);
    } finally {
      setLoadingRisk(false);
    }
  };

  //FETCH ALL INSIGHTS
  const fetchAllInsights = async () => {
    try {
      setLoadingHistory(true);
      const res = await axiosInstance.get(`/ai/insights/${userId}`);
      setAllInsights(res.data.insights);
    } catch (error) {
      console.error("Insight history error", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  // =========================
  // FETCH DASHBOARD DATA
  // =========================
  useEffect(() => {
    if (!userId) return;

    const fetchCoreData = async () => {
      try {
        const [budgetRes, incomeRes, expenseRes] = await Promise.all([
          axiosInstance.get(`/budgetsbyUserID/${userId}`),
          axiosInstance.get(`/incomesbyUserID/${userId}`),
          axiosInstance.get(`/expensesbyUserID/${userId}`),
        ]);

        setBudget(budgetRes.data.data || []);
        setIncome(incomeRes.data.data || []);
        setExpenses(expenseRes.data.data || []);
      } catch (err) {
        console.error("Error fetching core dashboard data:", err);
      }
    };

    fetchCoreData();
  }, [userId]);
  useEffect(() => {
    if (!userId) return;

    fetchUpcomingRecurring();
    const fetchSecondaryData = async () => {
      try {
        const [billsRes, recurringRes, txnRes] = await Promise.all([
          axiosInstance.get(`/billByuserId/${userId}`),
          axiosInstance.get(`/recurring/${userId}`),
          axiosInstance.get(`/transactionsByUserID/${userId}`),
        ]);

        setBills(billsRes.data.data || []);
        setRecurring(recurringRes.data.data || []);
        setTransactions(txnRes.data.data || []);
      } catch (err) {
        console.error("Error fetching secondary dashboard data:", err);
      }
    };

    fetchSecondaryData();
    fetchAllInsights();
  }, [userId]);

  const totalBudget = (budget || []).reduce((a, i) => a + i.amount, 0);
  const totalIncome = (income || []).reduce((a, i) => a + i.amount, 0);
  const totalExpenses = (expenses || []).reduce((a, e) => a + e.amount, 0);

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
      {/* SPENDING RISK DETECTOR */}
      {/* ========================= */}
      <motion.div className="rounded-3xl bg-[#111318] border border-white/10 p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">AI Spending Risk Detector</h3>

          {!riskData && (
            <button
              onClick={fetchRisk}
              className="bg-red-500 px-4 py-2 rounded text-sm hover:bg-red-600"
            >
              Analyze Risk
            </button>
          )}
        </div>

        {loadingRisk ? (
          <p className="text-gray-400 animate-pulse">
            AI is analyzing your spending behavior...
          </p>
        ) : riskData ? (
          <div
            className={`rounded-xl p-4 border ${
              riskData.riskLevel === "High"
                ? "border-red-500 bg-red-500/10"
                : riskData.riskLevel === "Medium"
                  ? "border-yellow-500 bg-yellow-500/10"
                  : "border-emerald-500 bg-emerald-500/10"
            }`}
          >
            <p className="font-semibold mb-2">
              Risk Level: {riskData.riskLevel}
            </p>

            <p className="text-gray-300">
              <strong>Category:</strong> {riskData.category}
            </p>

            <p className="text-gray-300">
              <strong>Reason:</strong> {riskData.reason}
            </p>

            <p className="text-gray-300">
              <strong>Suggestion:</strong> {riskData.suggestion}
            </p>
          </div>
        ) : (
          <p className="text-gray-400">
            Click "Analyze Risk" to evaluate spending risk.
          </p>
        )}
      </motion.div>

      {/* ========================= */}
      {/* EXPENSE INSIGHTS */}
      {/* ========================= */}
      <motion.div className="rounded-3xl bg-[#111318] border border-white/10 p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">AI Financial Insights</h3>

          {!expenseInsights && (
            <button
              onClick={fetchExpenseInsights}
              className="bg-cyan-500 px-4 py-2 rounded text-sm hover:bg-cyan-600"
            >
              Generate Insights
            </button>
          )}
        </div>

        {loadingInsights ? (
          <p className="text-gray-400 animate-pulse">
            AI is analyzing your spending...
          </p>
        ) : expenseInsights ? (
          <div className="bg-[#1a1d24] rounded-xl p-4 border border-white/5">
            <ReactMarkdown>{expenseInsights}</ReactMarkdown>
          </div>
        ) : (
          <p className="text-gray-400">
            Click "Generate Insights" to analyze your financial behavior.
          </p>
        )}
      </motion.div>

      {/* ========================= */}
      {/* FINANCIAL FORECAST */}
      {/* ========================= */}

      <motion.div className="rounded-3xl bg-[#111318] border border-white/10 p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">AI Financial Forecast</h3>

          {!forecast && (
            <button
              onClick={fetchForecast}
              className="bg-purple-500 px-4 py-2 rounded text-sm hover:bg-purple-600"
            >
              Generate Forecast
            </button>
          )}
        </div>

        {loadingForecast ? (
          <p className="text-gray-400 animate-pulse">
            AI is predicting your financial future...
          </p>
        ) : forecast ? (
          <div className="bg-[#1a1d24] rounded-xl p-4 border border-white/5">
            <ReactMarkdown>{forecast}</ReactMarkdown>
          </div>
        ) : (
          <p className="text-gray-400">
            Click "Generate Forecast" to see your financial projection.
          </p>
        )}
      </motion.div>

      {/* ========================= */}
      {/* SAVING OPPORTUNITIES */}
      {/* ========================= */}

      <motion.div className="rounded-3xl bg-[#111318] border border-white/10 p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">AI Saving Opportunities</h3>

          {!savingOpportunities && (
            <button
              onClick={fetchSavingOpportunities}
              className="bg-emerald-500 px-4 py-2 rounded text-sm hover:bg-emerald-600"
            >
              Analyze Savings
            </button>
          )}
        </div>

        {loadingSavings ? (
          <p className="text-gray-400 animate-pulse">
            AI is analyzing your spending patterns...
          </p>
        ) : savingOpportunities ? (
          <div className="bg-[#1a1d24] rounded-xl p-4 border border-white/5">
            <div
              className="prose prose-invert max-w-none text-gray-300
        prose-headings:text-white
        prose-strong:text-emerald-400
        prose-li:text-gray-300"
            >
              <ReactMarkdown>{savingOpportunities}</ReactMarkdown>
            </div>
          </div>
        ) : (
          <p className="text-gray-400">
            Click "Analyze Savings" to find potential saving opportunities.
          </p>
        )}
      </motion.div>

      {/* ========================= */}
      {/* FINANCIAL HEALTH SCORE */}
      {/* ========================= */}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-[#111318] border border-white/10 p-6 shadow-lg"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">AI Financial Health Score</h3>

          {!healthScore && (
            <button
              onClick={fetchHealthScore}
              className="bg-purple-500 px-4 py-2 rounded text-sm hover:bg-purple-600"
            >
              Calculate Score
            </button>
          )}
        </div>

        {loadingHealth ? (
          <p className="text-gray-400 animate-pulse">
            AI is evaluating your financial health...
          </p>
        ) : healthScore ? (
          <div className="bg-[#1a1d24] rounded-xl p-4 border border-white/5">
            <div
              className="prose prose-invert max-w-none text-gray-300
        prose-headings:text-white
        prose-strong:text-purple-400
        prose-li:text-gray-300"
            >
              <ReactMarkdown>{healthScore}</ReactMarkdown>
            </div>
          </div>
        ) : (
          <p className="text-gray-400">
            Click "Calculate Score" to evaluate your financial health.
          </p>
        )}
      </motion.div>

      {/* ========================= */}
      {/* AI CHAT */}
      {/* ========================= */}

      <motion.div className="rounded-3xl bg-[#111318] border border-white/10 p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">AI Financial Assistant</h3>

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

      {/* Upcoming Expenses */}
      <div className="rounded-3xl bg-[#111318] border border-white/10 p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">
          Upcoming Recurring Payments
        </h3>

        {upcomingRecurring.length === 0 ? (
          <p className="text-gray-400">No upcoming recurring payments</p>
        ) : (
          <ul className="space-y-3">
            {upcomingRecurring.map((item) => (
              <li key={item._id} className="flex justify-between">
                <span>{item.title}</span>

                <span className="text-gray-400">
                  ₹{item.amount} •{" "}
                  {new Date(item.nextDate).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* ========================= */}
      {/* AI INSIGHT HISTORY */}
      {/* ========================= */}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-[#111318] border border-white/10 p-6 shadow-lg"
      >
        <h3 className="text-lg font-semibold mb-4">AI Insight History</h3>

        {loadingHistory ? (
          <p className="text-gray-400 animate-pulse">
            Loading insight history...
          </p>
        ) : !allInsights || allInsights.length === 0 ? (
          <p className="text-gray-400">No AI insights generated yet.</p>
        ) : (
          <div className="space-y-4">
            {allInsights.map((item) => (
              <div
                key={item._id}
                className="bg-[#1a1d24] border border-white/5 rounded-xl p-4"
              >
                {/* Insight Header */}

                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-cyan-400 capitalize">
                    {item.type.replace("-", " ")}
                  </span>

                  <span className="text-xs text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Insight Content */}

                <div
                  className="prose prose-invert max-w-none text-gray-300
            prose-headings:text-white
            prose-strong:text-cyan-400
            prose-li:text-gray-300"
                >
                  <ReactMarkdown>{item.content}</ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};
