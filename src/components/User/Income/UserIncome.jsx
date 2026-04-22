import  { useState, useEffect, Fragment, useMemo } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import axiosInstance from "../../Utils/axiosInstance";
import {
  fetchIncomeData,
  fetchRecurring,
} from "../../../redux/income/incomeSlice";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {  XMarkIcon, TrashIcon } from "@heroicons/react/24/outline";
import {
  FaPauseCircle,
  FaTrashAlt,
} from "react-icons/fa";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiDollarSign,
  FiPercent,
  FiCalendar,
  FiRepeat,
  FiBarChart2,
  FiList,
  FiAlignLeft,
  FiZap,
  FiRefreshCw,
  FiPlus,
} from "react-icons/fi";

/* ─── Shimmer skeleton ─── */
const Shimmer = ({ className = "" }) => (
  <div
    className={`relative overflow-hidden bg-white/5 rounded-xl ${className}`}
  >
    <div
      className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite]
                    bg-gradient-to-r from-transparent via-white/8 to-transparent"
    />
  </div>
);

/* ─── Custom chart tooltip ─── */
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a1d26] border border-[var(--border)] rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-xs text-[var(--muted)] mb-2 font-medium">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-sm font-bold" style={{ color: p.color }}>
          {p.name}: ₹{p.value?.toLocaleString("en-IN")}
        </p>
      ))}
    </div>
  );
};

/* ─── Source icon map ─── */
const sourceConfig = {
  Salary: {
    color: "text-emerald-400",
    bg: "bg-emerald-500/15 border-emerald-500/25",
    label: "Salary",
  },
  Freelancing: {
    color: "text-cyan-400",
    bg: "bg-cyan-500/15 border-cyan-500/25",
    label: "Freelancing",
  },
  Investments: {
    color: "text-blue-400",
    bg: "bg-blue-500/15 border-blue-500/25",
    label: "Investments",
  },
  Other: {
    color: "text-[var(--muted)]",
    bg: "bg-gray-500/15 border-gray-500/25",
    label: "Other",
  },
};

/* ─── Field wrapper ─── */
const Field = ({ label, error, children }) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-medium text-[var(--muted)] tracking-wide">
      {label}
    </label>
    {children}
    {error && (
      <p className="flex items-center gap-1.5 text-red-400 text-xs">
        <span className="w-1 h-1 rounded-full bg-red-400 flex-shrink-0" />
        {error}
      </p>
    )}
  </div>
);

