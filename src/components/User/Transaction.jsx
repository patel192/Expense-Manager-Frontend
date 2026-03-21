import React, { useEffect, useState, useMemo } from "react";
import axiosInstance from "../Utils/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiTrendingUp, FiTrendingDown, FiDollarSign,
  FiCalendar, FiFilter, FiList, FiTarget,
  FiZap, FiArrowUpRight, FiArrowDownRight,
  FiRefreshCw, FiInbox,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

/* ─── Shimmer ─── */
const Shimmer = ({ className = "" }) => (
  <div className={`relative overflow-hidden bg-white/5 rounded-xl ${className}`}>
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite]
                    bg-gradient-to-r from-transparent via-white/8 to-transparent" />
  </div>
);

/* ─── Loading skeleton ─── */
const TransactionSkeleton = () => (
  <div className="space-y-3 p-4">
    {[1,2,3,4,5].map(i => (
      <div key={i} className="flex items-center gap-3">
        <Shimmer className="w-9 h-9 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Shimmer className="h-3.5 w-1/3 rounded" />
          <Shimmer className="h-2.5 w-1/4 rounded" />
        </div>
        <Shimmer className="h-4 w-16 rounded" />
      </div>
    ))}
  </div>
);

/* ══════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════ */
export const Transaction = () => {
  const { user } = useAuth();

  /* ── ALL ORIGINAL STATE — UNTOUCHED ── */
  const [transactions, setTransactions]     = useState([]);
  const [activeTab, setActiveTab]           = useState("All");
  const [summary, setSummary]               = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [loading, setLoading]               = useState(true);

  const tabTypes = { All: null, Expenses: "Expense", Incomes: "Income" };
  const userId = useMemo(() => user?._id, [user]);

  /* ── ALL ORIGINAL LOGIC — UNTOUCHED ── */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [expenseRes, incomeRes, budgetRes] = await Promise.all([
          axiosInstance.get(`/expensesbyUserID/${userId}`),
          axiosInstance.get(`/incomesbyUserID/${userId}`),
          axiosInstance.get(`/budgetsbyUserID/${userId}`),
        ]);
        const expenses = (expenseRes.data.data || []).map((e) => ({ ...e, type: "Expense" }));
        const incomes  = (incomeRes.data.data  || []).map((i) => ({ ...i, type: "Income" }));
        const budgets  = budgetRes?.data?.data || [];
        const merged = [...expenses, ...incomes].map((t) => {
          if (t.type === "Expense") {
            const hasBudget = budgets.some(
              (b) => (b.categoryID && b.categoryID._id) === (t.categoryID && t.categoryID._id)
            );
            return { ...t, hasBudget };
          }
          return t;
        });
        const totalIncome  = incomes.reduce((acc, i) => acc + (i.amount || 0), 0);
        const totalExpense = expenses.reduce((acc, e) => acc + (e.amount || 0), 0);
        setTransactions(merged);
        setSummary({ totalIncome, totalExpense, balance: totalIncome - totalExpense });
      } catch (error) {
        console.error("Failed to fetch transactions", error);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchData();
  }, [userId]);

  const filteredSorted = useMemo(() => {
    const filtered = tabTypes[activeTab]
      ? transactions.filter((t) => t.type === tabTypes[activeTab])
      : transactions;
    return [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [activeTab, transactions]);

  const groupedByDate = useMemo(() => {
    return filteredSorted.reduce((acc, t) => {
      const date = new Date(t.date).toLocaleDateString();
      if (!acc[date]) acc[date] = [];
      acc[date].push(t);
      return acc;
    }, {});
  }, [filteredSorted]);

  const handlePlanBudget = (expense) => {
    alert(`Plan budget for ${expense.categoryID?.name || "Uncategorized"}`);
  };

  /* ── derived ── */
  const savingsRate = summary.totalIncome > 0
    ? Math.round(((summary.totalIncome - summary.totalExpense) / summary.totalIncome) * 100)
    : 0;

  const tabs = [
    { key: "All",      label: "All",       count: transactions.length },
    { key: "Expenses", label: "Expenses",  count: transactions.filter(t => t.type === "Expense").length },
    { key: "Incomes",  label: "Incomes",   count: transactions.filter(t => t.type === "Income").length },
  ];

  return (
    <div className="space-y-6 text-white">

      {/* ══ HEADER ══ */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-gray-500 mt-1 text-sm">All your incomes and expenses — filter, inspect and plan budgets.</p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border
                        bg-white/5 border-white/10 text-gray-400 text-xs font-medium self-start">
          <FiCalendar size={12} />
          {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
        </div>
      </motion.div>

      {/* ══ STAT CARDS ══ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { title: "Total Income",  value: summary.totalIncome,  color: "text-emerald-400", bg: "bg-emerald-500/5",  border: "border-emerald-500/20", glow: "bg-emerald-400", icon: <FiTrendingUp size={17} />,   arrow: <FiArrowUpRight size={13} className="text-emerald-400" /> },
          { title: "Total Expense", value: summary.totalExpense, color: "text-rose-400",    bg: "bg-rose-500/5",     border: "border-rose-500/20",    glow: "bg-rose-400",    icon: <FiTrendingDown size={17} />, arrow: <FiArrowDownRight size={13} className="text-rose-400" /> },
          { title: "Net Balance",   value: summary.balance,      color: summary.balance >= 0 ? "text-cyan-400" : "text-rose-400", bg: "bg-cyan-500/5", border: "border-cyan-500/20", glow: "bg-cyan-400", icon: <FiDollarSign size={17} />, arrow: null },
        ].map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: idx * 0.07 }}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className={`relative overflow-hidden rounded-2xl border p-5 ${card.bg} ${card.border} backdrop-blur-sm`}
          >
            <div className={`absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-15 ${card.glow}`} />
            <div className="relative">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.bg} border ${card.border}`}>
                  <span className={card.color}>{card.icon}</span>
                </div>
                {card.arrow && (
                  <span className="flex items-center gap-1 text-xs font-medium opacity-70">{card.arrow}</span>
                )}
                {idx === 2 && (
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full border
                    ${savingsRate >= 0
                      ? "bg-emerald-500/15 border-emerald-500/20 text-emerald-400"
                      : "bg-rose-500/15 border-rose-500/20 text-rose-400"}`}>
                    {savingsRate}% saved
                  </span>
                )}
              </div>
              <p className="text-[11px] font-medium text-gray-500 uppercase tracking-widest mb-1">{card.title}</p>
              <p className={`text-2xl font-bold tracking-tight ${card.color}`}>
                ₹{Math.abs(card.value).toLocaleString("en-IN")}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ══ MAIN LAYOUT ══ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ── LEFT: Transaction list (2 cols) ── */}
        <div className="lg:col-span-2 space-y-4">

          {/* Pill tabs with counts */}
          <div className="flex items-center gap-1 bg-white/4 border border-white/8 rounded-2xl p-1.5 w-fit flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                  ${activeTab === tab.key
                    ? "bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 text-cyan-400"
                    : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                  }`}
              >
                {tab.label}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold
                  ${activeTab === tab.key ? "bg-cyan-500/20 text-cyan-300" : "bg-white/8 text-gray-600"}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Transaction card */}
          <div className="rounded-2xl bg-[#0d0f14]/80 border border-white/10 backdrop-blur-sm overflow-hidden">
            {loading ? (
              <TransactionSkeleton />
            ) : filteredSorted.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-16 text-center">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <FiInbox size={22} className="text-gray-600" />
                </div>
                <p className="text-sm text-gray-500">No {activeTab.toLowerCase()} transactions found.</p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {Object.keys(groupedByDate).map((date, groupIdx) => (
                    <div key={date}>
                      {/* Date separator */}
                      <div className={`flex items-center gap-3 px-4 py-2.5
                        ${groupIdx > 0 ? "border-t border-white/5" : ""}`}>
                        <span className="text-[11px] font-semibold text-gray-600 uppercase tracking-widest whitespace-nowrap">
                          {date}
                        </span>
                        <div className="flex-1 h-px bg-white/5" />
                        <span className="text-[10px] text-gray-700">
                          {groupedByDate[date].length} txn{groupedByDate[date].length !== 1 ? "s" : ""}
                        </span>
                      </div>

                      {/* Transactions for this date */}
                      <ul className="divide-y divide-white/4">
                        {groupedByDate[date].map((t, i) => (
                          <motion.li
                            key={t._id}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: i * 0.03 }}
                            className="flex items-center gap-3 px-4 py-3.5 hover:bg-white/3 transition-colors"
                          >
                            {/* Type icon */}
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border
                              ${t.type === "Income"
                                ? "bg-emerald-500/10 border-emerald-500/20"
                                : "bg-rose-500/10 border-rose-500/20"
                              }`}>
                              {t.type === "Income"
                                ? <FiArrowUpRight size={15} className="text-emerald-400" />
                                : <FiArrowDownRight size={15} className="text-rose-400" />
                              }
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-200 truncate">
                                {t.description || t.source || "No description"}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                {t.categoryID?.name && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/6 border border-white/8 text-gray-500">
                                    {t.categoryID.name}
                                  </span>
                                )}
                                {t.type === "Expense" && t.hasBudget && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/15 text-emerald-500">
                                    Budgeted
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Amount + action */}
                            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                              <p className={`text-sm font-bold ${t.type === "Income" ? "text-emerald-400" : "text-rose-400"}`}>
                                {t.type === "Income" ? "+" : "−"}₹{Number(t.amount || 0).toLocaleString("en-IN")}
                              </p>
                              {t.type === "Expense" && !t.hasBudget && (
                                <button
                                  onClick={() => handlePlanBudget(t)}
                                  className="text-[10px] font-semibold px-2.5 py-1 rounded-lg
                                             bg-gradient-to-r from-cyan-500/15 to-blue-600/15
                                             border border-cyan-500/25 text-cyan-400
                                             hover:from-cyan-500/25 hover:to-blue-600/25
                                             transition-all duration-200 whitespace-nowrap"
                                >
                                  + Plan Budget
                                </button>
                              )}
                            </div>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* ── RIGHT: Sidebar ── */}
        <aside className="space-y-4">

          {/* Quick Filters */}
          <div className="rounded-2xl bg-[#0d0f14]/80 border border-white/10 backdrop-blur-sm overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3.5 border-b border-white/8">
              <div className="w-6 h-6 rounded-lg bg-cyan-500/15 border border-cyan-500/20 flex items-center justify-center">
                <FiFilter size={11} className="text-cyan-400" />
              </div>
              <h4 className="text-xs font-semibold text-white uppercase tracking-widest">Quick Filters</h4>
            </div>
            <div className="p-2 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all
                    ${activeTab === tab.key
                      ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-medium"
                      : "text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent"
                    }`}
                >
                  <span className="flex items-center gap-2">
                    {tab.key === "All"      && <FiList size={13} />}
                    {tab.key === "Expenses" && <FiTrendingDown size={13} />}
                    {tab.key === "Incomes"  && <FiTrendingUp size={13} />}
                    {tab.label} transactions
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold
                    ${activeTab === tab.key ? "bg-cyan-500/20 text-cyan-300" : "bg-white/8 text-gray-600"}`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Summary panel */}
          <div className="rounded-2xl bg-[#0d0f14]/80 border border-white/10 backdrop-blur-sm overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3.5 border-b border-white/8">
              <div className="w-6 h-6 rounded-lg bg-blue-500/15 border border-blue-500/20 flex items-center justify-center">
                <FiDollarSign size={11} className="text-blue-400" />
              </div>
              <h4 className="text-xs font-semibold text-white uppercase tracking-widest">Summary</h4>
            </div>
            <div className="p-4 space-y-3">
              {[
                { label: "Total Income",  value: summary.totalIncome,  color: "text-emerald-400" },
                { label: "Total Expense", value: summary.totalExpense, color: "text-rose-400" },
                { label: "Net Balance",   value: summary.balance,      color: summary.balance >= 0 ? "text-cyan-400" : "text-rose-400" },
              ].map((row, i) => (
                <div key={i} className={`flex items-center justify-between text-sm ${i < 2 ? "pb-3 border-b border-white/5" : ""}`}>
                  <span className="text-gray-500">{row.label}</span>
                  <span className={`font-bold ${row.color}`}>
                    {row.value < 0 ? "−" : ""}₹{Math.abs(row.value).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}

              {/* Savings rate bar */}
              <div className="pt-1">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-gray-600">Savings rate</span>
                  <span className={`font-bold ${savingsRate >= 20 ? "text-emerald-400" : savingsRate >= 0 ? "text-amber-400" : "text-rose-400"}`}>
                    {savingsRate}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(0, Math.min(savingsRate, 100))}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full rounded-full ${
                      savingsRate >= 20 ? "bg-gradient-to-r from-emerald-400 to-teal-500"
                      : savingsRate >= 0 ? "bg-gradient-to-r from-amber-400 to-orange-500"
                      : "bg-gradient-to-r from-rose-500 to-red-600"
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="rounded-2xl bg-[#0d0f14]/80 border border-amber-500/20 backdrop-blur-sm overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3.5 border-b border-amber-500/15">
              <div className="w-6 h-6 rounded-lg bg-amber-500/15 border border-amber-500/20 flex items-center justify-center">
                <FiZap size={11} className="text-amber-400" />
              </div>
              <h4 className="text-xs font-semibold text-amber-300 uppercase tracking-widest">Tips</h4>
            </div>
            <div className="p-4 space-y-2.5">
              {[
                { icon: <FiTarget size={12} />, text: "Tap \"Plan Budget\" on unbudgeted expenses." },
                { icon: <FiFilter size={12} />, text: "Use filters to focus on specific transaction types." },
                { icon: <FiRefreshCw size={12} />, text: "Check monthly trends in the Reports page." },
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-gray-400">
                  <span className="text-amber-500 flex-shrink-0 mt-0.5">{tip.icon}</span>
                  {tip.text}
                </div>
              ))}
            </div>
          </div>

        </aside>
      </div>
    </div>
  );
};

export default Transaction;