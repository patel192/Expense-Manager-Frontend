import React, { useEffect, useState, Fragment, useMemo } from "react";
import axiosInstance from "../../Utils/axiosInstance";
import { useForm } from "react-hook-form";
import { useDispatch,useSelector } from "react-redux";
import { fetchCategories,fetchAllExpenses,fetchRecentExpenses } from "../../../redux/expense/expenseSlice";
import { Dialog, Transition } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  FiTrendingDown, FiTag, FiDollarSign, FiCalendar,
  FiFileText, FiList, FiBarChart2, FiAlignLeft,
  FiPlus, FiTrash2, FiRefreshCw, FiShoppingBag,
  FiAlertCircle,
} from "react-icons/fi";
import { useAuth } from "../../../context/AuthContext";

/* ─── Shimmer ─── */
const Shimmer = ({ className = "" }) => (
  <div className={`relative overflow-hidden bg-white/5 rounded-xl ${className}`}>
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite]
                    bg-gradient-to-r from-transparent via-white/8 to-transparent" />
  </div>
);

/* ─── Custom tooltip ─── */
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a1d26] border border-white/15 rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-xs text-gray-400 mb-1 font-medium">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-sm font-bold" style={{ color: p.color }}>
          ₹{p.value?.toLocaleString("en-IN")}
        </p>
      ))}
    </div>
  );
};

/* ─── Field wrapper ─── */
const Field = ({ label, icon, error, children }) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-medium text-gray-400 tracking-wide">{label}</label>
    <div className="relative">
      {icon && (
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none z-10">
          {icon}
        </span>
      )}
      {children}
    </div>
    {error && (
      <p className="flex items-center gap-1.5 text-red-400 text-xs">
        <span className="w-1 h-1 rounded-full bg-red-400 flex-shrink-0" />
        {error}
      </p>
    )}
  </div>
);

const inputCls = "w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-gray-100 placeholder-gray-600 text-sm focus:outline-none focus:border-rose-500/60 focus:ring-1 focus:ring-rose-500/30 hover:border-white/20 transition-all duration-200";
const selectCls = "w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-gray-100 text-sm focus:outline-none focus:border-rose-500/60 focus:ring-1 focus:ring-rose-500/30 hover:border-white/20 transition-all duration-200 appearance-none";

