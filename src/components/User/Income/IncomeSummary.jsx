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

        const totalIncome = incomesData.reduce((sum, i) => sum + i.amount, 0);
        const totalExpense = expensesData.reduce((sum, e) => sum + e.amount, 0);
        const netSavings = totalIncome - totalExpense;
        const savingsRate =
          totalIncome > 0 ? ((netSavings / totalIncome) * 100).toFixed(2) : 0;

        setStats({ totalIncome, totalExpense, netSavings, savingsRate });

        const months = Array.from({ length: 12 }, () => ({
          income: 0,
          expense: 0,
        }));

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
            month: new Date(0, idx).toLocaleString("default", {
              month: "short",
            }),
            income: m.income,
            expense: m.expense,
          }))
        );

        let suggestedTips = [];
        if (savingsRate < 20) {
          suggestedTips = [
            "Track your expenses closely — small leaks sink big ships.",
            "Avoid impulse spending; wait a day before making non-essential purchases.",
            "Prepare home-cooked meals to reduce daily costs.",
          ];
        } else if (savingsRate < 40) {
          suggestedTips = [
            "You’re doing well! Build an emergency fund for 6 months of expenses.",
            "Automate your savings or SIPs to stay consistent.",
            "Revisit recurring subscriptions and cancel unused ones.",
          ];
        } else {
          suggestedTips = [
            "Strong performance — consider diversifying investments.",
            "Focus on long-term wealth growth through index funds or ETFs.",
            "Explore low-effort passive income opportunities.",
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
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white space-y-10">
      {/* Header */}
      <div className="flex justify-center items-center gap-3">
        <FaChartLine size={28} className="text-blue-400" />
        <h2 className="text-3xl font-semibold tracking-tight">
          Finance Overview
        </h2>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Income",
            value: stats.totalIncome,
            color: "from-green-500 to-emerald-600",
          },
          {
            label: "Total Expenses",
            value: stats.totalExpense,
            color: "from-red-500 to-rose-600",
          },
          {
            label: "Net Savings",
            value: stats.netSavings,
            color: "from-blue-500 to-indigo-600",
          },
          {
            label: "Savings Rate",
            value: `${stats.savingsRate}%`,
            color: "from-purple-500 to-violet-600",
          },
        ].map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.15 }}
            className={`rounded-2xl p-6 bg-gradient-to-br ${card.color} shadow-xl hover:shadow-2xl hover:scale-105 transition-all`}
          >
            <h3 className="text-sm uppercase text-white/70 tracking-wide">
              {card.label}
            </h3>
            <p className="text-3xl font-bold mt-2">
              {typeof card.value === "number" ? `₹${card.value}` : card.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-center mb-4">
          Monthly Income vs Expense
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.15)"
            />
            <XAxis dataKey="month" stroke="white" />
            <YAxis stroke="white" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(20,20,20,0.9)",
                border: "none",
                color: "white",
              }}
            />
            <Legend wrapperStyle={{ color: "white" }} />
            <Bar dataKey="income" fill="#22c55e" radius={[6, 6, 0, 0]} />
            <Bar dataKey="expense" fill="#ef4444" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Financial Tips */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-yellow-400/20 to-amber-500/10 backdrop-blur-md rounded-2xl border border-yellow-300/20 p-6 shadow-lg"
      >
        <h3 className="text-xl font-semibold text-yellow-300 mb-4">
          Smart Finance Insights
        </h3>
        <ul className="list-disc pl-6 space-y-2 text-white/80 leading-relaxed">
          {tips.map((tip, idx) => (
            <li key={idx}>{tip}</li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};
