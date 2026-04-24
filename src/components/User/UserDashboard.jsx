import { useEffect, useState, useRef, memo } from "react";
import ReactMarkdown from "react-markdown";
import axiosInstance from "../Utils/axiosInstance";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { fetchBudgetData } from "../../redux/budget/budgetSlice";
import { fetchIncomeData } from "../../redux/income/incomeSlice";
import { fetchAllExpenses } from "../../redux/expense/expenseSlice";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiTarget,
  FiZap,
  FiAlertTriangle,
  FiBarChart2,
  FiPieChart,
  FiRepeat,
  FiSend,
  FiCpu,
  FiCalendar,
  FiClock,
  FiRefreshCw,
  FiActivity,
  FiDollarSign,
  FiShield,
  FiInbox,
} from "react-icons/fi";
import LoadingSpinner from "../Common/LoadingSpinner";

const COLORS = ["#06b6d4", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

/* ─── Shimmer skeleton ─── */
const Shimmer = ({ className = "" }) => (
  <div className={`relative overflow-hidden bg-[var(--surface-tertiary)] rounded-xl ${className}`}>
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite]
                    bg-gradient-to-r from-transparent via-[var(--surface-primary)]/10 to-transparent" />
  </div>
);

/* ─── Metric Card ─── */
const MetricCard = memo(({ title, value, icon, color, bg, border, glow }) => (
  <div className={`relative overflow-hidden rounded-2xl border p-5 bg-[var(--surface-primary)] ${border} shadow-sm backdrop-blur-md group hover:-translate-y-1 transition-all duration-300`}>
    <div className={`absolute -top-10 -right-10 w-24 h-24 rounded-full blur-3xl opacity-10 ${glow} transition-opacity group-hover:opacity-20`} />
    <div className="relative">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${bg} border ${border} shadow-inner`}>
        <span className={color}>{icon}</span>
      </div>
      <p className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">{title}</p>
      <p className={`text-2xl font-black tracking-tight ${color}`}>₹{value.toLocaleString("en-IN")}</p>
    </div>
  </div>
));

/* ─── AI Card ─── */
const AICard = memo(({ title, icon, iconColor, iconBg, borderColor, accentColor, children, isLoading, onRefresh }) => (
  <div className={`rounded-[2rem] bg-[var(--surface-primary)] border ${borderColor} backdrop-blur-md overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl`}>
    <div className={`flex items-center justify-between px-6 py-5 border-b ${borderColor} bg-[var(--surface-secondary)]/30`}>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg} shadow-inner`}>
          <span className={iconColor}>{icon}</span>
        </div>
        <div>
          <h3 className="text-sm font-bold text-[var(--text-primary)]">{title}</h3>
          <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-0.5">Automated Intelligence</p>
        </div>
      </div>
      {onRefresh && (
        <button onClick={onRefresh} disabled={isLoading} className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-cyan-500 hover:bg-cyan-500/10 transition-all active:scale-95">
          <FiRefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
        </button>
      )}
    </div>
    <div className="p-6">{children}</div>
  </div>
));

