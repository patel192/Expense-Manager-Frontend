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

  // Helpers
  const monthRangeFromDate = (dateStr) => {
    const d = new Date(dateStr);
    const start = new Date(d.getFullYear(), d.getMonth(), 1);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    return {
      startISO: start.toISOString().slice(0, 10),
      endISO: end.toISOString().slice(0, 10),
    };
  };

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

        // Summaries
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
        console.error("Error fetching budgets/expenses:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  const budgetByCategory = useMemo(() => {
    const map = new Map();
    for (const b of budgets) {
      const cid = idOf(b.categoryID);
      if (!map.has(cid)) map.set(cid, b);
    }
    return map;
  }, [budgets]);

  const generateTips = () => {
    if (summary.length === 0)
      return ["💡 Keep tracking your spending for better control."];

    const tips = [];
    summary.forEach((s) => {
      if (s.spent > s.allocated) {
        tips.push(`⚠️ Overspent in ${s.category}. Cut unnecessary purchases.`);
      } else if (s.remaining > s.allocated * 0.4) {
        tips.push(`✅ Great! Saved more than 40% of ${s.category} budget.`);
      } else if (s.remaining < s.allocated * 0.1) {
        tips.push(`⚠️ ${s.category} budget almost finished. Be cautious.`);
      }
    });

    return tips.length
      ? tips
      : ["💡 Keep tracking your spending for better control."];
  };

  const COLORS = [
    "#4CAF50",
    "#FF9800",
    "#F44336",
    "#2196F3",
    "#9C27B0",
    "#00BCD4",
    "#795548",
  ];

  const openPlanForExpense = (expense) => {
    const { startISO, endISO } = monthRangeFromDate(expense.date);
    setPlanFor(expense);
    setPlanForm({
      amount: (Math.ceil(((expense.amount || 0) * 3) / 100) * 100).toString(),
      start_date: startISO,
      end_date: endISO,
    });
  };

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
        start_date: new Date(planForm.start_date),
        end_date: new Date(planForm.end_date),
      };
      const res = await axiosInstance.post("/budget", payload);
      if (res.status === 201 || res.status === 200) {
        const budRes = await axiosInstance.get(`/budgetsbyUserID/${userId}`);
        setBudgets(budRes?.data?.data ?? []);
        setPlanFor(null);
      } else {
        alert("Failed to create budget");
      }
    } catch (err) {
      console.error(err);
      alert(
        err?.response?.data?.message || err.message || "Error creating budget"
      );
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse h-6 w-40 bg-gray-300/30 rounded mb-4"></div>
        <div className="animate-pulse grid md:grid-cols-2 gap-4">
          <div className="h-32 rounded-2xl bg-gray-200/20 backdrop-blur-sm"></div>
          <div className="h-32 rounded-2xl bg-gray-200/20 backdrop-blur-sm"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <motion.h2
        initial={{ x: -80, opacity: 0 }}
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
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.05 * idx }}
            className="p-5 rounded-2xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-lg hover:shadow-emerald-500/20 transition"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                {item.category}
              </h3>
              <span
                className={`text-xs px-3 py-1 rounded-full ${
                  item.spent > item.allocated
                    ? "bg-red-500/20 text-red-300"
                    : "bg-emerald-500/20 text-emerald-300"
                }`}
              >
                {item.spent > item.allocated ? "Over Budget" : "On Track"}
              </span>
            </div>

            <div className="mt-3 space-y-1 text-sm text-gray-200">
              <p>Allocated: ₹{item.allocated}</p>
              <p>Spent: ₹{item.spent}</p>
              <p
                className={`font-semibold ${
                  item.remaining < 0 ? "text-red-400" : "text-emerald-400"
                }`}
              >
                Remaining: ₹{item.remaining}
              </p>
            </div>

            {/* Progress bar */}
            <div className="mt-3 w-full bg-white/20 rounded-full h-3 overflow-hidden">
              <div
                className={`h-3 rounded-full ${
                  item.spent > item.allocated
                    ? "bg-red-500"
                    : "bg-emerald-500"
                }`}
                style={{
                  width: `${Math.min(
                    (item.spent / Math.max(item.allocated, 1)) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pie Chart */}
      {summary.length > 0 && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="rounded-2xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-lg p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4">
            Overall Spending
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={summary.map((s) => ({
                  name: s.category,
                  value: s.spent,
                }))}
                cx="50%"
                cy="50%"
                outerRadius={120}
                label
                dataKey="value"
              >
                {summary.map((s, idx) => (
                  <Cell
                    key={`spent-${s.id}`}
                    fill={COLORS[idx % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Expenses List */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="rounded-2xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-lg p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-4">All Expenses</h3>
        <div className="space-y-3 text-gray-200">
          {expenses.map((exp, idx) => {
            const expCatId = idOf(exp.categoryID);
            const budget = budgetByCategory.get(expCatId);
            const planned = Boolean(budget);

            return (
              <motion.div
                key={exp._id}
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: Math.min(idx * 0.02, 0.3) }}
                className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-white/20 last:border-b-0 pb-3"
              >
                <div>
                  <p className="font-medium text-white">
                    {nameOf(exp.categoryID)} • ₹{exp.amount}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(exp.date).toLocaleDateString()} —{" "}
                    {exp.description || "No description"}
                  </p>
                  <div className="mt-1">
                    {planned ? (
                      <span className="inline-flex items-center text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300">
                        Budget planned: ₹{budget.amount} (
                        {new Date(budget.start_date).toLocaleDateString()} →{" "}
                        {new Date(budget.end_date).toLocaleDateString()})
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-300">
                        No budget planned
                      </span>
                    )}
                  </div>
                </div>

                {!planned && (
                  <div className="mt-3 md:mt-0">
                    <button
                      onClick={() => openPlanForExpense(exp)}
                      className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Plan Budget
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Budget Planner Modal */}
      {planFor && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full sm:max-w-md rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl p-6"
          >
            <h4 className="text-lg font-semibold text-white mb-1">
              Plan Budget
            </h4>
            <p className="text-sm text-gray-300 mb-4">
              Category:{" "}
              <span className="font-medium">
                {nameOf(planFor.categoryID)}
              </span>
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-200">
                  Amount
                </label>
                <input
                  type="number"
                  name="amount"
                  value={planForm.amount}
                  onChange={handlePlanChange}
                  className="mt-1 w-full border border-white/20 rounded-lg px-3 py-2 bg-transparent text-white placeholder-gray-400"
                  placeholder="e.g. 8000"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-200">
                  Start date
                </label>
                <input
                  type="date"
                  name="start_date"
                  value={planForm.start_date}
                  onChange={handlePlanChange}
                  className="mt-1 w-full border border-white/20 rounded-lg px-3 py-2 bg-transparent text-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-200">
                  End date
                </label>
                <input
                  type="date"
                  name="end_date"
                  value={planForm.end_date}
                  onChange={handlePlanChange}
                  className="mt-1 w-full border border-white/20 rounded-lg px-3 py-2 bg-transparent text-white"
                />
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                onClick={() => setPlanFor(null)}
                className="px-3 py-1.5 rounded-lg border border-white/30 text-gray-200 hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={createBudget}
                className="px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Save Budget
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Finance Tips */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="p-4 rounded-xl backdrop-blur-lg bg-yellow-400/10 border border-yellow-400/20 text-yellow-200"
      >
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
