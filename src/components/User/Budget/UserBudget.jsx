import { useState, useEffect, Fragment } from "react";
import axiosInstance from "../../Utils/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, Transition } from "@headlessui/react";
import { useSelector ,useDispatch} from "react-redux";
import { fetchBudgetPlan, fetchBudgetData, fetchCategories } from "../../../redux/budget/budgetSlice";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  FiTarget, FiTrendingDown, FiDollarSign, FiGrid,
  FiPieChart, FiCpu, FiSettings, FiPlus, FiTrash2,
  FiAlertTriangle, FiCheckCircle, FiZap, FiRefreshCw,
  FiTag, FiAlignLeft,
} from "react-icons/fi";


/* ─── Shimmer ─── */
const Shimmer = ({ className = "" }) => (
  <div className={`relative overflow-hidden bg-white/5 rounded-xl ${className}`}>
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite]
                    bg-gradient-to-r from-transparent via-white/8 to-transparent" />
  </div>
);

/* ─── Custom chart tooltip ─── */
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a1d26] border border-white/15 rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-xs text-gray-400 mb-2 font-medium">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-sm font-bold" style={{ color: p.color }}>
          {p.name}: ₹{p.value?.toLocaleString("en-IN")}
        </p>
      ))}
    </div>
  );
};

/* ─── Budget progress bar ─── */
const BudgetProgress = ({ pct }) => {
  const color = pct >= 90 ? "from-rose-500 to-red-600"
    : pct >= 70 ? "from-amber-400 to-orange-500"
    : "from-emerald-400 to-teal-500";
  return (
    <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(pct, 100)}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`h-full rounded-full bg-gradient-to-r ${color}`}
      />
    </div>
  );
};

/* ─── Field wrapper ─── */
const Field = ({ label, icon, error, children }) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-medium text-gray-400 tracking-wide">{label}</label>
    <div className="relative">
      {icon && <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none z-10">{icon}</span>}
      {children}
    </div>
    {error && <p className="flex items-center gap-1.5 text-red-400 text-xs"><span className="w-1 h-1 rounded-full bg-red-400 flex-shrink-0" />{error}</p>}
  </div>
);

const inputCls  = "w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-gray-100 placeholder-gray-600 text-sm focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 hover:border-white/20 transition-all duration-200";
const selectCls = "w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-gray-100 text-sm focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 hover:border-white/20 transition-all duration-200 appearance-none";

const COLORS = ["#10b981", "#ef4444", "#3b82f6", "#f59e0b", "#a855f7"];