/* ══════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════ */
export const UserIncome = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const { incomes, expenses, recurringPayments, loading } = useSelector(
    (state) => state.income,
  );
  /* ── ALL ORIGINAL STATE — UNTOUCHED ── */
  const [activeTab, setActiveTab] = useState("summary");
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpense: 0,
    netSavings: 0,
    savingsRate: 0,
  });
  const [tips, setTips] = useState([]);
  const [monthlyIncomeExpense, setMonthlyIncomeExpense] = useState([]);
  const [monthlyIncomeTrend, setMonthlyIncomeTrend] = useState([]);
  const [avgIncome, setAvgIncome] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();
  const userId = useMemo(() => user?._id, [user]);
  const COLORS = ["#06b6d4", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];
  const [recurringForm, setRecurringForm] = useState({
    name: "",
    amount: "",
    frequency: "Monthly",
    startDate: "",
    category: "",
  });
  const [recurringLoading, setRecurringLoading] = useState(false);

  /* ── ALL ORIGINAL LOGIC — UNTOUCHED ── */
  const computeAnalytics = (incomesData, expensesData) => {
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
      const m = new Date(inc.date).getMonth();
      months[m].income += inc.amount;
    });
    expensesData.forEach((exp) => {
      const m = new Date(exp.date).getMonth();
      months[m].expense += exp.amount;
    });
    const monthly = months.map((m, idx) => ({
      month: new Date(0, idx).toLocaleString("default", { month: "short" }),
      income: m.income,
      expense: m.expense,
    }));
    setMonthlyIncomeExpense(monthly);
    setMonthlyIncomeTrend(
      monthly.map((m) => ({ month: m.month, amount: m.income })),
    );
    setAvgIncome(months.reduce((a, b) => a + b.income, 0) / 12);
    let suggestedTips = [];
    if (savingsRate < 20)
      suggestedTips = [
        "Track your expenses closely — small leaks sink big ships.",
        "Avoid impulse spending; wait a day before non-essential buys.",
        "Plan home-cooked meals to reduce daily spending.",
      ];
    else if (savingsRate < 40)
      suggestedTips = [
        "Good job! Start building a 6-month emergency fund.",
        "Automate savings or SIPs to stay consistent.",
        "Review recurring subscriptions and cancel unused ones.",
      ];
    else
      suggestedTips = [
        "Great savings! Consider diversifying investments.",
        "Focus on long-term growth via index funds or ETFs.",
        "Explore low-effort passive income opportunities.",
      ];
    setTips(suggestedTips);
  };

  useEffect(() => {
    if (!userId) return;

    setValue("userID", userId);

    dispatch(fetchIncomeData(userId));

    dispatch(fetchRecurring(userId));
  }, [dispatch, userId]);
  useEffect(() => {
    if (!incomes.length && !expenses.length) return;

    computeAnalytics(incomes, expenses);
  }, [incomes, expenses]);
  const onSubmitIncome = async (data) => {
    const payload = {
      userID: data.userID,
      amount: Number(data.amount),
      source: data.source,
      date: data.date,
    };
    try {
      setIsSubmitting(true);
      const res = await axiosInstance.post("/incomes", payload);
      if (res.status === 201) {
        alert("✅ Income added successfully!");
        setIsModalOpen(false);
        reset();
        dispatch(fetchIncomeData(userId));
      } else {
        alert("❌ Something went wrong.");
      }
    } catch (error) {
      console.error("Error adding income:", error);
      alert("⚠️ " + (error.message || "Failed to add income"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this income?")) return;
    try {
      await axiosInstance.delete(`/incomes/${id}`);
      dispatch(fetchIncomeData(userId));
    } catch (error) {
      console.error("Error deleting income:", error);
      alert("Failed to delete income.");
    }
  };

  const handleRecurringChange = (e) =>
    setRecurringForm({ ...recurringForm, [e.target.name]: e.target.value });

  const handleRecurringSubmit = async (e) => {
    e.preventDefault();
    if (
      !recurringForm.name ||
      !recurringForm.amount ||
      !recurringForm.startDate
    )
      return alert("Please fill all required fields");
    try {
      setRecurringLoading(true);
      await axiosInstance.post("/recurring", { ...recurringForm, userId });
      setRecurringForm({
        name: "",
        amount: "",
        frequency: "Monthly",
        startDate: "",
        category: "",
      });
      dispatch(fetchRecurring(userId));
    } catch (error) {
      console.error("Failed to add recurring payment", error);
    } finally {
      setRecurringLoading(false);
    }
  };

  const handleRecurringDelete = async (id) => {
    if (!window.confirm("Delete this recurring payment?")) return;
    try {
      await axiosInstance.delete(`/recurring/${id}`);
      dispatch(fetchRecurring(userId));
    } catch (error) {
      console.error("Failed to delete recurring payment", error);
    }
  };

  /* ── Tab config ── */
  const tabs = [
    { id: "summary", label: "Summary", icon: <FiAlignLeft size={14} /> },
    { id: "analytics", label: "Analytics", icon: <FiBarChart2 size={14} /> },
    { id: "records", label: "Records", icon: <FiList size={14} /> },
    { id: "recurring", label: "Recurring", icon: <FiRepeat size={14} /> },
  ];

  /* ── Input class ── */
  const inputCls =
    "w-full px-3.5 py-2.5 rounded-xl bg-[var(--card)] border border-[var(--border)] text-gray-100 placeholder-gray-600 text-sm focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 hover:border-[var(--border)] transition-all duration-200";

  return (
    <div className="space-y-6 text-[var(--text)]">
      {/* ══ HEADER ══ */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Income Center
          </h1>
          <p className="text-[var(--muted)] mt-1 text-sm">
            Track income, analyze trends, manage all records in one place.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl
                     bg-gradient-to-r from-cyan-500 to-blue-600 text-sm font-semibold
                     shadow-lg shadow-cyan-500/20 hover:opacity-90 hover:-translate-y-0.5
                     transition-all duration-200 self-start sm:self-auto"
        >
          <FiPlus size={16} />
          Add Income
        </button>
      </motion.div>

      {/* ══ PILL TABS ══ */}
      <div className="flex items-center gap-1 bg-white/4 border border-[var(--border)] rounded-2xl p-1.5 w-fit flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
              ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 text-cyan-400"
                  : "text-[var(--muted)] hover:text-gray-300 hover:bg-white/5"
              }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ══ LOADING ══ */}
      {loading && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Shimmer key={i} className="h-28 rounded-2xl" />
            ))}
          </div>
          <Shimmer className="h-40 rounded-2xl" />
        </div>
      )}

      {/* ══ TAB CONTENT ══ */}
      {!loading && (
        <AnimatePresence mode="wait">
          {/* ─── SUMMARY ─── */}
          {activeTab === "summary" && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Stat cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    label: "Total Income",
                    value: `₹${stats.totalIncome.toLocaleString("en-IN")}`,
                    color: "text-emerald-400",
                    bg: "bg-emerald-500/5",
                    border: "border-emerald-500/20",
                    glow: "bg-emerald-400",
                    icon: <FiTrendingUp size={17} />,
                  },
                  {
                    label: "Total Expenses",
                    value: `₹${stats.totalExpense.toLocaleString("en-IN")}`,
                    color: "text-rose-400",
                    bg: "bg-rose-500/5",
                    border: "border-rose-500/20",
                    glow: "bg-rose-400",
                    icon: <FiTrendingDown size={17} />,
                  },
                  {
                    label: "Net Savings",
                    value: `₹${stats.netSavings.toLocaleString("en-IN")}`,
                    color: "text-cyan-400",
                    bg: "bg-cyan-500/5",
                    border: "border-cyan-500/20",
                    glow: "bg-cyan-400",
                    icon: <FiDollarSign size={17} />,
                  },
                  {
                    label: "Savings Rate",
                    value: `${stats.savingsRate}%`,
                    color: "text-amber-400",
                    bg: "bg-amber-500/5",
                    border: "border-amber-500/20",
                    glow: "bg-amber-400",
                    icon: <FiPercent size={17} />,
                  },
                ].map((card, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: idx * 0.07 }}
                    whileHover={{ y: -3, transition: { duration: 0.2 } }}
                    className={`relative overflow-hidden rounded-2xl border p-5 ${card.bg} ${card.border} backdrop-blur-sm`}
                  >
                    <div
                      className={`absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-15 ${card.glow}`}
                    />
                    <div className="relative">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${card.bg} border ${card.border}`}
                      >
                        <span className={card.color}>{card.icon}</span>
                      </div>
                      <p className="text-[11px] font-medium text-[var(--muted)] uppercase tracking-widest mb-1">
                        {card.label}
                      </p>
                      <p
                        className={`text-2xl font-bold tracking-tight ${card.color}`}
                      >
                        {card.value}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Smart Tips */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-2xl bg-amber-500/5 border border-amber-500/20 p-5"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/25 flex items-center justify-center">
                    <FiZap size={14} className="text-amber-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-amber-300">
                    Smart Finance Insights
                  </h3>
                </div>
                <ul className="space-y-2.5">
                  {tips.map((tip, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-sm text-gray-300"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 mt-1.5" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </motion.div>
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
              {/* Bar chart */}
              <div className="rounded-2xl bg-[#0d0f14]/80 border border-[var(--border)] backdrop-blur-sm p-5">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/15 border border-blue-500/20 flex items-center justify-center">
                    <FiBarChart2 size={13} className="text-blue-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-[var(--text)]">
                    Monthly Income vs Expenses
                  </h3>
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={monthlyIncomeExpense} barSize={10}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.05)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      stroke="#374151"
                      tick={{ fill: "#6B7280", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#374151"
                      tick={{ fill: "#6B7280", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      content={<ChartTooltip />}
                      cursor={{ fill: "rgba(255,255,255,0.03)" }}
                    />
                    <Legend
                      wrapperStyle={{
                        fontSize: 12,
                        color: "#9CA3AF",
                        paddingTop: 12,
                      }}
                    />
                    <Bar
                      dataKey="income"
                      fill="#10b981"
                      radius={[6, 6, 0, 0]}
                    />
                    <Bar
                      dataKey="expense"
                      fill="#ef4444"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Line chart */}
              <div className="rounded-2xl bg-[#0d0f14]/80 border border-[var(--border)] backdrop-blur-sm p-5">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-500/20 flex items-center justify-center">
                    <FiTrendingUp size={13} className="text-cyan-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-[var(--text)]">
                    Income Trend & Average
                  </h3>
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={monthlyIncomeTrend}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.05)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      stroke="#374151"
                      tick={{ fill: "#6B7280", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#374151"
                      tick={{ fill: "#6B7280", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      content={<ChartTooltip />}
                      cursor={{ stroke: "rgba(255,255,255,0.1)" }}
                    />
                    <ReferenceLine
                      y={avgIncome}
                      stroke="#3b82f6"
                      strokeDasharray="4 4"
                      label={{
                        value: `Avg ₹${Math.round(avgIncome / 1000)}k`,
                        position: "right",
                        fill: "#3b82f6",
                        fontSize: 10,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#06b6d4"
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: "#06b6d4", strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: "#06b6d4" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
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
              className="space-y-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-[var(--text)]">
                    All Income Records
                  </h3>
                  <p className="text-[var(--muted)] text-xs mt-0.5">
                    {incomes.length} records total
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl
                             bg-white/5 border border-[var(--border)] text-sm text-gray-300
                             hover:bg-white/10 hover:border-[var(--border)] transition-all"
                >
                  <FiPlus size={14} /> Add
                </button>
              </div>

              {incomes.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-16 text-center rounded-2xl border border-[var(--border)] bg-white/2">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <FiTrendingUp size={22} className="text-emerald-400" />
                  </div>
                  <p className="text-sm text-[var(--muted)]">
                    No income records yet.
                  </p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    + Add your first income
                  </button>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {incomes.map((income, idx) => {
                    const src =
                      sourceConfig[income.source] || sourceConfig.Other;
                    return (
                      <motion.div
                        key={income._id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.04 }}
                        whileHover={{ y: -2, transition: { duration: 0.2 } }}
                        className="rounded-2xl bg-[#0d0f14]/80 border border-[var(--border)]
                                   hover:border-[var(--border)] transition-all p-5 flex flex-col justify-between"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <span
                              className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${src.bg} ${src.color}`}
                            >
                              <FiTrendingUp size={11} />
                              {income.source}
                            </span>
                          </div>
                          <button
                            onClick={() => handleDelete(income._id)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center
                                       text-gray-600 hover:bg-rose-500/15 hover:text-rose-400
                                       transition-all duration-200"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                        <div>
                          <p
                            className={`text-2xl font-bold tracking-tight ${src.color}`}
                          >
                            ₹{income.amount.toLocaleString("en-IN")}
                          </p>
                          <p className="flex items-center gap-1.5 text-xs text-gray-600 mt-1.5">
                            <FiCalendar size={11} />
                            {new Date(income.date).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* ─── RECURRING ─── */}
          {activeTab === "recurring" && (
            <motion.div
              key="recurring"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/25 flex items-center justify-center">
                  <FiRepeat size={16} className="text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-[var(--text)]">
                    Recurring Payments
                  </h2>
                  <p className="text-xs text-[var(--muted)]">
                    Manage your regular income & payment schedules
                  </p>
                </div>
              </div>

              {/* Add form */}
              <motion.form
                onSubmit={handleRecurringSubmit}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl bg-[#0d0f14]/80 border border-[var(--border)] backdrop-blur-sm p-5"
              >
                <h3 className="text-sm font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
                  <FiPlus size={14} className="text-cyan-400" />
                  Add New Recurring Payment
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <input
                    type="text"
                    name="name"
                    placeholder="Payment name"
                    value={recurringForm.name}
                    onChange={handleRecurringChange}
                    className={inputCls}
                  />
                  <input
                    type="number"
                    name="amount"
                    placeholder="Amount (₹)"
                    value={recurringForm.amount}
                    onChange={handleRecurringChange}
                    className={inputCls}
                  />
                  <select
                    name="frequency"
                    value={recurringForm.frequency}
                    onChange={handleRecurringChange}
                    className={inputCls + " appearance-none"}
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                  <input
                    type="date"
                    name="startDate"
                    value={recurringForm.startDate}
                    onChange={handleRecurringChange}
                    className={inputCls}
                  />
                  <input
                    type="text"
                    name="category"
                    placeholder="Category (optional)"
                    value={recurringForm.category}
                    onChange={handleRecurringChange}
                    className={inputCls}
                  />
                  <button
                    type="submit"
                    disabled={recurringLoading}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
                               bg-gradient-to-r from-cyan-500 to-blue-600 text-sm font-semibold text-[var(--text)]
                               hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200
                               disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0
                               shadow-lg shadow-cyan-500/20"
                  >
                    {recurringLoading ? (
                      <>
                        <FiRefreshCw size={13} className="animate-spin" />{" "}
                        Adding...
                      </>
                    ) : (
                      <>
                        <FiPlus size={13} /> Add Payment
                      </>
                    )}
                  </button>
                </div>
              </motion.form>

              {/* Recurring list */}
              <div className="rounded-2xl bg-[#0d0f14]/80 border border-[var(--border)] backdrop-blur-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[var(--text)]">
                    Your Recurring Payments
                  </h3>
                  <span className="text-xs text-[var(--muted)] bg-white/5 px-2.5 py-1 rounded-full">
                    {recurringPayments.length} active
                  </span>
                </div>

                {recurringPayments.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 py-10 text-center">
                    <FiRepeat size={22} className="text-gray-700" />
                    <p className="text-sm text-gray-600">
                      No recurring payments added yet.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Desktop table */}
                    <div className="hidden sm:block overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-[var(--border)]">
                            {[
                              "Name",
                              "Amount",
                              "Frequency",
                              "Start Date",
                              "Category",
                              "Actions",
                            ].map((h) => (
                              <th
                                key={h}
                                className="text-left px-5 py-3 text-[11px] font-medium text-gray-600 uppercase tracking-widest"
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {recurringPayments.map((pay, i) => (
                            <motion.tr
                              key={pay._id}
                              initial={{ opacity: 0, x: -12 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.04 }}
                              className="border-b border-white/5 hover:bg-white/3 transition-colors"
                            >
                              <td className="px-5 py-3.5 text-gray-200 font-medium">
                                {pay.name}
                              </td>
                              <td className="px-5 py-3.5 text-emerald-400 font-semibold">
                                ₹{pay.amount.toLocaleString("en-IN")}
                              </td>
                              <td className="px-5 py-3.5">
                                <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                                  {pay.frequency}
                                </span>
                              </td>
                              <td className="px-5 py-3.5 text-[var(--muted)] text-xs">
                                {new Date(pay.startDate).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )}
                              </td>
                              <td className="px-5 py-3.5 text-[var(--muted)] text-xs">
                                {pay.category || "—"}
                              </td>
                              <td className="px-5 py-3.5">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() =>
                                      alert("Pause feature coming soon")
                                    }
                                    className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:bg-amber-500/15 hover:text-amber-400 transition-all"
                                  >
                                    <FaPauseCircle size={14} />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleRecurringDelete(pay._id)
                                    }
                                    className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:bg-rose-500/15 hover:text-rose-400 transition-all"
                                  >
                                    <FaTrashAlt size={13} />
                                  </button>
                                </div>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile cards */}
                    <div className="sm:hidden divide-y divide-white/5">
                      {recurringPayments.map((pay) => (
                        <div
                          key={pay._id}
                          className="px-4 py-4 flex items-center justify-between gap-3"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-200 truncate">
                              {pay.name}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-emerald-400 text-xs font-semibold">
                                ₹{pay.amount.toLocaleString("en-IN")}
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400">
                                {pay.frequency}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-1.5 flex-shrink-0">
                            <button
                              onClick={() => alert("Pause feature coming soon")}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 hover:bg-amber-500/15 hover:text-amber-400 transition-all"
                            >
                              <FaPauseCircle size={15} />
                            </button>
                            <button
                              onClick={() => handleRecurringDelete(pay._id)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 hover:bg-rose-500/15 hover:text-rose-400 transition-all"
                            >
                              <FaTrashAlt size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* ══ ADD INCOME MODAL ══ */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/70 backdrop-blur-md" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-250"
              enterFrom="opacity-0 scale-95 y-4"
              enterTo="opacity-100 scale-100 y-0"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md rounded-2xl bg-[#0f1115] border border-white/12 shadow-2xl overflow-hidden">
                {/* Modal header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
                      <FiTrendingUp size={14} className="text-emerald-400" />
                    </div>
                    <Dialog.Title className="text-sm font-semibold text-[var(--text)]">
                      Add New Income
                    </Dialog.Title>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--muted)] hover:text-[var(--text)] hover:bg-white/10 transition-all"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>

                {/* Modal body */}
                <div className="px-6 py-5">
                  <form
                    onSubmit={handleSubmit(onSubmitIncome)}
                    className="space-y-4"
                  >
                    <Field label="Amount (₹)" error={errors.amount?.message}>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Enter amount"
                        {...register("amount", {
                          required: "Amount is required",
                        })}
                        className={inputCls}
                      />
                    </Field>

                    <Field label="Income Source" error={errors.source?.message}>
                      <select
                        {...register("source", {
                          required: "Source is required",
                        })}
                        className={inputCls + " appearance-none"}
                      >
                        <option value="">Select income source</option>
                        <option value="Salary">Salary</option>
                        <option value="Freelancing">Freelancing</option>
                        <option value="Investments">Investments</option>
                        <option value="Other">Other</option>
                      </select>
                    </Field>

                    <Field label="Date" error={errors.date?.message}>
                      <input
                        type="date"
                        {...register("date", { required: "Date is required" })}
                        className={inputCls}
                      />
                    </Field>

                    <input type="hidden" {...register("userID")} />

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600
                                 font-semibold text-sm text-[var(--text)] shadow-lg shadow-cyan-500/20
                                 hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200
                                 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0
                                 flex items-center justify-center gap-2 mt-2"
                    >
                      {isSubmitting ? (
                        <>
                          <FiRefreshCw size={13} className="animate-spin" />{" "}
                          Adding...
                        </>
                      ) : (
                        <>
                          <FiPlus size={14} /> Add Income
                        </>
                      )}
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
