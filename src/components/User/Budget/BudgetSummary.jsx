import React, { useEffect, useState, useMemo } from "react";
import axiosInstance from "../../Utils/axiosInstance";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export const BudgetSummary = () => {
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = useMemo(() => localStorage.getItem("id"), []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [budgetRes, expenseRes] = await Promise.all([
          axiosInstance.get(`/budgetsbyUserID/${userId}`),
          axiosInstance.get(`/expensesbyUserID/${userId}`),
        ]);

        const budgetsArr = budgetRes?.data?.data ?? [];
        const expensesArr = expenseRes?.data?.data ?? [];

        setBudgets(budgetsArr);
        setExpenses(expensesArr);

        const processed = budgetsArr.map((b) => {
          const catId =
            typeof b.categoryID === "object"
              ? b.categoryID._id || b.categoryID.id
              : b.categoryID;
          const catName =
            typeof b.categoryID === "object" ? b.categoryID.name : "Unknown";

          const totalSpent = expensesArr
            .filter((e) => {
              const eCat =
                typeof e.categoryID === "object"
                  ? e.categoryID._id || e.categoryID.id
                  : e.categoryID;
              return eCat === catId;
            })
            .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

          return {
            id: b._id,
            category: catName,
            allocated: Number(b.amount) || 0,
            spent: totalSpent,
            remaining: (Number(b.amount) || 0) - totalSpent,
          };
        });

        setSummary(processed);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const COLORS = [
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#0088FE",
    "#AA46BE",
    "#E91E63",
    "#9E9E9E",
  ];

  const generateInsights = () => {
    if (!summary.length) return ["Track your expenses regularly to improve financial awareness."];
    const tips = [];
    summary.forEach((s) => {
      if (s.spent > s.allocated)
        tips.push(`You have overspent in ${s.category}. Consider adjusting the budget.`);
      else if (s.remaining < s.allocated * 0.15)
        tips.push(`${s.category} budget is nearly exhausted. Review upcoming expenses.`);
      else if (s.remaining > s.allocated * 0.4)
        tips.push(`${s.category} has healthy savings — consider reallocating funds.`);
    });
    return tips.length ? tips : ["Budgets are well balanced. Keep maintaining consistency."];
  };

  if (loading)
    return (
      <div className="p-6 animate-pulse space-y-4">
        <div className="h-6 w-40 bg-gray-700 rounded"></div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="h-32 rounded-2xl bg-gray-800/40"></div>
          <div className="h-32 rounded-2xl bg-gray-800/40"></div>
        </div>
      </div>
    );

  return (
    <div className="p-6 space-y-8">
      <motion.h2
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="text-3xl font-semibold text-white tracking-tight border-b border-white/10 pb-2"
      >
        Budget Summary
      </motion.h2>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {summary.map((item, idx) => {
          const spentRatio = Math.min(
            (item.spent / Math.max(item.allocated, 1)) * 100,
            100
          );
          const overBudget = item.spent > item.allocated;

          return (
            <motion.div
              key={item.id}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="p-5 rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-800/60 border border-white/10 shadow-md hover:shadow-lg transition-all"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-100">
                  {item.category}
                </h3>
                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    overBudget
                      ? "bg-red-500/20 text-red-300"
                      : "bg-emerald-500/20 text-emerald-300"
                  }`}
                >
                  {overBudget ? "Over Budget" : "On Track"}
                </span>
              </div>

              <div className="text-sm text-gray-300 space-y-1">
                <p>Allocated: ₹{item.allocated.toLocaleString()}</p>
                <p>Spent: ₹{item.spent.toLocaleString()}</p>
                <p
                  className={`font-medium ${
                    item.remaining < 0 ? "text-red-400" : "text-emerald-400"
                  }`}
                >
                  Remaining: ₹{item.remaining.toLocaleString()}
                </p>
              </div>

              <div className="mt-3 w-full bg-gray-700/40 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-3 rounded-full ${
                    overBudget ? "bg-red-500" : "bg-emerald-500"
                  }`}
                  style={{ width: `${spentRatio}%` }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Pie Chart */}
      {summary.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-800/60 border border-white/10 shadow-lg p-6"
        >
          <h3 className="text-xl font-semibold text-gray-100 mb-4">
            Spending Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={360}>
            <PieChart>
              <Pie
                data={summary.map((s) => ({
                  name: s.category,
                  value: s.spent,
                }))}
                cx="50%"
                cy="50%"
                outerRadius={120}
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
                dataKey="value"
              >
                {summary.map((s, idx) => (
                  <Cell key={s.id} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#1f2937",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Insights */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="p-5 rounded-xl bg-gradient-to-br from-amber-500/10 to-yellow-400/10 border border-yellow-500/20 text-gray-200"
      >
        <h3 className="font-semibold text-lg mb-2 text-yellow-300">
          Financial Insights
        </h3>
        <ul className="list-disc list-inside space-y-1">
          {generateInsights().map((tip, idx) => (
            <li key={idx} className="text-sm leading-relaxed">
              {tip}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};