export const UserBudget = () => {
  const user = useSelector((state) => state.auth.user ) 
  const dispatch = useDispatch();
  const {
    budgets,
    expenses,
    summary,
    categories,
    budgetPlan,
  } = useSelector((state) => state.budget )
  /* ── FIX: Safe userId — never reads ._id when user is null ── */
  const userId = user?._id ?? null;

  /* ── ALL ORIGINAL STATE — UNTOUCHED ── */
  const [activeTab, setActiveTab]                 = useState("overview");
  const [loadingPlan, setLoadingPlan]             = useState(false);
  const [isModalOpen, setIsModalOpen]             = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedBudget, setSelectedBudget]       = useState(null);
  const [isSubmitting, setIsSubmitting]           = useState(false);
  const [isDeleting, setIsDeleting]               = useState(false);
  const [newBudget, setNewBudget]                 = useState({ categoryID: "", amount: "", description: "" });

  /* ── ALL ORIGINAL LOGIC — UNTOUCHED ── */
  

  /* ── FIX: useEffect only runs when userId is a real value ── */
  useEffect(() => {
    if (!userId) return;       // ← guard: skip if user not yet loaded
    dispatch(fetchCategories());
    dispatch(fetchBudgetData(userId))
    
  }, [dispatch,userId]);               // ← re-runs once userId resolves from null → real ID


  const handleAddBudget = async (e) => {
    e.preventDefault();
    if (!userId) return;
    try {
      setIsSubmitting(true);
      await axiosInstance.post("/budget", { ...newBudget, userID: userId, amount: Number(newBudget.amount) });
      setIsModalOpen(false);
      setNewBudget({ categoryID: "", amount: "", description: "" });
      dispatch(fetchBudgetData(userId));
    } catch (error) { console.error("Add budget error:", error); }
    finally { setIsSubmitting(false); }
  };

  const handleDeleteBudget = async () => {
    if (!selectedBudget) return;
    try {
      setIsDeleting(true);
      await axiosInstance.delete(`/budget/${selectedBudget._id}`);
      setConfirmDeleteOpen(false);
      setSelectedBudget(null);
      dispatch(fetchBudgetData(userId));
    } catch (error) { console.error("Delete error:", error); }
    finally { setIsDeleting(false); }
  };

  /* ── Derived totals ── */
  const totalAllocated  = summary.reduce((s, i) => s + i.allocated, 0);
  const totalSpent      = summary.reduce((s, i) => s + i.spent, 0);
  const totalRemaining  = summary.reduce((s, i) => s + i.remaining, 0);
  const overBudgetCount = summary.filter(i => i.spent > i.allocated).length;

  const tabs = [
    { id: "overview",   label: "Overview",   icon: <FiGrid size={14} /> },
    { id: "analytics",  label: "Analytics",  icon: <FiPieChart size={14} /> },
    { id: "ai planner", label: "AI Planner", icon: <FiCpu size={14} /> },
    { id: "manage",     label: "Manage",     icon: <FiSettings size={14} /> },
  ];

  /* ── FIX: Show skeleton while user hasn't resolved yet ── */
  if (!userId) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Shimmer className="h-8 w-48" />
          <Shimmer className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <Shimmer key={i} className="h-28" />)}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <Shimmer key={i} className="h-40" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-white">

      {/* ══ HEADER ══ */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Budget Center</h1>
          <p className="text-gray-500 mt-1 text-sm">Plan, track, and optimize your spending by category.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl
                     bg-gradient-to-r from-emerald-500 to-teal-600 text-sm font-semibold
                     shadow-lg shadow-emerald-500/20 hover:opacity-90 hover:-translate-y-0.5
                     transition-all duration-200 self-start sm:self-auto"
        >
          <FiPlus size={16} /> Add Budget
        </button>
      </motion.div>

      {/* ══ STAT CARDS ══ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Allocated", value: `₹${totalAllocated.toLocaleString("en-IN")}`, color: "text-cyan-400",    bg: "bg-cyan-500/5",    border: "border-cyan-500/20",    glow: "bg-cyan-400",    icon: <FiTarget size={17} /> },
          { label: "Total Spent",     value: `₹${totalSpent.toLocaleString("en-IN")}`,     color: "text-rose-400",   bg: "bg-rose-500/5",    border: "border-rose-500/20",    glow: "bg-rose-400",    icon: <FiTrendingDown size={17} /> },
          { label: "Remaining",       value: `₹${Math.abs(totalRemaining).toLocaleString("en-IN")}`,
            color: totalRemaining >= 0 ? "text-emerald-400" : "text-rose-400",
            bg: "bg-emerald-500/5", border: "border-emerald-500/20", glow: "bg-emerald-400",
            icon: <FiDollarSign size={17} /> },
          { label: "Over Budget",     value: overBudgetCount,
            color: overBudgetCount > 0 ? "text-amber-400" : "text-emerald-400",
            bg: overBudgetCount > 0 ? "bg-amber-500/5" : "bg-emerald-500/5",
            border: overBudgetCount > 0 ? "border-amber-500/20" : "border-emerald-500/20",
            glow: overBudgetCount > 0 ? "bg-amber-400" : "bg-emerald-400",
            icon: overBudgetCount > 0 ? <FiAlertTriangle size={17} /> : <FiCheckCircle size={17} /> },
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
              <p className={`text-lg sm:text-2xl font-bold tracking-tight ${card.color}`}>{card.value}</p>
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
                ? "bg-gradient-to-r from-emerald-500/20 to-teal-600/20 border border-emerald-500/30 text-emerald-400"
                : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
              }`}
          >
            {tab.icon}{tab.label}
          </button>
        ))}
      </div>

      {/* ══ TAB CONTENT ══ */}
      <AnimatePresence mode="wait">

        {/* ─── OVERVIEW ─── */}
        {activeTab === "overview" && (
          <motion.div key="overview"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            {summary.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-16 text-center rounded-2xl border border-white/8 bg-white/2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <FiTarget size={22} className="text-emerald-400" />
                </div>
                <p className="text-sm text-gray-500">No budgets set yet.</p>
                <button onClick={() => setIsModalOpen(true)} className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
                  + Create your first budget
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {summary.map((item, idx) => {
                  const pct = item.allocated > 0 ? Math.round((item.spent / item.allocated) * 100) : 0;
                  const statusColor = pct >= 90 ? "text-rose-400" : pct >= 70 ? "text-amber-400" : "text-emerald-400";
                  const statusBg    = pct >= 90 ? "bg-rose-500/10 border-rose-500/20" : pct >= 70 ? "bg-amber-500/10 border-amber-500/20" : "bg-emerald-500/10 border-emerald-500/20";
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.07 }}
                      whileHover={{ y: -2, transition: { duration: 0.2 } }}
                      className="rounded-2xl bg-[#0d0f14]/80 border border-white/10 backdrop-blur-sm p-5"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-sm font-semibold text-white">{item.category}</h3>
                          <p className="text-xs text-gray-500 mt-0.5">
                            ₹{item.spent.toLocaleString("en-IN")} of ₹{item.allocated.toLocaleString("en-IN")} used
                          </p>
                        </div>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${statusBg} ${statusColor}`}>
                          {pct}%
                        </span>
                      </div>
                      <BudgetProgress pct={pct} />
                      <div className="flex items-center justify-between mt-3 text-xs">
                        <span className="text-gray-600">Spent: <span className="text-rose-400 font-medium">₹{item.spent.toLocaleString("en-IN")}</span></span>
                        <span className={`font-medium ${item.remaining >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                          {item.remaining >= 0
                            ? `₹${item.remaining.toLocaleString("en-IN")} left`
                            : `₹${Math.abs(item.remaining).toLocaleString("en-IN")} over`}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* ─── ANALYTICS ─── */}
        {activeTab === "analytics" && (
          <motion.div key="analytics"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}
            className="grid grid-cols-1 xl:grid-cols-2 gap-5"
          >
            <div className="rounded-2xl bg-[#0d0f14]/80 border border-white/10 backdrop-blur-sm p-5">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-500/20 flex items-center justify-center">
                  <FiPieChart size={13} className="text-cyan-400" />
                </div>
                <h3 className="text-sm font-semibold text-white">Spending by Category</h3>
              </div>
              {summary.length === 0 ? (
                <div className="flex items-center justify-center h-48 text-gray-600 text-sm">No data yet</div>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={summary.map(s => ({ name: s.category, value: s.spent }))}
                        dataKey="value" outerRadius={85} innerRadius={45} paddingAngle={3}
                        label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                        labelLine={{ stroke: "#4B5563" }}>
                        {summary.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} strokeWidth={0} />)}
                      </Pie>
                      <Tooltip content={<ChartTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap gap-2 justify-center mt-2">
                    {summary.map((s, i) => (
                      <span key={i} className="flex items-center gap-1.5 text-xs text-gray-400">
                        <span className="w-2.5 h-2.5 rounded-sm" style={{ background: COLORS[i % COLORS.length] }} />
                        {s.category}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="rounded-2xl bg-[#0d0f14]/80 border border-white/10 backdrop-blur-sm p-5">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
                  <FiTarget size={13} className="text-emerald-400" />
                </div>
                <h3 className="text-sm font-semibold text-white">Allocated vs Spent</h3>
              </div>
              {summary.length === 0 ? (
                <div className="flex items-center justify-center h-48 text-gray-600 text-sm">No data yet</div>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={summary.map(s => ({ name: s.category, allocated: s.allocated, spent: s.spent }))} barSize={10}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="#374151" tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis stroke="#374151" tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                    <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                    <Legend wrapperStyle={{ fontSize: 12, color: "#9CA3AF", paddingTop: 12 }} />
                    <Bar dataKey="allocated" fill="#10b981" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="spent"     fill="#ef4444" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </motion.div>
        )}

        {/* ─── AI PLANNER ─── */}
        {activeTab === "ai planner" && (
          <motion.div key="ai planner"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}
            className="space-y-5"
          >
            <div className="rounded-2xl bg-[#0d0f14]/80 border border-blue-500/20 backdrop-blur-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-blue-500/15">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center">
                    <FiCpu size={14} className="text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-white">AI Budget Planner</h2>
                    <p className="text-xs text-gray-500 mt-0.5">Get a personalized budget plan based on your finances</p>
                  </div>
                </div>
                <button onClick={fetchBudgetPlan} disabled={loadingPlan}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                             bg-gradient-to-r from-blue-500 to-cyan-500 text-white
                             hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200
                             disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0
                             shadow-lg shadow-blue-500/20">
                  {loadingPlan
                    ? <><FiRefreshCw size={13} className="animate-spin" /> Analyzing...</>
                    : <><FiZap size={13} /> Generate Plan</>}
                </button>
              </div>
              {!budgetPlan && !loadingPlan && (
                <div className="flex flex-col items-center gap-3 py-12 text-center px-5">
                  <FiCpu size={28} className="text-gray-700" />
                  <p className="text-sm text-gray-500">Click "Generate Plan" to get AI-powered budget recommendations.</p>
                </div>
              )}
              {loadingPlan && (
                <div className="p-5 space-y-3">
                  {[1,2,3].map(i => <Shimmer key={i} className="h-12 rounded-xl" />)}
                </div>
              )}
            </div>

            {budgetPlan && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: "Income",   value: `₹${budgetPlan.snapshot.income}`,   color: "text-emerald-400", bg: "bg-emerald-500/5", border: "border-emerald-500/20", glow: "bg-emerald-400" },
                    { label: "Expenses", value: `₹${budgetPlan.snapshot.expenses}`, color: "text-rose-400",    bg: "bg-rose-500/5",    border: "border-rose-500/20",    glow: "bg-rose-400" },
                    { label: "Surplus",  value: `₹${budgetPlan.snapshot.surplus}`,  color: "text-cyan-400",   bg: "bg-cyan-500/5",    border: "border-cyan-500/20",    glow: "bg-cyan-400" },
                  ].map((s, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                      className={`relative overflow-hidden rounded-2xl border p-5 ${s.bg} ${s.border}`}>
                      <div className={`absolute -top-6 -right-6 w-16 h-16 rounded-full blur-2xl opacity-20 ${s.glow}`} />
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-widest mb-2">{s.label}</p>
                      <p className={`text-2xl font-bold tracking-tight ${s.color}`}>{s.value}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="rounded-2xl bg-[#0d0f14]/80 border border-white/10 backdrop-blur-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-white/8">
                    <h3 className="text-sm font-semibold text-white">Recommended Budget</h3>
                    <p className="text-xs text-gray-500 mt-0.5">AI-suggested allocations based on your income and spending</p>
                  </div>
                  <div className="divide-y divide-white/5">
                    {budgetPlan.budgetPlan.map((item, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                        className="flex items-center justify-between px-5 py-3.5 hover:bg-white/3 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/15 flex items-center justify-center">
                            <FiTarget size={12} className="text-cyan-400" />
                          </div>
                          <span className="text-sm text-gray-200">{item.category}</span>
                        </div>
                        <span className="text-sm font-bold text-cyan-400">₹{item.recommended}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl bg-[#0d0f14]/80 border border-emerald-500/20 backdrop-blur-sm p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
                      <FiZap size={13} className="text-emerald-400" />
                    </div>
                    <h3 className="text-sm font-semibold text-white">AI Suggestions</h3>
                  </div>
                  <ul className="space-y-3">
                    {budgetPlan.recommendations.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-gray-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 mt-1.5" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ─── MANAGE ─── */}
        {activeTab === "manage" && (
          <motion.div key="manage"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">{budgets.length} budgets configured</p>
              <button onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10 transition-all">
                <FiPlus size={14} /> Add
              </button>
            </div>
            {budgets.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-16 text-center rounded-2xl border border-white/8 bg-white/2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <FiTarget size={22} className="text-emerald-400" />
                </div>
                <p className="text-sm text-gray-500">No budgets yet.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {budgets.map((b, idx) => (
                  <motion.div key={b._id}
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06 }}
                    className="rounded-2xl bg-[#0d0f14]/80 border border-white/10 backdrop-blur-sm p-5 hover:border-white/20 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {typeof b.categoryID === "object" ? b.categoryID?.name : b.description || "Budget"}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{b.description || "No description"}</p>
                      </div>
                      <button onClick={() => { setSelectedBudget(b); setConfirmDeleteOpen(true); }}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:bg-rose-500/15 hover:text-rose-400 transition-all">
                        <FiTrash2 size={13} />
                      </button>
                    </div>
                    <p className="text-2xl font-bold text-emerald-400 mt-4">
                      ₹{Number(b.amount).toLocaleString("en-IN")}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ ADD BUDGET MODAL ══ */}
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
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
                      <FiTarget size={14} className="text-emerald-400" />
                    </div>
                    <Dialog.Title className="text-sm font-semibold text-white">Add New Budget</Dialog.Title>
                  </div>
                  <button onClick={() => setIsModalOpen(false)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all">
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
                <div className="px-6 py-5">
                  <form onSubmit={handleAddBudget} className="space-y-4">
                    <Field label="Category" icon={<FiTag size={14} />}>
                      <select value={newBudget.categoryID}
                        onChange={e => setNewBudget({ ...newBudget, categoryID: e.target.value })}
                        className={selectCls}>
                        <option value="">Select category</option>
                        {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                      </select>
                    </Field>
                    <Field label="Budget Amount (₹)" icon={<FiDollarSign size={14} />}>
                      <input type="number" placeholder="Enter amount"
                        value={newBudget.amount}
                        onChange={e => setNewBudget({ ...newBudget, amount: e.target.value })}
                        className={inputCls} />
                    </Field>
                    <Field label="Description (optional)" icon={<FiAlignLeft size={14} />}>
                      <input type="text" placeholder="e.g. Monthly groceries"
                        value={newBudget.description}
                        onChange={e => setNewBudget({ ...newBudget, description: e.target.value })}
                        className={inputCls} />
                    </Field>
                    <button type="submit" disabled={isSubmitting}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600
                                 font-semibold text-sm text-white shadow-lg shadow-emerald-500/20
                                 hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200
                                 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0
                                 flex items-center justify-center gap-2 mt-2">
                      {isSubmitting
                        ? <><FiRefreshCw size={13} className="animate-spin" /> Adding...</>
                        : <><FiPlus size={14} /> Add Budget</>}
                    </button>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* ══ DELETE CONFIRM MODAL ══ */}
      <Transition appear show={confirmDeleteOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setConfirmDeleteOpen(false)}>
          <Transition.Child as={Fragment}
            enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100"
            leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/70 backdrop-blur-md" />
          </Transition.Child>
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child as={Fragment}
              enter="ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
              leave="ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-sm rounded-2xl bg-[#0f1115] border border-white/12 shadow-2xl p-6 text-center">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/25 flex items-center justify-center mx-auto mb-4">
                  <FiTrash2 size={20} className="text-rose-400" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">Delete Budget?</h3>
                <p className="text-sm text-gray-500 mb-6">
                  This will permanently delete the budget for{" "}
                  <span className="text-white font-medium">
                    {selectedBudget && (
                      typeof selectedBudget.categoryID === "object"
                        ? selectedBudget.categoryID?.name
                        : selectedBudget.description || "this category"
                    )}
                  </span>. This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button onClick={() => { setConfirmDeleteOpen(false); setSelectedBudget(null); }}
                    className="flex-1 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm font-medium text-gray-300 hover:bg-white/10 transition-all">
                    Cancel
                  </button>
                  <button onClick={handleDeleteBudget} disabled={isDeleting}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 text-sm font-semibold text-white hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {isDeleting ? <><FiRefreshCw size={13} className="animate-spin" /> Deleting...</> : "Delete"}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

    </div>
  );
};