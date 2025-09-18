import React, { useState, useEffect } from "react";
import axiosInstance from "./api/axiosInstance";
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("id");

        const [incomeRes, expenseRes] = await Promise.all([
          axiosInstance.get(`/incomesbyUserId/${userId}`),
          axiosInstance.get(`/expensesbyUserId/${userId}`),
        ]);

        setIncomes(incomeRes.data.data);
        setExpenses(expenseRes.data.data);

        // 📊 Calculate pocket stats
        const totalIncome = incomeRes.data.data.reduce(
          (acc, cur) => acc + cur.amount,
          0
        );
        const totalExpense = expenseRes.data.data.reduce(
          (acc, cur) => acc + cur.amount,
          0
        );
        const netSavings = totalIncome - totalExpense;
        const savingsRate =
          totalIncome > 0 ? ((netSavings / totalIncome) * 100).toFixed(2) : 0;

        setStats({
          totalIncome,
          totalExpense,
          netSavings,
          savingsRate,
        });

        // 📈 Monthly Income vs Expense
        const months = Array(12).fill({ income: 0, expense: 0 });

        incomeRes.data.data.forEach((inc) => {
          const m = new Date(inc.date).getMonth();
          months[m] = {
            ...months[m],
            income: months[m].income + inc.amount,
          };
        });

        expenseRes.data.data.forEach((exp) => {
          const m = new Date(exp.date).getMonth();
          months[m] = {
            ...months[m],
            expense: months[m].expense + exp.amount,
          };
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

        // 💡 Finance Tips
        let suggestedTips = [];
        if (savingsRate < 20) {
          suggestedTips = [
            "Track your daily expenses to cut unnecessary costs.",
            "Avoid impulse purchases – wait 24hrs before buying.",
            "Try cooking at home instead of eating out.",
          ];
        } else if (savingsRate >= 20 && savingsRate < 40) {
          suggestedTips = [
            "Good job saving! Consider building an emergency fund (6 months).",
            "Start automating monthly investments (SIP / index funds).",
            "Review subscriptions and cancel unused ones.",
          ];
        } else {
          suggestedTips = [
            "Excellent savings rate! Focus on long-term investments.",
            "Diversify into stocks, ETFs, or retirement funds.",
            "Think about passive income opportunities.",
          ];
        }
        setTips(suggestedTips);
      } catch (error) {
        console.error("Error fetching finance data:", error);
      }
    };

    fetchData();
  }, []);

  const [chartData, setChartData] = useState([]);
  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-center gap-3">
        <div className="p-1">
          <FaChartLine size={30} />
        </div>
        <div className="text-3xl font-bold text-center">Finance Dashboard</div>
      </div>

      {/* Pocket Summary Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Income",
            value: stats.totalIncome,
            color: "bg-green-500",
          },
          {
            label: "Total Expenses",
            value: stats.totalExpense,
            color: "bg-red-500",
          },
          {
            label: "Net Savings",
            value: stats.netSavings,
            color: "bg-blue-500",
          },
          {
            label: "Savings Rate",
            value: `${stats.savingsRate}%`,
            color: "bg-purple-500",
          },
        ].map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.2 }}
            className={`rounded-xl shadow-lg text-white p-6 text-center ${card.color}`}
          >
            <h3 className="text-lg font-semibold">{card.label}</h3>
            <p className="text-2xl font-bold mt-2">
              {typeof card.value === "number" ? `₹${card.value}` : card.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Income vs Expense Chart */}
      <div className="w-full h-96 bg-white rounded-xl shadow-lg p-4">
        <h3 className="text-lg font-semibold mb-4 text-center">
          Income vs Expense (Monthly)
        </h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="income" fill="#22c55e" />
            <Bar dataKey="expense" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Finance Tips */}
      <div className="bg-yellow-100 rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">💡 Financial Tips for You</h3>
        <ul className="list-disc pl-6 space-y-2">
          {tips.map((tip, idx) => (
            <li key={idx} className="text-gray-800">
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
