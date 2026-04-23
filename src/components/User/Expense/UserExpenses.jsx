import { useEffect, useState, Fragment, useMemo } from "react";
import axiosInstance from "../../Utils/axiosInstance";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllExpenses, fetchRecentExpenses, fetchCategories } from "../../../redux/expense/expenseSlice";
import { Dialog, Transition } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  FiTrendingDown, FiTag, FiDollarSign, FiCalendar,
  FiFileText, FiList, FiBarChart2, FiAlignLeft,
  FiPlus, FiTrash2, FiRefreshCw, FiShoppingBag,
} from "react-icons/fi";

/* ─── Shimmer ─── */
const Shimmer = ({ className = "" }) => (
  <div className={`relative overflow-hidden bg-[var(--surface-tertiary)] rounded-xl ${className}`}>
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite]
                    bg-gradient-to-r from-transparent via-[var(--surface-primary)]/10 to-transparent" />
  </div>
);

/* ─── Custom tooltip ─── */
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[var(--surface-primary)] border border-[var(--border)] rounded-xl px-4 py-3 shadow-2xl backdrop-blur-md">
      <p className="text-xs text-[var(--text-muted)] mb-1 font-medium">{label}</p>
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
    <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider ml-1">{label}</label>
    <div className="relative">
      {icon && (
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none z-10 transition-colors group-focus-within:text-rose-500">
          {icon}
        </span>
      )}
      {children}
    </div>
    {error && (
      <p className="flex items-center gap-1.5 text-rose-500 text-[11px] font-medium animate-in fade-in slide-in-from-top-1 ml-1">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
        {error}
      </p>
    )}
  </div>
);

const inputCls = "w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border)] text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:border-rose-500/60 focus:ring-4 focus:ring-rose-500/10 hover:bg-[var(--surface-tertiary)] transition-all duration-200 shadow-sm";
const selectCls = "w-full pl-10 pr-10 py-3 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-rose-500/60 focus:ring-4 focus:ring-rose-500/10 hover:bg-[var(--surface-tertiary)] transition-all duration-200 appearance-none shadow-sm cursor-pointer";

