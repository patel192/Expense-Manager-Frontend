import React, { useEffect, useState, useRef, memo } from "react";
import ReactMarkdown from "react-markdown";
import axiosInstance from "../Utils/axiosInstance";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, Legend, ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import {
  FiTrendingUp, FiTrendingDown, FiTarget, FiZap,
  FiAlertTriangle, FiBarChart2, FiPieChart, FiRepeat,
  FiSend, FiCpu, FiCalendar, FiClock, FiRefreshCw,
  FiActivity, FiDollarSign, FiShield,
} from "react-icons/fi";

const COLORS = ["#06b6d4", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

/* ─── Shimmer — no animate-pulse, uses CSS only ─── */
const Shimmer = ({ className = "" }) => (
  <div className={`relative overflow-hidden bg-white/5 rounded-xl ${className}`}>
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite]
                    bg-gradient-to-r from-transparent via-white/8 to-transparent" />
  </div>
);

/* ─── Metric Card — static, no motion on mount ─── */
const MetricCard = memo(({ title, value, icon, color, bg, border }) => (
  <div className={`relative overflow-hidden rounded-2xl border p-5 ${bg} ${border} backdrop-blur-sm
                   hover:-translate-y-1 transition-transform duration-200 cursor-default`}>
    <div className={`absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-15
                     ${color === "text-cyan-400" ? "bg-cyan-400"
                     : color === "text-emerald-400" ? "bg-emerald-400"
                     : color === "text-rose-400" ? "bg-rose-400" : "bg-blue-400"}`} />
    <div className="relative">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${bg} border ${border}`}>
        <span className={color}>{icon}</span>
      </div>
      <p className="text-[11px] font-medium text-gray-500 uppercase tracking-widest mb-1">{title}</p>
      <p className={`text-2xl font-bold tracking-tight ${color}`}>
        ₹{value.toLocaleString("en-IN")}
      </p>
    </div>
  </div>
));

/* ─── AI Card header — static ─── */
const AICard = memo(({ title, icon, iconColor, iconBg, borderColor, accentColor, children }) => (
  <div className={`rounded-2xl bg-[#0d0f14]/80 border ${borderColor} backdrop-blur-sm overflow-hidden`}>
    <div className={`flex items-center gap-3 px-5 py-4 border-b ${borderColor}`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg}`}>
        <span className={iconColor}>{icon}</span>
      </div>
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <div className={`ml-auto w-1.5 h-1.5 rounded-full ${accentColor} animate-pulse`} />
    </div>
    <div className="p-5">{children}</div>
  </div>
));

/* ─── AI Trigger Button ─── */
const AIButton = ({ onClick, label, color }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                transition-colors duration-150 ${color}`}
  >
    <FiZap size={13} />{label}
  </button>
);

/* ─── AI Result ─── */
const AIResult = ({ content }) => (
  <div className="mt-3 rounded-xl bg-black/30 border border-white/8 p-4">
    <div className="prose prose-invert prose-sm max-w-none text-gray-300
                    prose-headings:text-white prose-headings:font-semibold
                    prose-li:text-gray-300 prose-p:leading-relaxed">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  </div>
);

/* ─── Chart Tooltip ─── */
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a1d26] border border-white/15 rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-base font-bold text-white">₹{payload[0].value?.toLocaleString("en-IN")}</p>
    </div>
  );
};

/* ─── Skeleton — fast, minimal DOM ─── */
const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Shimmer className="h-8 w-48" />
      <Shimmer className="h-4 w-64" />
    </div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[1,2,3,4].map(i => <Shimmer key={i} className="h-28" />)}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {[1,2,3,4].map(i => <Shimmer key={i} className="h-40" />)}
    </div>
  </div>
);