/* ─── AI Button ─── */
const AIButton = ({ onClick, label, color, icon = <FiZap size={14} /> }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest
                transition-all duration-200 active:scale-95 shadow-lg shadow-cyan-500/10 ${color}`}
  >
    {icon}
    {label}
  </button>
);

/* ─── AI Result ─── */
const AIResult = ({ content }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    className="rounded-2xl bg-[var(--surface-tertiary)]/20 border border-[var(--border)] p-5 relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-[50px] pointer-events-none" />
    <div className="prose prose-invert prose-sm max-w-none text-[var(--text-secondary)] relative z-10
                    prose-headings:text-[var(--text-primary)] prose-headings:font-bold prose-headings:tracking-tight
                    prose-strong:text-cyan-500 prose-p:leading-relaxed prose-li:my-1">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  </motion.div>
);

/* ─── Tooltip ─── */
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[var(--surface-primary)] border border-[var(--border)] rounded-xl px-4 py-3 shadow-2xl backdrop-blur-md">
      <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">{label}</p>
      <p className="text-sm font-black text-[var(--text-primary)]">
        ₹{payload[0].value?.toLocaleString("en-IN")}
      </p>
    </div>
  );
};

/* ─── Dashboard Skeleton ─── */
const DashboardSkeleton = () => (
  <div className="space-y-8">
    <div className="flex justify-between items-end">
      <div className="space-y-3">
        <Shimmer className="h-10 w-64" />
        <Shimmer className="h-5 w-48" />
      </div>
      <Shimmer className="h-10 w-40 rounded-xl" />
    </div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => <Shimmer key={i} className="h-32" />)}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[1, 2, 3, 4].map((i) => <Shimmer key={i} className="h-56" />)}
    </div>
  </div>
);

export const UserDashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const userId = user?._id;
  const budget = useSelector((state) => state.budget.budgets);
  const loadingDashboard = useSelector((state) => state.budget.loading || state.income.loading || state.expense.loading);
  const income = useSelector((state) => state.income.incomes);
  const expenses = useSelector((state) => state.expense.expenses);
  const chatEndRef = useRef(null);

  const [bills, setBills] = useState([]);
  const [recurring, setRecurring] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [expenseInsights, setExpenseInsights] = useState("");
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [forecast, setForecast] = useState("");
  const [loadingForecast, setLoadingForecast] = useState(false);
  const [upcomingRecurring, setUpcomingRecurring] = useState([]);
  const [savingOpportunities, setSavingOpportunities] = useState("");
  const [loadingSavings, setLoadingSavings] = useState(false);
  const [healthScore, setHealthScore] = useState("");
  const [loadingHealth, setLoadingHealth] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [riskData, setRiskData] = useState(null);
  const [loadingRisk, setLoadingRisk] = useState(false);
  const [allInsights, setAllInsights] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingCharts, setloadingCharts] = useState(true);
  const [loadingSecondary, setloadingSecondary] = useState(true);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    try {
      setLoadingAI(true);
      const res = await axiosInstance.post("/ai/ask", { message: input });
      setMessages((prev) => [...prev, { role: "ai", text: res.data?.reply || "I encountered an error processing your request." }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "ai", text: "Communication failed. Please check your network." }]);
    } finally {
      setLoadingAI(false);
    }
  };

  const fetchUpcomingRecurring = async () => {
    try {
      const res = await axiosInstance.get(`/recurring/upcoming/${userId}`);
      setUpcomingRecurring(res.data.data || []);
    } catch (err) { console.error(err); }
  };

  const fetchExpenseInsights = async () => {
    try { setLoadingInsights(true); const res = await axiosInstance.get(`/ai/expense-insights/${userId}`, { skipGlobalLoader: true }); setExpenseInsights(res.data.insights); } finally { setLoadingInsights(false); }
  };
  const fetchForecast = async () => {
    try { setLoadingForecast(true); const res = await axiosInstance.get(`/ai/financial-forecast/${userId}`, { skipGlobalLoader: true }); setForecast(res.data.forecast); } finally { setLoadingForecast(false); }
  };
  const fetchSavingOpportunities = async () => {
    try { setLoadingSavings(true); const res = await axiosInstance.get(`/ai/saving-opportunities/${userId}`, { skipGlobalLoader: true }); setSavingOpportunities(res.data.opportunities); } finally { setLoadingSavings(false); }
  };
  const fetchHealthScore = async () => {
    try { setLoadingHealth(true); const res = await axiosInstance.get(`/ai/financial-health/${userId}`, { skipGlobalLoader: true }); setHealthScore(res.data.healthScore); } finally { setLoadingHealth(false); }
  };
  const fetchRisk = async () => {
    try { setLoadingRisk(true); const res = await axiosInstance.get(`/ai/spending-risk/${userId}`, { skipGlobalLoader: true }); setRiskData(res.data.risk); } finally { setLoadingRisk(false); }
  };
  const fetchAllInsights = async () => {
    try { setLoadingHistory(true); const res = await axiosInstance.get(`/ai/insights/${userId}`, { skipGlobalLoader: true }); setAllInsights(res.data.insights); } finally { setLoadingHistory(false); }
  };

  useEffect(() => {
    if (!userId) return;
    dispatch(fetchBudgetData(userId));
    dispatch(fetchIncomeData(userId));
    dispatch(fetchAllExpenses(userId));

    const fetchSecondaryData = async () => {
      try {
        setloadingSecondary(true);
        const [billsRes, recurringRes, txnRes] = await Promise.all([
          axiosInstance.get(`/billByuserId/${userId}`),
          axiosInstance.get(`/recurring/${userId}`),
          axiosInstance.get(`/transactionsByUserId/${userId}`),
        ]);
        setBills(billsRes.data.data || []);
        setRecurring(recurringRes.data.data || []);
        setTransactions(txnRes.data.data || []);
      } finally {
        setloadingSecondary(false);
        setloadingCharts(false);
      }
    };
    fetchSecondaryData();
    fetchUpcomingRecurring();
  }, [userId, dispatch]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const totalBudget = (budget || []).reduce((a, i) => a + i.amount, 0);
  const totalIncome = (income || []).reduce((a, i) => a + i.amount, 0);
  const totalExpenses = (expenses || []).reduce((a, e) => a + e.amount, 0);
  const netSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0;

  if (loadingDashboard) return <DashboardSkeleton />;

  const riskColors = {
    High: { border: "border-rose-500/30", bg: "bg-rose-500/5", text: "text-rose-500", badge: "bg-rose-500/10 text-rose-500" },
    Medium: { border: "border-amber-500/30", bg: "bg-amber-500/5", text: "text-amber-500", badge: "bg-amber-500/10 text-amber-500" },
    Low: { border: "border-emerald-500/30", bg: "bg-emerald-500/5", text: "text-emerald-500", badge: "bg-emerald-500/10 text-emerald-500" },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 text-[var(--text-primary)] pb-10"
    >
      {/* ══ HEADER ══ */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)] bg-clip-text text-transparent">
            Intelligence Hub
          </h1>
          <p className="text-sm font-bold text-[var(--text-muted)] mt-1 uppercase tracking-widest">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl border text-xs font-black uppercase tracking-widest shadow-lg transition-colors
          ${savingsRate >= 20 ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : savingsRate >= 0 ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-rose-500/10 border-rose-500/20 text-rose-500"}`}>
          <FiActivity size={14} />
          EFFICIENCY: {savingsRate}%
        </div>
      </div>

      {/* ══ METRIC CARDS ══ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Budget" value={totalBudget} icon={<FiTarget size={18} />} color="text-cyan-500" bg="bg-cyan-500/10" border="border-cyan-500/20" glow="bg-cyan-500" />
        <MetricCard title="Total Income" value={totalIncome} icon={<FiTrendingUp size={18} />} color="text-emerald-500" bg="bg-emerald-500/10" border="border-emerald-500/20" glow="bg-emerald-500" />
        <MetricCard title="Total Expenses" value={totalExpenses} icon={<FiTrendingDown size={18} />} color="text-rose-500" bg="bg-rose-500/10" border="border-rose-500/20" glow="bg-rose-500" />
        <div className={`relative overflow-hidden rounded-2xl border ${netSavings >= 0 ? "border-blue-500/20 bg-blue-500/5" : "border-rose-500/20 bg-rose-500/5"} backdrop-blur-md p-5 shadow-inner transition-all duration-300 hover:-translate-y-1`}>
          <div className={`absolute -top-10 -right-10 w-24 h-24 rounded-full blur-3xl opacity-10 ${netSavings >= 0 ? "bg-blue-500" : "bg-rose-500"}`} />
          <div className="relative">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-inner ${netSavings >= 0 ? "bg-blue-500/10 border-blue-500/20" : "bg-rose-500/10 border-rose-500/20"}`}>
                <FiDollarSign size={18} className={netSavings >= 0 ? "text-blue-500" : "text-rose-500"} />
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${netSavings >= 0 ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-rose-500/10 border-rose-500/20 text-rose-500"}`}>
                {netSavings >= 0 ? "↑ Surplus" : "↓ Deficit"}
              </span>
            </div>
            <p className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">Liquidity Position</p>
            <p className={`text-2xl font-black tracking-tight ${netSavings >= 0 ? "text-blue-500" : "text-rose-500"}`}>₹{Math.abs(netSavings).toLocaleString("en-IN")}</p>
          </div>
        </div>
      </div>

      {/* ══ AI ENGINE ══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AICard title="Spending Risk Analysis" icon={<FiAlertTriangle size={15} />} iconColor="text-rose-500" iconBg="bg-rose-500/10 border border-rose-500/20" borderColor="border-rose-500/20" accentColor="bg-rose-500" isLoading={loadingRisk} onRefresh={fetchRisk}>
          {loadingRisk ? (
            <LoadingSpinner color="text-rose-500" label="Scanning transactions..." className="py-6" />
          ) : riskData ? (
            <div className={`rounded-[1.5rem] p-5 border ${riskColors[riskData.riskLevel]?.border} ${riskColors[riskData.riskLevel]?.bg} shadow-inner`}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-primary)]">Behavior Assessment</span>
                <span className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-tighter ${riskColors[riskData.riskLevel]?.badge}`}>
                  {riskData.riskLevel} Criticality
                </span>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Observation Category</p>
                  <p className="text-sm font-bold text-[var(--text-secondary)]">{riskData.category}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Detective Logic</p>
                  <p className="text-xs font-medium text-[var(--text-secondary)] leading-relaxed">{riskData.reason}</p>
                </div>
                <div className="pt-2 border-t border-[var(--border)]">
                  <p className={`text-xs font-bold ${riskColors[riskData.riskLevel]?.text}`}>✨ {riskData.suggestion}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-4 text-center">
              <p className="text-xs font-medium text-[var(--text-muted)] mb-5 max-w-[80%]">Run the advanced risk engine to detect anomalies in your spending patterns.</p>
              <AIButton onClick={fetchRisk} label="Initiate Scan" color="bg-rose-500 text-white hover:bg-rose-600" />
            </div>
          )}
        </AICard>

        <AICard title="Financial Health Quotient" icon={<FiShield size={16} />} iconColor="text-violet-500" iconBg="bg-violet-500/10 border border-violet-500/20" borderColor="border-violet-500/20" accentColor="bg-violet-500" isLoading={loadingHealth} onRefresh={fetchHealthScore}>
          {loadingHealth ? (
            <LoadingSpinner color="text-violet-500" label="Calculating metrics..." className="py-6" />
          ) : healthScore ? (
            <AIResult content={healthScore} />
          ) : (
            <div className="flex flex-col items-center justify-center py-4 text-center">
              <p className="text-xs font-medium text-[var(--text-muted)] mb-5 max-w-[80%]">Audit your wealth efficiency based on income vs outcome ratios.</p>
              <AIButton onClick={fetchHealthScore} label="Compute Quotient" color="bg-violet-500 text-white hover:bg-violet-600" icon={<FiShield size={14} />} />
            </div>
          )}
        </AICard>

        <AICard title="Structural Insights" icon={<FiBarChart2 size={16} />} iconColor="text-cyan-500" iconBg="bg-cyan-500/10 border border-cyan-500/20" borderColor="border-cyan-500/20" accentColor="bg-cyan-500" isLoading={loadingInsights} onRefresh={fetchExpenseInsights}>
          {loadingInsights ? (
             <LoadingSpinner color="text-cyan-500" label="Extracting patterns..." className="py-6" />
          ) : expenseInsights ? (
            <AIResult content={expenseInsights} />
          ) : (
            <div className="flex flex-col items-center justify-center py-4 text-center">
              <p className="text-xs font-medium text-[var(--text-muted)] mb-5 max-w-[80%]">Uncover hidden correlations and structural flaws in your financial data.</p>
              <AIButton onClick={fetchExpenseInsights} label="Uncover Insights" color="bg-cyan-500 text-white hover:bg-cyan-600" />
            </div>
          )}
        </AICard>

        <AICard title="AI Predictive Projection" icon={<FiTrendingUp size={16} />} iconColor="text-blue-500" iconBg="bg-blue-500/10 border border-blue-500/20" borderColor="border-blue-500/20" accentColor="bg-blue-400" isLoading={loadingForecast} onRefresh={fetchForecast}>
          {loadingForecast ? (
            <LoadingSpinner color="text-blue-500" label="Modeling future..." className="py-6" />
          ) : forecast ? (
            <AIResult content={forecast} />
          ) : (
            <div className="flex flex-col items-center justify-center py-4 text-center">
              <p className="text-xs font-medium text-[var(--text-muted)] mb-5 max-w-[80%]">Generate a 3-month trajectory forecast using machine learning models.</p>
              <AIButton onClick={fetchForecast} label="Render Forecast" color="bg-blue-500 text-white hover:bg-blue-600" />
            </div>
          )}
        </AICard>

        <AICard title="Optimization Protocol" icon={<FiZap size={16} />} iconColor="text-emerald-500" iconBg="bg-emerald-500/10 border border-emerald-500/20" borderColor="border-emerald-500/20" accentColor="bg-emerald-500" isLoading={loadingSavings} onRefresh={fetchSavingOpportunities}>
          {loadingSavings ? (
            <LoadingSpinner color="text-emerald-500" label="Optimizing surplus..." className="py-6" />
          ) : savingOpportunities ? (
            <AIResult content={savingOpportunities} />
          ) : (
            <div className="flex flex-col items-center justify-center py-4 text-center">
              <p className="text-xs font-medium text-[var(--text-muted)] mb-5 max-w-[80%]">Identify specific budget optimizations to maximize your monthly net surplus.</p>
              <AIButton onClick={fetchSavingOpportunities} label="Run Optimization" color="bg-emerald-500 text-white hover:bg-emerald-600" />
            </div>
          )}
        </AICard>

        {/* ── AI Chat Assistant ── */}
        <AICard title="Cognitive Assistant" icon={<FiCpu size={16} />} iconColor="text-amber-500" iconBg="bg-amber-500/10 border border-amber-500/20" borderColor="border-amber-500/20" accentColor="bg-amber-500">
          <div className="h-64 overflow-y-auto space-y-4 mb-5 pr-2 custom-scrollbar">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-center opacity-60">
                <div className="w-12 h-12 rounded-2xl bg-[var(--surface-secondary)] border border-[var(--border)] flex items-center justify-center shadow-lg">
                  <FiInbox size={24} className="text-[var(--text-muted)]" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Awaiting telemetry...</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-xs font-medium leading-relaxed shadow-lg
                  ${msg.role === "user" 
                    ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-br-sm" 
                    : "bg-[var(--surface-secondary)] border border-[var(--border)] text-[var(--text-primary)] rounded-bl-sm"}`}>
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            ))}
            {loadingAI && (
              <div className="flex justify-start">
                <div className="bg-[var(--surface-secondary)] border border-[var(--border)] px-4 py-3 rounded-2xl rounded-bl-sm shadow-inner flex gap-1.5 items-center">
                  {[0, 150, 300].map(delay => (
                    <span key={delay} className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: `${delay}ms` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Query financial state..."
              className="flex-1 px-5 py-3 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border)]
                         text-xs font-bold text-[var(--text-primary)] placeholder-[var(--text-muted)]
                         focus:outline-none focus:ring-4 focus:ring-amber-500/10 hover:border-[var(--text-muted)] transition-all shadow-inner"
            />
            <button
              onClick={sendMessage}
              disabled={loadingAI || !input.trim()}
              className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600
                         flex items-center justify-center text-white shadow-xl shadow-amber-500/20
                         hover:opacity-90 active:scale-95 disabled:opacity-40"
            >
              <FiSend size={16} />
            </button>
          </div>
        </AICard>
      </div>

      {/* ══ VISUAL ANALYTICS ══ */}
      {loadingCharts ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Shimmer className="h-80 rounded-[2rem]" />
          <Shimmer className="h-80 rounded-[2rem]" />
        </div>
      ) : (
        (totalIncome > 0 || totalExpenses > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-[2.5rem] bg-[var(--surface-primary)] border border-[var(--border)] p-8 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-48 h-48 bg-blue-500/5 blur-[80px]" />
              <div className="flex items-center gap-3 mb-8 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shadow-inner">
                  <FiBarChart2 size={16} className="text-blue-500" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">Cash Equilibrium</h3>
                  <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Aggregate Flow Comparison</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={[{ name: "INFLOW", amount: totalIncome }, { name: "OUTFLOW", amount: totalExpenses }]} barSize={52}>
                  <XAxis dataKey="name" stroke="var(--border)" tick={{ fill: "var(--text-muted)", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em" }} axisLine={false} tickLine={false} />
                  <YAxis stroke="var(--border)" tick={{ fill: "var(--text-muted)", fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--surface-tertiary)", opacity: 0.1 }} />
                  <Bar dataKey="amount" radius={[12, 12, 0, 0]}>
                    <Cell fill="#10b981" />
                    <Cell fill="#f43f5e" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {expenses.length > 0 && (
              <div className="rounded-[2.5rem] bg-[var(--surface-primary)] border border-[var(--border)] p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 blur-[80px]" />
                <div className="flex items-center gap-3 mb-8 relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shadow-inner">
                    <FiPieChart size={16} className="text-cyan-500" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[var(--text-primary)]">Disbursement Profile</h3>
                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Sector Allocation</p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={expenses.map(e => ({ name: e.categoryID?.name || "Other", value: e.amount }))} dataKey="value" outerRadius={90} innerRadius={55} paddingAngle={4} stroke="none">
                      {expenses.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Legend iconType="circle" iconSize={6} wrapperStyle={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", paddingTop: 20 }} />
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )
      )}

      {/* ══ RECURRING OPERATIONS ══ */}
      {!loadingSecondary && upcomingRecurring.length > 0 && (
        <div className="rounded-[2.5rem] bg-[var(--surface-primary)] border border-[var(--border)] p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[100px] pointer-events-none" />
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shadow-inner">
                <FiRepeat size={16} className="text-amber-500" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--text-primary)]">Pending Executions</h3>
                <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Upcoming Automated Events</p>
              </div>
            </div>
            <span className="text-[10px] font-black text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20 uppercase tracking-[0.2em]">
              {upcomingRecurring.length} SCHEDULED
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 relative z-10">
            {upcomingRecurring.map((item) => (
              <div key={item._id} className="flex items-center justify-between px-5 py-4 rounded-3xl bg-[var(--surface-secondary)]/30 border border-[var(--border)] hover:bg-[var(--surface-tertiary)]/20 transition-all border-dashed">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-[var(--surface-primary)] border border-[var(--border)] flex items-center justify-center shadow-lg">
                    <FiCalendar size={14} className="text-amber-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-tight truncate max-w-[120px]">{item.title}</p>
                    <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest flex items-center gap-1.5 mt-1">
                      <FiClock size={10} />
                      {new Date(item.nextDate).toLocaleDateString("en-IN", { day: "numeric", month: "long" })}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-black text-rose-500">₹{item.amount.toLocaleString("en-IN")}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ CHRONOLOGICAL INSIGHTS ══ */}
      <div className="rounded-[2.5rem] bg-[var(--surface-primary)] border border-[var(--border)] p-8 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-8 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shadow-inner">
              <FiCpu size={16} className="text-cyan-500" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">Intelligence Log</h3>
              <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Historical Telemetry</p>
            </div>
          </div>
          {allInsights.length === 0 && !loadingHistory && (
            <button onClick={fetchAllInsights} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-black text-cyan-500 uppercase tracking-widest hover:bg-cyan-500/20 transition-all active:scale-95">
              <FiRefreshCw size={12} /> SYNC LOGS
            </button>
          )}
        </div>
        
        {loadingHistory ? (
          <div className="space-y-4">
            {[1, 2].map(i => <Shimmer key={i} className="h-24 rounded-3xl" />)}
          </div>
        ) : !allInsights || allInsights.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center rounded-[2rem] bg-[var(--surface-secondary)]/10 border border-dashed border-[var(--border)]">
            <FiInbox size={32} className="text-[var(--text-muted)] opacity-20" />
            <div className="space-y-1">
              <p className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-widest leading-loose">No active telemetry available</p>
              <p className="text-[10px] font-medium text-[var(--text-muted)] max-w-[240px] mx-auto">Trigger AI modules to populate your historical intelligence ledger.</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 relative z-10">
            {allInsights.map((item) => (
              <div key={item._id} className="rounded-3xl bg-[var(--surface-secondary)]/30 border border-[var(--border)] p-6 hover:shadow-xl transition-all group border-dashed">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-[var(--border)] border-dashed">
                  <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.2em] bg-cyan-500/10 px-3 py-1.5 rounded-lg border border-cyan-500/20">
                    {item.type?.replace("-", " ")}
                  </span>
                  <div className="flex items-center gap-2 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest bg-[var(--surface-primary)] px-2.5 py-1.5 rounded-lg border border-[var(--border)]">
                    <FiClock size={10} className="text-cyan-500" />
                    {new Date(item.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </div>
                </div>
                <div className="prose prose-invert prose-sm max-w-none text-[var(--text-secondary)] prose-headings:text-[var(--text-primary)] prose-strong:text-cyan-500 prose-p:leading-relaxed">
                  <ReactMarkdown>{item.content}</ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

