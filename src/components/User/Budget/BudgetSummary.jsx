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
  const [planFor, setPlanFor] = useState(null);
  const [planForm, setPlanForm] = useState({
    amount: "",
    start_date: "",
    end_date: "",
  });

  const userId = useMemo(() => localStorage.getItem("id"), []);

  const idOf = (x) => (typeof x === "object" && x ? x._id || x.id : x);
  const nameOf = (x) => (typeof x === "object" && x ? x.name : "Unknown");

  useEffect(() => {
    (async () => {
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
          const catId = idOf(b.categoryID);
          const totalSpent = expensesArr
            .filter((e) => idOf(e.categoryID) === catId)
            .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

          return {
            id: b._id,
            categoryId: catId,
            category: nameOf(b.categoryID),
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
    })();
  }, [userId]);

  const COLORS = ["#4CAF50", "#FF9800", "#F44336", "#2196F3", "#9C27B0", "#00BCD4", "#795548"];

  const handlePlanChange = (e) => {
    const { name, value } = e.target;
    setPlanForm((p) => ({ ...p, [name]: value }));
  };

  const createBudget = async () => {
    if (!planFor) return;
    try {
      const payload = {
        userID: userId,
        categoryID: idOf(planFor.categoryID),
        amount: Number(planForm.amount),
        start_date: planForm.start_date,
        end_date: planForm.end_date,
      };
      await axiosInstance.post("/budget", payload);
      const budRes = await axiosInstance.get(`/budgetsbyUserID/${userId}`);
      setBudgets(budRes?.data?.data ?? []);
      setPlanFor(null);
    } catch (err) {
      console.error(err);
      alert(err.message || "Error creating budget");
    }
  };

  const generateTips = () => {
    if (!summary.length) return ["💡 Keep tracking your spending for better control."];
    const tips = [];
    summary.forEach((s) => {
      if (s.spent > s.allocated) tips.push(`⚠️ Overspent in ${s.category}.`);
      else if (s.remaining > s.allocated * 0.4) tips.push(`✅ Saved >40% in ${s.category}.`);
      else if (s.remaining < s.allocated * 0.1) tips.push(`⚠️ ${s.category} budget low.`);
    });
    return tips.length ? tips : ["💡 Keep tracking your spending for better control."];
  };

  if (loading)
    return (
      <div className="p-6 animate-pulse space-y-4">
        <div className="h-6 w-40 bg-gray-300 rounded"></div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="h-32 rounded-2xl bg-gray-200/30"></div>
          <div className="h-32 rounded-2xl bg-gray-200/30"></div>
        </div>
      </div>
    );

  return (
    <div className="p-6 space-y-8">
      <motion.h2
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent"
      >
        Budget Summary
      </motion.h2>

      {/* Budget Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {summary.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="p-5 rounded-2xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-lg hover:shadow-emerald-500/20 transition"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">{item.category}</h3>
              <span
                className={`text-xs px-3 py-1 rounded-full ${
                  item.spent > item.allocated ? "bg-red-500/20 text-red-300" : "bg-emerald-500/20 text-emerald-300"
                }`}
              >
                {item.spent > item.allocated ? "Over Budget" : "On Track"}
              </span>
            </div>
            <div className="mt-3 space-y-1 text-sm text-gray-200">
              <p>Allocated: ₹{item.allocated}</p>
              <p>Spent: ₹{item.spent}</p>
              <p className={`font-semibold ${item.remaining < 0 ? "text-red-400" : "text-emerald-400"}`}>
                Remaining: ₹{item.remaining}
              </p>
            </div>
            <div className="mt-3 w-full bg-white/20 rounded-full h-3 overflow-hidden">
              <div
                className={`h-3 rounded-full ${item.spent > item.allocated ? "bg-red-500" : "bg-emerald-500"}`}
                style={{ width: `${Math.min((item.spent / Math.max(item.allocated, 1)) * 100, 100)}%` }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pie Chart */}
      {summary.length > 0 && (
        <motion.div className="rounded-2xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Overall Spending</h3>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={summary.map((s) => ({ name: s.category, value: s.spent }))}
                cx="50%"
                cy="50%"
                outerRadius={120}
                label
                dataKey="value"
              >
                {summary.map((s, idx) => (
                  <Cell key={`spent-${s.id}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Finance Tips */}
      <motion.div className="p-4 rounded-xl backdrop-blur-lg bg-yellow-400/10 border border-yellow-400/20 text-yellow-200">
        <h3 className="font-semibold text-lg mb-2">💡 Finance Tips</h3>
        <ul className="list-disc list-inside space-y-1">
          {generateTips().map((tip, idx) => (
            <li key={`tip-${idx}`}>{tip}</li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};