/* ════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════ */
export const UserDashboard = () => {
  const { user } = useAuth();
  const userId = user?._id;
  const chatEndRef = useRef(null);

  /* ── ALL ORIGINAL STATE — UNTOUCHED ── */
  const [loadingDashboard, setloadingDashboard] = useState(true);
  const [budget, setBudget]         = useState([]);
  const [income, setIncome]         = useState([]);
  const [expenses, setExpenses]     = useState([]);
  const [bills, setBills]           = useState([]);
  const [recurring, setRecurring]   = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [expenseInsights, setExpenseInsights]       = useState("");
  const [loadingInsights, setLoadingInsights]       = useState(false);
  const [forecast, setForecast]                     = useState("");
  const [loadingForecast, setLoadingForecast]       = useState(false);
  const [upcomingRecurring, setUpcomingRecurring]   = useState([]);
  const [savingOpportunities, setSavingOpportunities] = useState("");
  const [loadingSavings, setLoadingSavings]         = useState(false);
  const [healthScore, setHealthScore]               = useState("");
  const [loadingHealth, setLoadingHealth]           = useState(false);
  const [messages, setMessages]                     = useState([]);
  const [input, setInput]                           = useState("");
  const [loadingAI, setLoadingAI]                   = useState(false);
  const [riskData, setRiskData]                     = useState(null);
  const [loadingRisk, setLoadingRisk]               = useState(false);
  const [allInsights, setAllInsights]               = useState([]);
  const [loadingHistory, setLoadingHistory]         = useState(false);
  const [loadingCharts, setloadingCharts]           = useState(true);
  const [loadingSecondary, setloadingSecondary]     = useState(true);

  /* ── ALL ORIGINAL LOGIC — UNTOUCHED (except noted fixes) ── */
  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    try {
      setLoadingAI(true);
      const res = await axiosInstance.post("/ai/ask", { message: input });
      setMessages((prev) => [...prev, { role: "ai", text: res.data?.reply || "AI returned no response." }]);
    } catch (error) {
      console.error("AI chat error:", error);
      setMessages((prev) => [...prev, { role: "ai", text: "AI failed to respond." }]);
    } finally { setLoadingAI(false); }
  };

  const fetchUpcomingRecurring = async () => {
    try {
      const res = await axiosInstance.get(`/recurring/upcoming/${userId}`);
      setUpcomingRecurring(res.data.data || []);
    } catch (error) { console.error("Error fetching upcoming recurring", error); }
  };

  const fetchExpenseInsights = async () => {
    try { setLoadingInsights(true); const res = await axiosInstance.get(`/ai/expense-insights/${userId}`); setExpenseInsights(res.data.insights); }
    catch (err) { console.error("Insights Error", err); } finally { setLoadingInsights(false); }
  };
  const fetchForecast = async () => {
    try { setLoadingForecast(true); const res = await axiosInstance.get(`/ai/financial-forecast/${userId}`); setForecast(res.data.forecast); }
    catch (error) { console.error("Forecast error:", error); } finally { setLoadingForecast(false); }
  };
  const fetchSavingOpportunities = async () => {
    try { setLoadingSavings(true); const res = await axiosInstance.get(`/ai/saving-opportunities/${userId}`); setSavingOpportunities(res.data.opportunities); }
    catch (error) { console.error("Saving opportunities error:", error); } finally { setLoadingSavings(false); }
  };
  const fetchHealthScore = async () => {
    try { setLoadingHealth(true); const res = await axiosInstance.get(`/ai/financial-health/${userId}`); setHealthScore(res.data.healthScore); }
    catch (error) { console.error("Health score error:", error); } finally { setLoadingHealth(false); }
  };
  const fetchRisk = async () => {
    try { setLoadingRisk(true); const res = await axiosInstance.get(`/ai/spending-risk/${userId}`); setRiskData(res.data.risk); }
    catch (error) { console.error("Risk detection error:", error); } finally { setLoadingRisk(false); }
  };
  const fetchAllInsights = async () => {
    try { setLoadingHistory(true); const res = await axiosInstance.get(`/ai/insights/${userId}`); setAllInsights(res.data.insights); }
    catch (error) { console.error("Insight history error", error); } finally { setLoadingHistory(false); }
  };

  /* FIX 1: Added console.time to match console.timeEnd — was throwing a warning every load */
  useEffect(() => {
    if (!userId) return;
    const fetchCoreData = async () => {
      try {
        setloadingDashboard(true);
        console.time("Dashboard Load");
        const [budgetRes, incomeRes, expenseRes] = await Promise.all([
          axiosInstance.get(`/budgetsbyUserID/${userId}`),
          axiosInstance.get(`/incomesbyUserID/${userId}`),
          axiosInstance.get(`/expensesbyUserID/${userId}`),
        ]);
        console.timeEnd("Dashboard Load");
        setBudget(budgetRes.data.data || []);
        setIncome(incomeRes.data.data || []);
        setExpenses(expenseRes.data.data || []);
      } catch (err) { console.error("Error fetching core dashboard data:", err); }
      finally { setloadingDashboard(false); }
    };
    fetchCoreData();
  }, [userId]);

  /* FIX 2: Removed setTimeout(1000) — was artificially delaying secondary data by 1 full second */
  useEffect(() => {
    if (!userId) return;
    const fetchSecondaryData = async () => {
      try {
        setloadingSecondary(true);
        const [billsRes, recurringRes, txnRes] = await Promise.all([
          axiosInstance.get(`/billByuserId/${userId}`),
          axiosInstance.get(`/recurring/${userId}`),
          axiosInstance.get(`/transactionsByUserID/${userId}`),
        ]);
        setBills(billsRes.data.data || []);
        setRecurring(recurringRes.data.data || []);
        setTransactions(txnRes.data.data || []);
      } catch (err) { console.error("Error fetching secondary dashboard data:", err); }
      finally { setloadingSecondary(false); setloadingCharts(false); }
    };
    /* Run both in parallel immediately — no artificial delay */
    fetchSecondaryData();
    fetchUpcomingRecurring();
  }, [userId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const totalBudget   = (budget   || []).reduce((a, i) => a + i.amount, 0);
  const totalIncome   = (income   || []).reduce((a, i) => a + i.amount, 0);
  const totalExpenses = (expenses || []).reduce((a, e) => a + e.amount, 0);
  const netSavings    = totalIncome - totalExpenses;
  const savingsRate   = totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0;

  if (loadingDashboard) return <DashboardSkeleton />;

  const riskColors = {
    High:   { border: "border-rose-500/40",    bg: "bg-rose-500/8",    text: "text-rose-400",    badge: "bg-rose-500/20 text-rose-300" },
    Medium: { border: "border-amber-500/40",   bg: "bg-amber-500/8",   text: "text-amber-400",   badge: "bg-amber-500/20 text-amber-300" },
    Low:    { border: "border-emerald-500/40", bg: "bg-emerald-500/8", text: "text-emerald-400", badge: "bg-emerald-500/20 text-emerald-300" },
  };

  return (
    /* FIX 3: Single fade-in on the whole page instead of every card animating individually */
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="space-y-6 text-white pb-6"
    >

      {/* ══ HEADER ══ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Financial Overview</h1>
          <p className="text-sm text-gray-500 mt-1">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium self-start
          ${savingsRate >= 20 ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
          : savingsRate >= 0  ? "bg-amber-500/10 border-amber-500/25 text-amber-400"
          : "bg-rose-500/10 border-rose-500/25 text-rose-400"}`}>
          <FiActivity size={14} />
          Savings rate: {savingsRate}%
        </div>
      </div>

      {/* ══ METRIC CARDS — static, no mount animation ══ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Budget"   value={totalBudget}   icon={<FiTarget size={18} />}      color="text-cyan-400"   bg="bg-cyan-500/5"   border="border-cyan-500/20" />
        <MetricCard title="Total Income"   value={totalIncome}   icon={<FiTrendingUp size={18} />}  color="text-emerald-400" bg="bg-emerald-500/5" border="border-emerald-500/20" />
        <MetricCard title="Total Expenses" value={totalExpenses} icon={<FiTrendingDown size={18} />} color="text-rose-400"  bg="bg-rose-500/5"   border="border-rose-500/20" />
        {/* Net savings */}
        <div className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-blue-500/5 backdrop-blur-sm p-5
                        hover:-translate-y-1 transition-transform duration-200">
          <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-15 bg-blue-400" />
          <div className="relative">
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-blue-500/10 border border-blue-500/20">
                <FiDollarSign size={18} className="text-blue-400" />
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full
                ${netSavings >= 0 ? "bg-emerald-500/15 text-emerald-400" : "bg-rose-500/15 text-rose-400"}`}>
                {netSavings >= 0 ? "↑ Positive" : "↓ Deficit"}
              </span>
            </div>
            <p className="text-[11px] font-medium text-gray-500 uppercase tracking-widest mb-1">Net Savings</p>
            <p className={`text-2xl font-bold tracking-tight ${netSavings >= 0 ? "text-blue-400" : "text-rose-400"}`}>
              ₹{Math.abs(netSavings).toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </div>

      {/* ══ AI CARDS — static containers, content loads on demand ══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        <AICard title="AI Spending Risk Detector" icon={<FiAlertTriangle size={15} />}
          iconColor="text-rose-400" iconBg="bg-rose-500/15 border border-rose-500/20"
          borderColor="border-rose-500/20" accentColor="bg-rose-400">
          {loadingRisk ? (
            <div className="flex items-center gap-3 text-gray-400 text-sm"><FiRefreshCw size={14} className="animate-spin" />Analyzing your spending behavior...</div>
          ) : riskData ? (
            <div className={`rounded-xl p-4 border ${riskColors[riskData.riskLevel]?.border || "border-white/10"} ${riskColors[riskData.riskLevel]?.bg || "bg-white/5"}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-white">Risk Assessment</span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${riskColors[riskData.riskLevel]?.badge || "bg-white/10 text-white"}`}>{riskData.riskLevel} Risk</span>
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-gray-300"><span className="text-gray-500 font-medium">Category:</span> {riskData.category}</p>
                <p className="text-gray-300"><span className="text-gray-500 font-medium">Reason:</span> {riskData.reason}</p>
                <p className={`font-medium ${riskColors[riskData.riskLevel]?.text}`}>{riskData.suggestion}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-500">Evaluate your current spending for risk patterns and anomalies.</p>
              <AIButton onClick={fetchRisk} label="Analyze Risk" color="bg-rose-500/15 border border-rose-500/25 text-rose-300 hover:bg-rose-500/25" />
            </div>
          )}
        </AICard>

        <AICard title="AI Financial Health Score" icon={<FiShield size={15} />}
          iconColor="text-violet-400" iconBg="bg-violet-500/15 border border-violet-500/20"
          borderColor="border-violet-500/20" accentColor="bg-violet-400">
          {loadingHealth ? (
            <div className="flex items-center gap-3 text-gray-400 text-sm"><FiRefreshCw size={14} className="animate-spin" />Evaluating your financial health...</div>
          ) : healthScore ? <AIResult content={healthScore} /> : (
            <div className="space-y-3">
              <p className="text-sm text-gray-500">Get a comprehensive score based on your income, spending, and savings habits.</p>
              <AIButton onClick={fetchHealthScore} label="Calculate Score" color="bg-violet-500/15 border border-violet-500/25 text-violet-300 hover:bg-violet-500/25" />
            </div>
          )}
        </AICard>

        <AICard title="AI Financial Insights" icon={<FiBarChart2 size={15} />}
          iconColor="text-cyan-400" iconBg="bg-cyan-500/15 border border-cyan-500/20"
          borderColor="border-cyan-500/20" accentColor="bg-cyan-400">
          {loadingInsights ? (
            <div className="flex items-center gap-3 text-gray-400 text-sm"><FiRefreshCw size={14} className="animate-spin" />Analyzing your spending patterns...</div>
          ) : expenseInsights ? <AIResult content={expenseInsights} /> : (
            <div className="space-y-3">
              <p className="text-sm text-gray-500">Uncover hidden spending patterns and personalized financial insights.</p>
              <AIButton onClick={fetchExpenseInsights} label="Generate Insights" color="bg-cyan-500/15 border border-cyan-500/25 text-cyan-300 hover:bg-cyan-500/25" />
            </div>
          )}
        </AICard>

        <AICard title="AI Financial Forecast" icon={<FiTrendingUp size={15} />}
          iconColor="text-blue-400" iconBg="bg-blue-500/15 border border-blue-500/20"
          borderColor="border-blue-500/20" accentColor="bg-blue-400">
          {loadingForecast ? (
            <div className="flex items-center gap-3 text-gray-400 text-sm"><FiRefreshCw size={14} className="animate-spin" />Predicting your financial future...</div>
          ) : forecast ? <AIResult content={forecast} /> : (
            <div className="space-y-3">
              <p className="text-sm text-gray-500">See a projection of your financial trajectory based on current patterns.</p>
              <AIButton onClick={fetchForecast} label="Generate Forecast" color="bg-blue-500/15 border border-blue-500/25 text-blue-300 hover:bg-blue-500/25" />
            </div>
          )}
        </AICard>

        <AICard title="AI Saving Opportunities" icon={<FiDollarSign size={15} />}
          iconColor="text-emerald-400" iconBg="bg-emerald-500/15 border border-emerald-500/20"
          borderColor="border-emerald-500/20" accentColor="bg-emerald-400">
          {loadingSavings ? (
            <div className="flex items-center gap-3 text-gray-400 text-sm"><FiRefreshCw size={14} className="animate-spin" />Scanning for saving opportunities...</div>
          ) : savingOpportunities ? <AIResult content={savingOpportunities} /> : (
            <div className="space-y-3">
              <p className="text-sm text-gray-500">Discover where you can cut costs and boost your savings automatically.</p>
              <AIButton onClick={fetchSavingOpportunities} label="Analyze Savings" color="bg-emerald-500/15 border border-emerald-500/25 text-emerald-300 hover:bg-emerald-500/25" />
            </div>
          )}
        </AICard>

        {/* ── AI Chat ── */}
        <AICard title="AI Financial Assistant" icon={<FiCpu size={15} />}
          iconColor="text-amber-400" iconBg="bg-amber-500/15 border border-amber-500/20"
          borderColor="border-amber-500/20" accentColor="bg-amber-400">
          <div className="h-52 overflow-y-auto space-y-3 mb-3 pr-1">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
                <div className="w-10 h-10 rounded-full bg-amber-500/15 border border-amber-500/20 flex items-center justify-center">
                  <FiCpu size={18} className="text-amber-400" />
                </div>
                <p className="text-xs text-gray-500">Ask anything about your finances</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed
                  ${msg.role === "user"
                    ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-br-sm"
                    : "bg-white/8 border border-white/10 text-gray-200 rounded-bl-sm"}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loadingAI && (
              <div className="flex justify-start">
                <div className="bg-white/8 border border-white/10 px-4 py-2.5 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="flex gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask about your finances..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-black/30 border border-white/10
                         text-sm text-white placeholder-gray-600
                         focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/25
                         hover:border-white/20 transition-colors duration-150" />
            <button onClick={sendMessage} disabled={loadingAI || !input.trim()}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500
                         flex items-center justify-center text-white
                         hover:opacity-90 transition-opacity
                         disabled:opacity-40 disabled:cursor-not-allowed">
              <FiSend size={15} />
            </button>
          </div>
        </AICard>
      </div>

      {/* ══ CHARTS — only render when data is ready ══ */}
      {loadingCharts ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Shimmer className="h-72 rounded-2xl" />
          <Shimmer className="h-72 rounded-2xl" />
        </div>
      ) : (totalIncome > 0 || totalExpenses > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="rounded-2xl bg-[#0d0f14]/80 border border-white/10 backdrop-blur-sm p-5">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-lg bg-blue-500/15 border border-blue-500/20 flex items-center justify-center">
                <FiBarChart2 size={13} className="text-blue-400" />
              </div>
              <h3 className="text-sm font-semibold text-white">Income vs Expenses</h3>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={[{ name: "Income", amount: totalIncome }, { name: "Expenses", amount: totalExpenses }]} barSize={48}>
                <XAxis dataKey="name" stroke="#4B5563" tick={{ fill: "#9CA3AF", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#4B5563" tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                  <Cell fill="#10b981" />
                  <Cell fill="#ef4444" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {expenses.length > 0 && (
            <div className="rounded-2xl bg-[#0d0f14]/80 border border-white/10 backdrop-blur-sm p-5">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-500/20 flex items-center justify-center">
                  <FiPieChart size={13} className="text-cyan-400" />
                </div>
                <h3 className="text-sm font-semibold text-white">Expense Distribution</h3>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={expenses.map((e) => ({ name: e.categoryID?.name || "Other", value: e.amount }))}
                    dataKey="value" outerRadius={85} innerRadius={40} paddingAngle={3}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={{ stroke: "#4B5563" }}
                  >
                    {expenses.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} strokeWidth={0} />)}
                  </Pie>
                  <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ color: "#9CA3AF", fontSize: 12 }}>{v}</span>} />
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* ══ UPCOMING RECURRING ══ */}
      {!loadingSecondary && upcomingRecurring.length > 0 && (
        <div className="rounded-2xl bg-[#0d0f14]/80 border border-white/10 backdrop-blur-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/20 flex items-center justify-center">
              <FiRepeat size={13} className="text-amber-400" />
            </div>
            <h3 className="text-sm font-semibold text-white">Upcoming Recurring Payments</h3>
            <span className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20">
              {upcomingRecurring.length} due
            </span>
          </div>
          <div className="space-y-2">
            {upcomingRecurring.map((item) => (
              <div key={item._id} className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/4 border border-white/8 hover:border-white/15 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/20 flex items-center justify-center">
                    <FiCalendar size={13} className="text-amber-400" />
                  </div>
                  <span className="text-sm font-medium text-gray-200">{item.title}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-rose-400">₹{item.amount.toLocaleString("en-IN")}</span>
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <FiClock size={11} />
                    {new Date(item.nextDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ AI INSIGHT HISTORY ══ */}
      <div className="rounded-2xl bg-[#0d0f14]/80 border border-white/10 backdrop-blur-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-500/20 flex items-center justify-center">
              <FiCpu size={13} className="text-cyan-400" />
            </div>
            <h3 className="text-sm font-semibold text-white">AI Insight History</h3>
          </div>
          {allInsights.length === 0 && !loadingHistory && (
            <button onClick={fetchAllInsights} className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1">
              <FiRefreshCw size={12} /> Load history
            </button>
          )}
        </div>
        {loadingHistory ? (
          <div className="space-y-3">{[1,2].map(i => <Shimmer key={i} className="h-20 rounded-xl" />)}</div>
        ) : !allInsights || allInsights.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <FiCpu size={22} className="text-gray-700" />
            <p className="text-sm text-gray-600">No AI insights generated yet.</p>
            <p className="text-xs text-gray-700">Use the AI tools above to generate your first insight.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {allInsights.map((item) => (
              <div key={item._id} className="rounded-xl bg-white/4 border border-white/8 p-4 hover:border-white/15 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-cyan-400 capitalize px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/15">
                    {item.type.replace("-", " ")}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-600">
                    <FiClock size={10} />
                    {new Date(item.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
                <div className="prose prose-invert prose-sm max-w-none text-gray-400 prose-headings:text-white prose-strong:text-cyan-400 prose-li:text-gray-400">
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