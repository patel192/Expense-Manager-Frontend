import React, { useState, useEffect } from "react";
import axiosInstance from "../../Utils/axiosInstance";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { FaChartLine } from "react-icons/fa";

export const IncomeSummary = () => {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState({});
  const [tips, setTips] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("id");
        const [incomeRes, expenseRes] = await Promise.all([
          axiosInstance.get(`/incomesbyUserId/${userId}`),
          axiosInstance.get(`/expensesbyUserId/${userId}`),
        ]);

        const incomesData = incomeRes.data.data || [];
        const expensesData = expenseRes.data.data || [];

        setIncomes(incomesData);
        setExpenses(expensesData);

        // Calculate totals
        const totalIncome = incomesData.reduce((sum, i) => sum + i.amount, 0);
        const totalExpense = expensesData.reduce((sum, e) => sum + e.amount, 0);
        const netSavings = totalIncome - totalExpense;
        const savingsRate = totalIncome > 0 ? ((netSavings / totalIncome) * 100).toFixed(2) : 0;

        setStats({ totalIncome, totalExpense, netSavings, savingsRate });

        // Monthly income vs expense
        const months = Array.from({ length: 12 }, () => ({ income: 0, expense: 0 }));

        incomesData.forEach((inc) => {
          const month = new Date(inc.date).getMonth();
          months[month].income += inc.amount;
        });

        expensesData.forEach((exp) => {
          const month = new Date(exp.date).getMonth();
          months[month].expense += exp.amount;
        });

        setChartData(
          months.map((m, idx) => ({
            month: new Date(0, idx).toLocaleString("default", { month: "short" }),
            income: m.income,
            expense: m.expense,
          }))
        );

        // Financial tips
        let suggestedTips = [];
        if (savingsRate < 20) {
          suggestedTips = [
            "Track your daily expenses to cut unnecessary costs.",
            "Avoid impulse purchases – wait 24hrs before buying.",
            "Try cooking at home instead of eating out.",
          ];
        } else if (savingsRate < 40) {
          suggestedTips = [
            "Good job saving! Build an emergency fund (6 months).",
            "Automate monthly investments (SIP / index funds).",
            "Review subscriptions and cancel unused ones.",
          ];
        } else {
          suggestedTips = [
            "Excellent savings rate! Focus on long-term investments.",
            "Diversify into stocks, ETFs, or retirement funds.",
            "Explore passive income opportunities.",
          ];
        }
        setTips(suggestedTips);
      } catch (error) {
        console.error("Error fetching finance data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white space-y-8">
  {/* Header */}
  <div className="flex justify-center gap-3 items-center mb-6">
    <FaChartLine size={30} className="text-blue-400" />
    <h2 className="text-3xl font-bold text-center">Finance Dashboard</h2>
  </div>

  {/* Summary Cards */}
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
    {[
      { label: "Total Income", value: stats.totalIncome, color: "from-green-500 to-green-600" },
      { label: "Total Expenses", value: stats.totalExpense, color: "from-red-500 to-red-600" },
      { label: "Net Savings", value: stats.netSavings, color: "from-blue-500 to-blue-600" },
      { label: "Savings Rate", value: `${stats.savingsRate}%`, color: "from-purple-500 to-purple-600" },
    ].map((card, idx) => (
      <motion.div
        key={idx}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: idx * 0.2 }}
        className={`rounded-2xl shadow-lg p-6 text-center bg-gradient-to-r ${card.color} hover:scale-105 transform transition`}
      >
        <h3 className="text-lg font-semibold">{card.label}</h3>
        <p className="text-2xl font-bold mt-2">
          {typeof card.value === "number" ? `₹${card.value}` : card.value}
        </p>
      </motion.div>
    ))}
  </div>

  {/* Income vs Expense Chart */}
  <div className="w-full h-96 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg p-4">
    <h3 className="text-lg font-semibold mb-4 text-center">Income vs Expense (Monthly)</h3>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
        <XAxis dataKey="month" stroke="white" />
        <YAxis stroke="white" />
        <Tooltip
          contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", border: "none", color: "white" }}
          itemStyle={{ color: "white" }}
        />
        <Legend wrapperStyle={{ color: "white" }} />
        <Bar dataKey="income" fill="#22c55e" />
        <Bar dataKey="expense" fill="#ef4444" />
      </BarChart>
    </ResponsiveContainer>
  </div>

  {/* Financial Tips */}
  <div className="bg-yellow-100/20 backdrop-blur-sm rounded-2xl shadow-md p-6 border border-yellow-200/20">
    <h3 className="text-xl font-bold mb-4 text-yellow-300">💡 Financial Tips for You</h3>
    <ul className="list-disc pl-6 space-y-2 text-white/80">
      {tips.map((tip, idx) => (
        <li key={idx}>{tip}</li>
      ))}
    </ul>
  </div>
</div>

  );
};
