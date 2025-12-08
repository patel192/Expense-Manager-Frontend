import React, { useEffect, useState, useMemo } from "react";
import axiosInstance from "../Utils/axiosInstance";
import { motion } from "framer-motion";
import {
  FaChevronDown,
  FaRegCalendarAlt,
  FaWallet,
  FaMoneyBillWave,
} from "react-icons/fa";

export const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });
  const [loading, setLoading] = useState(true);

  const tabTypes = { All: null, Expenses: "Expense", Incomes: "Income" };
  const userId = useMemo(() => localStorage.getItem("id"), []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [expenseRes, incomeRes, budgetRes] = await Promise.all([
          axiosInstance.get(`/expensesbyUserID/${userId}`),
          axiosInstance.get(`/incomesbyUserID/${userId}`),
          axiosInstance.get(`/budgetsbyUserID/${userId}`),
        ]);

        const expenses = (expenseRes.data.data || []).map((e) => ({
          ...e,
          type: "Expense",
        }));
        const incomes = (incomeRes.data.data || []).map((i) => ({
          ...i,
          type: "Income",
        }));
        const budgets = budgetRes?.data?.data || [];

        // mark expenses that have a linked budget
        const merged = [...expenses, ...incomes].map((t) => {
          if (t.type === "Expense") {
            const hasBudget = budgets.some(
              (b) => (b.categoryID && b.categoryID._id) === (t.categoryID && t.categoryID._id)
            );
            return { ...t, hasBudget };
          }
          return t;
        });

        // summary values
        const totalIncome = incomes.reduce((acc, i) => acc + (i.amount || 0), 0);
        const totalExpense = expenses.reduce((acc, e) => acc + (e.amount || 0), 0);

        setTransactions(merged);
        setSummary({
          totalIncome,
          totalExpense,
          balance: totalIncome - totalExpense,
        });
      } catch (error) {
        console.error("Failed to fetch transactions", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchData();
  }, [userId]);

  // Filtered and sorted transactions
  const filteredSorted = useMemo(() => {
    const filtered = tabTypes[activeTab]
      ? transactions.filter((t) => t.type === tabTypes[activeTab])
      : transactions;
    return [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [activeTab, transactions]);

  // Group by date (descending)
  const groupedByDate = useMemo(() => {
    return filteredSorted.reduce((acc, t) => {
      const date = new Date(t.date).toLocaleDateString();
      if (!acc[date]) acc[date] = [];
      acc[date].push(t);
      return acc;
    }, {});
  }, [filteredSorted]);

  const handlePlanBudget = (expense) => {
    // TODO: Open modal and prefill category for adding budget
    alert(`Plan budget for ${expense.categoryID?.name || "Uncategorized"}`);
  };

  return (
    <div className="space-y-8 text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Transactions</h1>
          <p className="text-gray-400 mt-1 text-sm md:text-base">
            All your incomes and expenses in one place. Filter, inspect and plan budgets.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-300 bg-[#0f1115]/50 border border-white/5 px-3 py-1 rounded-xl">
            <FaRegCalendarAlt /> <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { title: "Total Income", value: summary.totalIncome, color: "text-emerald-400", icon: <FaWallet /> },
          { title: "Total Expense", value: summary.totalExpense, color: "text-rose-400", icon: <FaMoneyBillWave /> },
          { title: "Balance", value: summary.balance, color: "text-cyan-400", icon: <FaChevronDown /> },
        ].map((card, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl bg-[#111318]/80 border border-white/10 p-5 shadow-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xs uppercase tracking-wide text-gray-400">{card.title}</h3>
                <p className={`mt-3 text-2xl md:text-3xl font-semibold ${card.color}`}>
                  {typeof card.value === "number" ? `₹${card.value.toLocaleString()}` : card.value}
                </p>
              </div>
              <div className="text-2xl text-white/70 p-2 bg-white/3 rounded-lg">
                {card.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-white/10">
        <nav className="flex gap-4">
          {Object.keys(tabTypes).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-sm md:text-base border-b-2 transition-all ${
                activeTab === tab
                  ? "border-cyan-400 text-white"
                  : "border-transparent text-gray-400 hover:text-white hover:border-white/20"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {loading ? (
        <p className="text-gray-400">Loading transactions...</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left / Main: transaction list (spans 2 cols on large screens) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl bg-[#111318]/80 border border-white/10 p-4 shadow-lg">
              {filteredSorted.length > 0 ? (
                Object.keys(groupedByDate).map((date) => (
                  <div key={date} className="mb-4">
                    <h4 className="text-sm text-gray-300 mb-2">{date}</h4>
                    <ul className="divide-y divide-white/6">
                      {groupedByDate[date].map((t) => (
                        <motion.li
                          key={t._id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          whileHover={{ scale: 1.01 }}
                          transition={{ duration: 0.18 }}
                          className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-3 px-2 rounded-lg"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-white truncate">{t.description || t.source || "No description"}</p>
                            <p className="text-sm text-gray-400 truncate">
                              {t.categoryID?.name || "Uncategorized"}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {t.note || ""}
                            </p>
                          </div>

                          <div className="flex flex-col sm:items-end mt-3 sm:mt-0">
                            <p className={`font-semibold ${t.type === "Expense" ? "text-rose-400" : "text-emerald-400"}`}>
                              {t.type === "Expense" ? "-" : "+"}₹{Number(t.amount || 0).toLocaleString()}
                            </p>

                            {t.type === "Expense" && !t.hasBudget ? (
                              <button
                                onClick={() => handlePlanBudget(t)}
                                className="mt-2 px-3 py-1 text-xs rounded bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow hover:opacity-90 transition-transform"
                              >
                                Plan Budget
                              </button>
                            ) : (
                              <span className="mt-2 text-xs text-gray-400">
                                {t.type === "Expense" ? (t.hasBudget ? "Budgeted" : "") : ""}
                              </span>
                            )}
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 italic text-center py-6">
                  No {activeTab.toLowerCase()} transactions found
                </p>
              )}
            </div>
          </div>

          {/* Right: quick filters / small analytics */}
          <aside className="space-y-4">
            <div className="rounded-2xl bg-[#111318]/80 border border-white/10 p-4 shadow-xl">
              <h4 className="text-sm font-semibold text-white/90 mb-3">Quick Filters</h4>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setActiveTab("All")}
                  className={`text-left px-3 py-2 rounded-md text-sm ${
                    activeTab === "All" ? "bg-cyan-500/10 text-white" : "text-gray-300 hover:text-white"
                  }`}
                >
                  All transactions
                </button>
                <button
                  onClick={() => setActiveTab("Expenses")}
                  className={`text-left px-3 py-2 rounded-md text-sm ${
                    activeTab === "Expenses" ? "bg-cyan-500/10 text-white" : "text-gray-300 hover:text-white"
                  }`}
                >
                  Expenses only
                </button>
                <button
                  onClick={() => setActiveTab("Incomes")}
                  className={`text-left px-3 py-2 rounded-md text-sm ${
                    activeTab === "Incomes" ? "bg-cyan-500/10 text-white" : "text-gray-300 hover:text-white"
                  }`}
                >
                  Incomes only
                </button>
              </div>
            </div>

            <div className="rounded-2xl bg-[#111318]/80 border border-white/10 p-4 shadow-xl">
              <h4 className="text-sm font-semibold text-white/90 mb-3">Summary</h4>
              <div className="text-sm text-gray-300 space-y-2">
                <div className="flex justify-between">
                  <span>Total Income</span>
                  <strong className="text-emerald-400">₹{summary.totalIncome.toLocaleString()}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Total Expense</span>
                  <strong className="text-rose-400">₹{summary.totalExpense.toLocaleString()}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Balance</span>
                  <strong className="text-cyan-300">₹{summary.balance.toLocaleString()}</strong>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-[#111318]/80 border border-white/10 p-4 shadow-xl">
              <h4 className="text-sm font-semibold text-white/90 mb-3">Tips</h4>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>Tap "Plan Budget" on expenses without a budget.</li>
                <li>Use filters to focus on specific transaction types.</li>
                <li>Check monthly trends in the Reports page.</li>
              </ul>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Transaction;