/* ══════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════ */
export const UserExpenses = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
const {categories,recentExpenses,expenses} = useSelector((state) => state.expense)
  /* ── ALL ORIGINAL STATE — UNTOUCHED ── */
  const [activeTab, setActiveTab] = useState("overview");
  const [chartData, setChartData] = useState([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userId = useMemo(() => user?._id, [user]);
  const COLORS = ["#ef4444", "#06b6d4", "#10b981", "#f59e0b", "#6366f1"];

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  /* ── ALL ORIGINAL LOGIC — UNTOUCHED ── */
  useEffect(() => {
    if (userId) setValue("userID", userId);
    dispatch(fetchCategories());
    dispatch(fetchRecentExpenses(userId));
    dispatch(fetchAllExpenses());
  }, [dispatch,userId]);

  const buildCharts = (data) => {
    const monthly = Array.from({ length: 12 }, () => 0);
    const categoryMap = {};
    data.forEach((exp) => {
      const m = new Date(exp.date).getMonth();
      monthly[m] += exp.amount;
      categoryMap[exp.categoryID?.name] = (categoryMap[exp.categoryID?.name] || 0) + exp.amount;
    });
    setChartData(monthly.map((amt, idx) => ({
      month: new Date(0, idx).toLocaleString("default", { month: "short" }),
      amount: amt,
    })));
    setCategoryBreakdown(Object.entries(categoryMap).map(([category, value]) => ({ name: category, value })));
  };

  const SubmitHandler = async (data) => {
    try {
      setIsSubmitting(true);
      await axiosInstance.post("/expense", {
        userID: data.userID,
        categoryID: data.categoryID,
        amount: data.amount,
        date: data.date,
        description: data.description,
      });
      alert("Expense added successfully");
      reset();
      setIsModalOpen(false);
      dispatch(fetchRecentExpenses(userId));
      dispatch(fetchAllExpenses(userId));
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteExpense = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    try {
      await axiosInstance.delete(`/expense/${id}`);
      fetchAllExpenses();
      fetchRecentExpenses();
    } catch (error) { console.error("Delete error:", error); }
  };

  /* ── Derived stats ── */
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const avgExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0;
  const topCategory = categoryBreakdown.sort((a, b) => b.value - a.value)[0]?.name || "—";
  const thisMonthTotal = expenses
    .filter(e => new Date(e.date).getMonth() === new Date().getMonth())
    .reduce((s, e) => s + e.amount, 0);

  const tabs = [
    { id: "overview",  label: "Overview",  icon: <FiAlignLeft size={14} /> },
    { id: "analytics", label: "Analytics", icon: <FiBarChart2 size={14} /> },
    { id: "records",   label: "Records",   icon: <FiList size={14} /> },
  ];

  return (
    <div className="space-y-6 text-white">

      {/* ══ HEADER ══ */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Expense Center</h1>
          <p className="text-gray-500 mt-1 text-sm">Track expenses, analyze patterns, manage your spending.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl
                     bg-gradient-to-r from-rose-500 to-pink-600 text-sm font-semibold
                     shadow-lg shadow-rose-500/20 hover:opacity-90 hover:-translate-y-0.5
                     transition-all duration-200 self-start sm:self-auto"
        >
          <FiPlus size={16} /> Add Expense
        </button>
      </motion.div>

      {/* ══ QUICK STAT CARDS ══ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Expenses",   value: `₹${totalExpenses.toLocaleString("en-IN")}`,           color: "text-rose-400",   bg: "bg-rose-500/5",   border: "border-rose-500/20",   glow: "bg-rose-400",   icon: <FiTrendingDown size={17} /> },
          { label: "This Month",       value: `₹${thisMonthTotal.toLocaleString("en-IN")}`,           color: "text-amber-400",  bg: "bg-amber-500/5",  border: "border-amber-500/20",  glow: "bg-amber-400",  icon: <FiCalendar size={17} /> },
          { label: "Avg per Entry",    value: `₹${Math.round(avgExpense).toLocaleString("en-IN")}`,   color: "text-cyan-400",   bg: "bg-cyan-500/5",   border: "border-cyan-500/20",   glow: "bg-cyan-400",   icon: <FiDollarSign size={17} /> },
          { label: "Top Category",     value: topCategory,                                             color: "text-violet-400", bg: "bg-violet-500/5", border: "border-violet-500/20", glow: "bg-violet-400", icon: <FiTag size={17} /> },
        ].map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: idx * 0.07 }}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className={`relative overflow-hidden rounded-2xl border p-4 sm:p-5 ${card.bg} ${card.border} backdrop-blur-sm`}
          >
            <div className={`absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-15 ${card.glow}`} />
            <div className="relative">
              <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center mb-3 ${card.bg} border ${card.border}`}>
                <span className={card.color}>{card.icon}</span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-medium text-gray-500 uppercase tracking-widest mb-1">{card.label}</p>
              <p className={`text-lg sm:text-2xl font-bold tracking-tight truncate ${card.color}`}>{card.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ══ PILL TABS ══ */}
      <div className="flex items-center gap-1 bg-white/4 border border-white/8 rounded-2xl p-1.5 w-fit flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
              ${activeTab === tab.id
                ? "bg-gradient-to-r from-rose-500/20 to-pink-600/20 border border-rose-500/30 text-rose-400"
                : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
              }`}
          >
            {tab.icon}{tab.label}
          </button>
        ))}
      </div>

      {/* ══ TAB PANELS ══ */}
      <AnimatePresence mode="wait">

        {/* ─── OVERVIEW ─── */}
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="space-y-5"
          >
            <div className="rounded-2xl bg-[#0d0f14]/80 border border-white/10 backdrop-blur-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-rose-500/15 border border-rose-500/20 flex items-center justify-center">
                    <FiShoppingBag size={13} className="text-rose-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-white">Recent Expenses</h3>
                </div>
                <span className="text-xs text-gray-500 bg-white/5 px-2.5 py-1 rounded-full">
                  {recentExpenses.length} entries
                </span>
              </div>

              {recentExpenses.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-12 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                    <FiShoppingBag size={20} className="text-rose-400" />
                  </div>
                  <p className="text-sm text-gray-500">No recent expenses.</p>
                  <button onClick={() => setIsModalOpen(true)}
                    className="text-xs text-rose-400 hover:text-rose-300 transition-colors">
                    + Add your first expense
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-white/5">
                  {recentExpenses.map((exp, i) => (
                    <motion.li
                      key={exp._id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="flex items-center justify-between px-5 py-3.5 hover:bg-white/3 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/15 flex items-center justify-center flex-shrink-0">
                          <FiShoppingBag size={13} className="text-rose-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-200 truncate">{exp.description}</p>
                          <p className="text-xs text-gray-600 mt-0.5">
                            {exp.categoryID?.name || "Uncategorized"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-sm font-bold text-rose-400">
                          ₹{exp.amount.toLocaleString("en-IN")}
                        </span>
                        <span className="hidden sm:block text-xs text-gray-600">
                          {new Date(exp.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </span>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}

        {/* ─── ANALYTICS ─── */}
        {activeTab === "analytics" && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 xl:grid-cols-2 gap-5"
          >
            {/* Monthly trend */}
            <div className="rounded-2xl bg-[#0d0f14]/80 border border-white/10 backdrop-blur-sm p-5">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-7 h-7 rounded-lg bg-rose-500/15 border border-rose-500/20 flex items-center justify-center">
                  <FiBarChart2 size={13} className="text-rose-400" />
                </div>
                <h3 className="text-sm font-semibold text-white">Monthly Expenses Trend</h3>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={chartData} barSize={12}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="month" stroke="#374151" tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#374151" tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                  <Bar dataKey="amount" fill="#ef4444" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Category breakdown */}
            <div className="rounded-2xl bg-[#0d0f14]/80 border border-white/10 backdrop-blur-sm p-5">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-500/20 flex items-center justify-center">
                  <FiTag size={13} className="text-cyan-400" />
                </div>
                <h3 className="text-sm font-semibold text-white">Category Breakdown</h3>
              </div>

              {categoryBreakdown.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 gap-2">
                  <FiTag size={24} className="text-gray-700" />
                  <p className="text-sm text-gray-600">No data yet</p>
                </div>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={categoryBreakdown} dataKey="value"
                        cx="50%" cy="50%" outerRadius={80} innerRadius={40} paddingAngle={3}
                        label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                        labelLine={{ stroke: "#4B5563" }}
                      >
                        {categoryBreakdown.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} strokeWidth={0} />
                        ))}
                      </Pie>
                      <Tooltip content={<ChartTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Custom legend */}
                  <div className="flex flex-wrap gap-2 mt-3 justify-center">
                    {categoryBreakdown.map((cat, i) => (
                      <span key={i} className="flex items-center gap-1.5 text-xs text-gray-400">
                        <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                        {cat.name}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* ─── RECORDS ─── */}
        {activeTab === "records" && (
          <motion.div
            key="records"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">{expenses.length} total records</p>
              <button onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5
                           border border-white/10 text-sm text-gray-300 hover:bg-white/10
                           hover:border-white/20 transition-all">
                <FiPlus size={14} /> Add
              </button>
            </div>

            {expenses.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-16 text-center rounded-2xl border border-white/8 bg-white/2">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                  <FiTrendingDown size={22} className="text-rose-400" />
                </div>
                <p className="text-sm text-gray-500">No expenses recorded yet.</p>
                <button onClick={() => setIsModalOpen(true)}
                  className="text-xs text-rose-400 hover:text-rose-300 transition-colors">
                  + Add your first expense
                </button>
              </div>
            ) : (
              <div className="rounded-2xl bg-[#0d0f14]/80 border border-white/10 backdrop-blur-sm overflow-hidden">
                {/* Desktop header */}
                <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-3 border-b border-white/8">
                  {["Description", "Category", "Amount", "Date", ""].map((h, i) => (
                    <span key={i} className="text-[11px] font-medium text-gray-600 uppercase tracking-widest">{h}</span>
                  ))}
                </div>

                <div className="divide-y divide-white/5">
                  {expenses.map((expense, i) => (
                    <motion.div
                      key={expense._id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="flex sm:grid sm:grid-cols-[1fr_auto_auto_auto_auto] items-center gap-3 sm:gap-4
                                 px-5 py-3.5 hover:bg-white/3 transition-colors"
                    >
                      {/* Description */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/15 flex items-center justify-center flex-shrink-0">
                          <FiShoppingBag size={13} className="text-rose-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-200 truncate">{expense.description}</p>
                      </div>

                      {/* Category pill */}
                      <span className="hidden sm:inline-flex text-xs px-2.5 py-1 rounded-full
                                       bg-violet-500/10 border border-violet-500/20 text-violet-400 whitespace-nowrap">
                        {expense.categoryID?.name || "Other"}
                      </span>

                      {/* Amount */}
                      <span className="text-sm font-bold text-rose-400 whitespace-nowrap">
                        ₹{expense.amount.toLocaleString("en-IN")}
                      </span>

                      {/* Date */}
                      <span className="hidden sm:block text-xs text-gray-600 whitespace-nowrap">
                        {new Date(expense.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </span>

                      {/* Delete */}
                      <button
                        onClick={() => deleteExpense(expense._id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0
                                   text-gray-600 hover:bg-rose-500/15 hover:text-rose-400 transition-all"
                      >
                        <FiTrash2 size={13} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ ADD EXPENSE MODAL ══ */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsModalOpen(false)}>
          <Transition.Child as={Fragment}
            enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100"
            leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/70 backdrop-blur-md" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child as={Fragment}
              enter="ease-out duration-250" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
              leave="ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-md rounded-2xl bg-[#0f1115] border border-white/12 shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/25 flex items-center justify-center">
                      <FiTrendingDown size={14} className="text-rose-400" />
                    </div>
                    <Dialog.Title className="text-sm font-semibold text-white">Add Expense</Dialog.Title>
                  </div>
                  <button onClick={() => setIsModalOpen(false)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all">
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5">
                  <form onSubmit={handleSubmit(SubmitHandler)} className="space-y-4">

                    <Field label="Category" icon={<FiTag size={14} />} error={errors.categoryID?.message}>
                      <select
                        {...register("categoryID", { required: "Category required" })}
                        className={selectCls}
                      >
                        <option value="">Select category</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                      </select>
                    </Field>

                    <Field label="Amount (₹)" icon={<FiDollarSign size={14} />} error={errors.amount?.message}>
                      <input type="number"
                        {...register("amount", { required: "Amount required" })}
                        placeholder="Enter amount"
                        className={inputCls} />
                    </Field>

                    <Field label="Date" icon={<FiCalendar size={14} />} error={errors.date?.message}>
                      <input type="date"
                        {...register("date", { required: "Date required" })}
                        className={inputCls} />
                    </Field>

                    <Field label="Description" icon={<FiFileText size={14} />} error={errors.description?.message}>
                      <input type="text"
                        {...register("description", { required: "Description required" })}
                        placeholder="What did you spend on?"
                        className={inputCls} />
                    </Field>

                    <input type="hidden" {...register("userID")} />

                    <button type="submit" disabled={isSubmitting}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600
                                 font-semibold text-sm text-white shadow-lg shadow-rose-500/20
                                 hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200
                                 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0
                                 flex items-center justify-center gap-2 mt-2">
                      {isSubmitting
                        ? <><FiRefreshCw size={13} className="animate-spin" /> Adding...</>
                        : <><FiPlus size={14} /> Add Expense</>}
                    </button>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

    </div>
  );
};