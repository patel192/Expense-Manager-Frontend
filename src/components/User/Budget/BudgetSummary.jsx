import React, { useEffect, useState,useMemo } from "react";
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
  const [planFor, setPlanFor] = useState(null); // expense we’re planning for
  const [planForm, setPlanForm] = useState({
    amount: "",
    start_date: "",
    end_date: "",
  });

  const userId = useMemo(() => localStorage.getItem("id"), []);

  const idOf = (x) => (typeof x === "object" && x ? x._id || x.id : x);
  const nameOf = (x) => (typeof x === "object" && x ? x.name : "Unknown");

  // month range helpers
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

        // Build per-category summary (allocated vs spent)
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

  // Quick lookup: categoryId -> first budget object (for badge/details)
  const budgetByCategory = useMemo(() => {
    const map = new Map();
    for (const b of budgets) {
      const cid = idOf(b.categoryID);
      if (!map.has(cid)) map.set(cid, b);
    }
    return map;
  }, [budgets]);

  // Finance tips
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

  // Open plan form seeded from the expense
  const openPlanForExpense = (expense) => {
    const { startISO, endISO } = monthRangeFromDate(expense.date);
    setPlanFor(expense);
    setPlanForm({
      amount: (Math.ceil(((expense.amount || 0) * 3) / 100) * 100).toString(), // rough default (3× rounded to 100s)
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
      // Adjust endpoint if your server differs:
      const res = await axiosInstance.post("/budget", payload);
      if (res.status === 201 || res.status === 200) {
        // Refresh budgets
        const budRes = await axiosInstance.get(
          `/budgetsbyUserID/${userId}`
        );
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
        <div className="animate-pulse h-6 w-40 bg-gray-200 rounded mb-4"></div>
        <div className="animate-pulse grid md:grid-cols-2 gap-4">
          <div className="h-32 bg-gray-100 rounded-2xl"></div>
          <div className="h-32 bg-gray-100 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <motion.h2
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="text-2xl font-bold text-gray-800"
      >
        Budget Summary
      </motion.h2>

      {/* Budget Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {summary.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.05 * idx }}
            className="p-4 bg-white rounded-2xl shadow-md border"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{item.category}</h3>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  item.spent > item.allocated
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {item.spent > item.allocated ? "Over Budget" : "On Track"}
              </span>
            </div>

            <div className="mt-2 space-y-1 text-sm">
              <p>Allocated: ₹{item.allocated}</p>
              <p>Spent: ₹{item.spent}</p>
              <p
                className={`font-semibold ${
                  item.remaining < 0 ? "text-red-600" : "text-green-600"
                }`}
              >
                Remaining: ₹{item.remaining}
              </p>
            </div>

            {/* Progress bar */}
            <div className="mt-3 w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${
                  item.spent > item.allocated ? "bg-red-500" : "bg-green-500"
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

      {/* Overall Spending Pie */}
      {summary.length > 0 && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-6 rounded-2xl shadow-md border"
        >
          <h3 className="text-xl font-semibold mb-4">Overall Spending</h3>
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

      {/* Expenses List — show ALL expenses.
          If category has NO budget: show 'No budget planned' + 'Plan Budget' button */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white p-6 rounded-2xl shadow-md border"
      >
        <h3 className="text-xl font-semibold mb-4">All Expenses</h3>
        <div className="space-y-3">
          {expenses.map((exp, idx) => {
            const expCatId = idOf(exp.categoryID);
            const budget = budgetByCategory.get(expCatId); // undefined if none
            const planned = Boolean(budget);

            return (
              <motion.div
                key={exp._id}
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: Math.min(idx * 0.02, 0.3) }}
                className="flex flex-col md:flex-row md:items-center md:justify-between border-b last:border-b-0 pb-3"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2.5 w-2.5 rounded-full bg-gray-400" />
                  <div>
                    <p className="font-medium">
                      {nameOf(exp.categoryID)} • ₹{exp.amount}
                    </p>
                    <p className="text-xs text-gray-600">
                      {new Date(exp.date).toLocaleDateString()} —{" "}
                      {exp.description || "No description"}
                    </p>
                    <div className="mt-1">
                      {planned ? (
                        <span className="inline-flex items-center text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">
                          Budget planned: ₹{budget.amount} (
                          {new Date(budget.start_date).toLocaleDateString()} →{" "}
                          {new Date(budget.end_date).toLocaleDateString()})
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-xs px-2 py-1 rounded-full bg-red-50 text-red-700">
                          No budget planned
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {!planned && (
                  <div className="mt-3 md:mt-0">
                    <button
                      onClick={() => openPlanForExpense(exp)}
                      className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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

      {/* Inline Planner (simple mini-form) */}
      {planFor && (
        <div className="fixed inset-0 bg-black/30 flex items-end sm:items-center justify-center z-50">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full sm:max-w-md bg-white rounded-2xl shadow-xl p-6"
          >
            <h4 className="text-lg font-semibold mb-1">Plan Budget</h4>
            <p className="text-sm text-gray-600 mb-4">
              Category:{" "}
              <span className="font-medium">{nameOf(planFor.categoryID)}</span>
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={planForm.amount}
                  onChange={handlePlanChange}
                  className="mt-1 w-full border rounded-lg px-3 py-2"
                  placeholder="e.g. 8000"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Start date</label>
                <input
                  type="date"
                  name="start_date"
                  value={planForm.start_date}
                  onChange={handlePlanChange}
                  className="mt-1 w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium">End date</label>
                <input
                  type="date"
                  name="end_date"
                  value={planForm.end_date}
                  onChange={handlePlanChange}
                  className="mt-1 w-full border rounded-lg px-3 py-2"
                />
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                onClick={() => setPlanFor(null)}
                className="px-3 py-1.5 rounded-lg border"
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
        className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl"
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