/* ══════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════ */
export const UserExpenses = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const { categories, recentExpenses, expenses } = useSelector((state) => state.expense);
  const [activeTab, setActiveTab] = useState("overview");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userId = useMemo(() => user?._id, [user]);
  const COLORS = ["#ef4444", "#06b6d4", "#10b981", "#f59e0b", "#6366f1", "#ec4899", "#8b5cf6"];

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  useEffect(() => {
    if (userId) {
      setValue("userID", userId);
      dispatch(fetchCategories());
      dispatch(fetchRecentExpenses(userId));
      dispatch(fetchAllExpenses(userId));
    }
  }, [dispatch, userId, setValue]);

  const { chartData, categoryBreakdown } = useMemo(() => {
    const monthly = Array.from({ length: 12 }, () => 0);
    const categoryMap = {};
    expenses.forEach((exp) => {
      const date = new Date(exp.date);
      if (date.getFullYear() === new Date().getFullYear()) {
        const m = date.getMonth();
        monthly[m] += exp.amount;
      }
      const catName = exp.categoryID?.name || "Other";
      categoryMap[catName] = (categoryMap[catName] || 0) + exp.amount;
    });

    const formattedTrend = monthly.map((amt, idx) => ({
      month: new Date(0, idx).toLocaleString("default", { month: "short" }),
      amount: amt,
    }));

    const formattedBreakdown = Object.entries(categoryMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    return { chartData: formattedTrend, categoryBreakdown: formattedBreakdown };
  }, [expenses]);

  const SubmitHandler = async (data) => {
    try {
      setIsSubmitting(true);
      await axiosInstance.post("/expenses", {
        userID: data.userID,
        categoryID: data.categoryID,
        amount: data.amount,
        date: data.date,
        description: data.description,
      });
      reset({ userID: userId });
      setIsModalOpen(false);
      dispatch(fetchRecentExpenses(userId));
      dispatch(fetchAllExpenses(userId));
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteExpense = async (id) => {
    if (!window.confirm("Delete this expense permanently?")) return;
    try {
      await axiosInstance.delete(`/expenses/${id}`);
      dispatch(fetchAllExpenses(userId));
      dispatch(fetchRecentExpenses(userId));
    } catch (error) { console.error("Delete error:", error); }
  };

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const avgExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0;
  const topCategory = categoryBreakdown[0]?.name || "—";
  const thisMonthTotal = expenses
    .filter(e => {
      const d = new Date(e.date);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((s, e) => s + e.amount, 0);

  const tabs = [
    { id: "overview", label: "Overview", icon: <FiAlignLeft size={14} /> },
    { id: "analytics", label: "Analytics", icon: <FiBarChart2 size={14} /> },
    { id: "records", label: "Records", icon: <FiList size={14} /> },
  ];

  return (
    <div className="space-y-6 text-[var(--text-primary)]">

      {/* ══ HEADER ══ */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)] bg-clip-text text-transparent">
            Expense Center
          </h1>
          <p className="text-[var(--text-muted)] mt-1 text-sm font-medium">Analyze patterns and optimize your spending.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                     bg-gradient-to-r from-rose-500 to-pink-600 text-sm font-bold text-white
                     shadow-lg shadow-rose-500/20 hover:opacity-95 hover:-translate-y-0.5
                     transition-all duration-200 active:scale-95"
        >
          <FiPlus size={18} /> Add Expense
        </button>
      </motion.div>

      {/* ══ QUICK STAT CARDS ══ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Expenses", value: `₹${totalExpenses.toLocaleString("en-IN")}`, color: "text-rose-500", bg: "bg-rose-500/5", border: "border-rose-500/20", glow: "bg-rose-500", icon: <FiTrendingDown size={18} /> },
          { label: "This Month", value: `₹${thisMonthTotal.toLocaleString("en-IN")}`, color: "text-amber-500", bg: "bg-amber-500/5", border: "border-amber-500/20", glow: "bg-amber-500", icon: <FiCalendar size={18} /> },
          { label: "Avg per Entry", value: `₹${Math.round(avgExpense).toLocaleString("en-IN")}`, color: "text-cyan-500", bg: "bg-cyan-500/5", border: "border-cyan-500/20", glow: "bg-cyan-500", icon: <FiDollarSign size={18} /> },
          { label: "Top Category", value: topCategory, color: "text-indigo-500", bg: "bg-indigo-500/5", border: "border-indigo-500/20", glow: "bg-indigo-500", icon: <FiTag size={18} /> },
        ].map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            whileHover={{ y: -3 }}
            className={`relative overflow-hidden rounded-2xl border p-5 bg-[var(--surface-primary)] ${card.border} backdrop-blur-sm shadow-sm`}
          >
            <div className={`absolute -top-10 -right-10 w-24 h-24 rounded-full blur-3xl opacity-10 ${card.glow}`} />
            <div className="relative">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${card.bg} border ${card.border} shadow-inner`}>
                <span className={card.color}>{card.icon}</span>
              </div>
              <p className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">{card.label}</p>
              <p className={`text-2xl font-bold tracking-tight truncate ${card.color}`}>{card.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ══ PILL TABS ══ */}
      <div className="flex items-center gap-1 bg-[var(--surface-secondary)] border border-[var(--border)] rounded-2xl p-1.5 w-fit flex-wrap shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all duration-200
              ${activeTab === tab.id
                ? "bg-[var(--surface-primary)] border border-[var(--border)] text-rose-500 shadow-sm"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-tertiary)]"
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
            <div className="rounded-2xl bg-[var(--surface-primary)] border border-[var(--border)] backdrop-blur-sm overflow-hidden shadow-xl">
              <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border)] bg-[var(--surface-secondary)]/30">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shadow-inner">
                    <FiShoppingBag size={14} className="text-rose-500" />
                  </div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">Recent Expenses</h3>
                </div>
                <span className="text-[10px] font-bold text-[var(--text-muted)] bg-[var(--surface-tertiary)] border border-[var(--border)] px-3 py-1 rounded-full uppercase tracking-wider">
                  {recentExpenses.length} Entries
                </span>
              </div>

              {recentExpenses.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-16 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-[var(--surface-secondary)] border border-[var(--border)] flex items-center justify-center shadow-inner">
                    <FiShoppingBag size={24} className="text-[var(--text-muted)]" />
                  </div>
                  <p className="text-sm text-[var(--text-muted)] font-medium">No recent expenses found.</p>
                  <button onClick={() => setIsModalOpen(true)}
                    className="text-xs font-bold text-rose-500 hover:text-rose-400 transition-colors uppercase tracking-widest">
                    + Add New Expense
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-[var(--border)]">
                  {recentExpenses.map((exp, i) => (
                    <motion.li
                      key={exp._id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="flex items-center justify-between px-6 py-4 hover:bg-[var(--surface-secondary)] transition-colors group"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-[var(--surface-tertiary)] border border-[var(--border)] flex items-center justify-center flex-shrink-0 group-hover:bg-rose-500/10 group-hover:border-rose-500/20 transition-all shadow-sm">
                          <FiShoppingBag size={14} className="text-[var(--text-muted)] group-hover:text-rose-500" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-[var(--text-primary)] truncate">{exp.description}</p>
                          <p className="text-[11px] font-semibold text-[var(--text-muted)] mt-0.5 uppercase tracking-wider">
                            {exp.categoryID?.name || "Uncategorized"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                        <div className="text-right">
                          <p className="text-sm font-extrabold text-rose-500">
                            ₹{exp.amount.toLocaleString("en-IN")}
                          </p>
                          <p className="text-[10px] font-medium text-[var(--text-muted)] mt-0.5">
                            {new Date(exp.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                          </p>
                        </div>
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
            className="grid grid-cols-1 xl:grid-cols-2 gap-6"
          >
            {/* Monthly trend */}
            <div className="rounded-2xl bg-[var(--surface-primary)] border border-[var(--border)] backdrop-blur-sm p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shadow-inner">
                  <FiBarChart2 size={14} className="text-rose-500" />
                </div>
                <h3 className="text-sm font-bold text-[var(--text-primary)]">Monthly trend</h3>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={chartData} barSize={14}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} opacity={0.3} />
                  <XAxis dataKey="month" stroke="var(--border)" tick={{ fill: "var(--text-muted)", fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="var(--border)" tick={{ fill: "var(--text-muted)", fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--surface-tertiary)", opacity: 0.1 }} />
                  <Bar dataKey="amount" fill="#f43f5e" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Category breakdown */}
            <div className="rounded-2xl bg-[var(--surface-primary)] border border-[var(--border)] backdrop-blur-sm p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shadow-inner">
                  <FiTag size={14} className="text-cyan-500" />
                </div>
                <h3 className="text-sm font-bold text-[var(--text-primary)]">Spending Breakdown</h3>
              </div>

              {categoryBreakdown.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-56 gap-2">
                  <FiTag size={32} className="text-[var(--border)]" />
                  <p className="text-sm text-[var(--text-muted)] font-medium">No categorization data available.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={categoryBreakdown} dataKey="value"
                        cx="50%" cy="50%" outerRadius={85} innerRadius={55} paddingAngle={4}
                        label={false}
                      >
                        {categoryBreakdown.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} strokeWidth={0} />
                        ))}
                      </Pie>
                      <Tooltip content={<ChartTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  
                  <div className="space-y-2.5 max-h-[220px] overflow-y-auto px-2 custom-scrollbar">
                    {categoryBreakdown.map((cat, i) => (
                      <div key={i} className="flex items-center justify-between group">
                        <div className="flex items-center gap-2.5">
                          <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ background: COLORS[i % COLORS.length] }} />
                          <span className="text-[11px] font-bold text-[var(--text-secondary)] truncate max-w-[80px]">{cat.name}</span>
                        </div>
                        <span className="text-[11px] font-extrabold text-[var(--text-primary)]">₹{cat.value.toLocaleString("en-IN")}</span>
                      </div>
                    ))}
                  </div>
                </div>
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
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <h3 className="text-lg font-bold text-[var(--text-primary)] tracking-tight">Financial Ledger</h3>
                <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">{expenses.length} Records</span>
              </div>
              <button onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--surface-secondary)]
                           border border-[var(--border)] text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--surface-tertiary)]
                           hover:border-rose-500/30 transition-all shadow-sm active:scale-95">
                <FiPlus size={14} className="text-rose-500" /> NEW RECORD
              </button>
            </div>

            {expenses.length === 0 ? (
              <div className="flex flex-col items-center gap-4 py-20 text-center rounded-2xl border border-[var(--border)] bg-[var(--surface-secondary)]/20 shadow-inner">
                <div className="w-16 h-16 rounded-3xl bg-[var(--surface-tertiary)] border border-[var(--border)] flex items-center justify-center shadow-lg">
                  <FiTrendingDown size={28} className="text-rose-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[var(--text-primary)]">Your records are empty</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1 font-medium">Start tracking your expenses by adding a new record.</p>
                </div>
                <button onClick={() => setIsModalOpen(true)}
                  className="mt-2 text-xs font-extrabold text-white bg-rose-500 px-5 py-2.5 rounded-xl hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20">
                  + REGISTER EXPENSE
                </button>
              </div>
            ) : (
              <div className="rounded-2xl bg-[var(--surface-primary)] border border-[var(--border)] backdrop-blur-sm overflow-hidden shadow-xl">
                <div className="hidden sm:grid grid-cols-[1.5fr_1fr_1fr_1fr_auto] gap-4 px-6 py-4 border-b border-[var(--border)] bg-[var(--surface-secondary)]/50">
                  {["Description", "Category", "Amount", "Entry Date", "Action"].map((h, i) => (
                    <span key={i} className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.15em]">{h}</span>
                  ))}
                </div>

                <div className="divide-y divide-[var(--border)]">
                  {expenses.map((expense, i) => (
                    <motion.div
                      key={expense._id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className="flex sm:grid sm:grid-cols-[1.5fr_1fr_1fr_1fr_auto] items-center gap-4
                                 px-6 py-4 hover:bg-[var(--surface-secondary)] transition-all group"
                    >
                      {/* Description */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-9 h-9 rounded-xl bg-[var(--surface-tertiary)] border border-[var(--border)] flex items-center justify-center flex-shrink-0 group-hover:bg-rose-500/10 group-hover:border-rose-500/20 transition-all shadow-sm">
                          <FiShoppingBag size={14} className="text-[var(--text-muted)] group-hover:text-rose-500" />
                        </div>
                        <p className="text-sm font-bold text-[var(--text-primary)] truncate">{expense.description}</p>
                      </div>

                      {/* Category pill */}
                      <div className="hidden sm:block">
                        <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-[var(--surface-tertiary)] border border-[var(--border)] text-[var(--text-secondary)] uppercase tracking-wider">
                          {expense.categoryID?.name || "Other"}
                        </span>
                      </div>

                      {/* Amount */}
                      <div className="text-right sm:text-left">
                        <span className="text-sm font-extrabold text-rose-500">
                          ₹{expense.amount.toLocaleString("en-IN")}
                        </span>
                      </div>

                      {/* Date */}
                      <span className="hidden sm:block text-[11px] font-semibold text-[var(--text-muted)]">
                        {new Date(expense.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </span>

                      {/* Delete */}
                      <button
                        onClick={() => deleteExpense(expense._id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                                   text-[var(--text-muted)] hover:bg-rose-500 hover:text-white hover:shadow-lg hover:shadow-rose-500/30 transition-all active:scale-90 border border-transparent hover:border-rose-600"
                        title="Delete Record"
                      >
                        <FiTrash2 size={14} />
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
            enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
            leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/75 backdrop-blur-md" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child as={Fragment}
              enter="ease-out duration-300" enterFrom="opacity-0 scale-95 translate-y-8" enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-200" leaveFrom="opacity-100 scale-100 translate-y-0" leaveTo="opacity-0 scale-95 translate-y-8">
              <Dialog.Panel className="w-full max-w-md rounded-3xl bg-[var(--surface-primary)] border border-[var(--border)] shadow-2xl overflow-hidden p-0">

                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-[var(--border)] bg-[var(--surface-secondary)]/50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shadow-inner">
                      <FiTrendingDown size={18} className="text-rose-500" />
                    </div>
                    <div>
                      <Dialog.Title className="text-lg font-bold text-[var(--text-primary)]">New Expense</Dialog.Title>
                      <p className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">Record your spending</p>
                    </div>
                  </div>
                  <button onClick={() => setIsModalOpen(false)}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-tertiary)] transition-all border border-[var(--border)] active:scale-95">
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                {/* Body */}
                <div className="px-8 py-8">
                  <form onSubmit={handleSubmit(SubmitHandler)} className="space-y-5">

                    <Field label="Category" icon={<FiTag size={16} />} error={errors.categoryID?.message}>
                      <select
                        {...register("categoryID", { required: "Please select a category" })}
                        className={selectCls}
                      >
                        <option value="">Select category</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                      </select>
                    </Field>

                    <Field label="Amount (INR)" icon={<FiDollarSign size={16} />} error={errors.amount?.message}>
                      <input type="number" step="0.01"
                        {...register("amount", { required: "Amount is required" })}
                        placeholder="0.00"
                        className={inputCls} />
                    </Field>

                    <Field label="Transaction Date" icon={<FiCalendar size={16} />} error={errors.date?.message}>
                      <input type="date"
                        {...register("date", { required: "Date is required" })}
                        className={inputCls} />
                    </Field>

                    <Field label="Description / Note" icon={<FiFileText size={16} />} error={errors.description?.message}>
                      <input type="text"
                        {...register("description", { required: "Description is required" })}
                        placeholder="Coffee, Rent, Fuel..."
                        className={inputCls} />
                    </Field>

                    <input type="hidden" {...register("userID")} />

                    <button type="submit" disabled={isSubmitting}
                      className="w-full py-4 mt-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600
                                 font-bold text-sm text-white shadow-xl shadow-rose-500/30
                                 hover:opacity-95 hover:-translate-y-1 transition-all duration-300
                                 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0
                                 flex items-center justify-center gap-3">
                      {isSubmitting
                        ? <><FiRefreshCw size={18} className="animate-spin" /> REGISTERING...</>
                        : <><FiPlus size={20} /> ADD EXPENSE</>}
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