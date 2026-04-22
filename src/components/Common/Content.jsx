import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiTrendingUp, FiTrendingDown, FiPieChart, FiShield,
  FiBarChart2, FiRepeat, FiCheckCircle, FiArrowRight,
  FiDollarSign, FiTarget, FiZap, FiLock,
} from "react-icons/fi";

/* ── animation variant ── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

/* ── animated counter hook ── */
function useCounter(target, duration = 1400, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return value;
}

/* ── animated app window ── */
const AppWindow = () => {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const income = useCounter(72000, 1200, visible);
  const expenses = useCounter(49800, 1200, visible);
  const savings = useCounter(22200, 1200, visible);

  const fmt = (n) => "₹" + n.toLocaleString("en-IN");

  return (
    <div
      ref={ref}
      className="w-full max-w-md rounded-2xl bg-[var(--card)] border border-white/10
                 shadow-[0_24px_80px_rgba(6,182,212,0.10),0_20px_60px_rgba(0,0,0,0.7)]
                 overflow-hidden"
    >
      {/* Window chrome */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#181b22]">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
        </div>
        <p className="text-xs text-gray-400 font-medium">FinTrack · Overview</p>
        <span className="px-2 py-0.5 rounded-full text-[10px] bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
          Live
        </span>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">Current month</p>
            <p className="text-base font-semibold text-white mt-0.5">Financial Snapshot</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-500 uppercase tracking-wide">Net saved</p>
            <p className="text-sm font-bold text-cyan-400">{fmt(savings)}</p>
          </div>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Income", value: fmt(income), color: "text-emerald-400", bg: "bg-emerald-500/8 border-emerald-500/15", icon: <FiTrendingUp size={12} /> },
            { label: "Expenses", value: fmt(expenses), color: "text-rose-400", bg: "bg-rose-500/8 border-rose-500/15", icon: <FiTrendingDown size={12} /> },
            { label: "Savings", value: fmt(savings), color: "text-cyan-400", bg: "bg-cyan-500/8 border-cyan-500/15", icon: <FiPieChart size={12} /> },
          ].map((m, i) => (
            <div key={i} className={`rounded-xl border p-2.5 ${m.bg}`}>
              <div className={`flex items-center gap-1 ${m.color} mb-1`}>
                {m.icon}
                <p className="text-[10px] text-gray-400">{m.label}</p>
              </div>
              <p className={`text-xs font-bold ${m.color}`}>{m.value}</p>
            </div>
          ))}
        </div>

        {/* Budget progress bar */}
        <div className="rounded-xl bg-black/40 border border-white/8 p-3 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-gray-400 font-medium">Budget usage</span>
            <span className="text-amber-300 font-semibold">72%</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={visible ? { width: "72%" } : { width: 0 }}
              transition={{ duration: 1.1, delay: 0.3, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
            />
          </div>
        </div>

        {/* Recent highlights */}
        <div className="rounded-xl bg-black/40 border border-white/8 p-3 space-y-1.5">
          <p className="text-[10px] uppercase tracking-widest text-gray-500 font-medium mb-2">Recent highlights</p>
          {[
            { label: "Recurring bills", value: "5 active", color: "text-gray-100" },
            { label: "Tracked transactions", value: "120 this month", color: "text-gray-100" },
            { label: "Top category", value: "Food & Dining", color: "text-cyan-300" },
          ].map((row, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <span className="text-gray-400">{row.label}</span>
              <span className={`font-medium ${row.color}`}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ── feature cards data ── */
const features = [
  { icon: <FiBarChart2 size={20} />, title: "Unified overview", desc: "One dashboard for income, expenses, budgets and reports.", color: "text-cyan-400", glow: "group-hover:shadow-cyan-500/20" },
  { icon: <FiPieChart size={20} />, title: "Clean analytics", desc: "Visualize spending patterns with beautiful, simple charts.", color: "text-blue-400", glow: "group-hover:shadow-blue-500/20" },
  { icon: <FiTarget size={20} />, title: "Budget control", desc: "Set per-category limits and get alerts before overspending.", color: "text-amber-400", glow: "group-hover:shadow-amber-500/20" },
  { icon: <FiLock size={20} />, title: "Secure by design", desc: "Your financial data is stored safely and privately.", color: "text-emerald-400", glow: "group-hover:shadow-emerald-500/20" },
];

/* ── how it works steps ── */
const steps = [
  { icon: <FiZap size={22} />, step: "01", title: "Sign up in seconds", desc: "Create your free account — no credit card needed.", color: "from-cyan-500 to-blue-600" },
  { icon: <FiDollarSign size={22} />, step: "02", title: "Log income & expenses", desc: "Add transactions manually or let categories do the work.", color: "from-emerald-500 to-teal-600" },
  { icon: <FiBarChart2 size={22} />, step: "03", title: "Track & improve", desc: "Watch your reports, hit your budgets, and grow savings.", color: "from-violet-500 to-purple-600" },
];

/* ── feature sections data ── */
const featureSections = [
  {
    id: "income",
    icon: <FiTrendingUp size={22} />,
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
    accent: "border-l-emerald-500",
    title: "Income Management",
    desc: "Track salary, freelance payments, side hustles and more — all categorized and visible.",
    link: "/private/income",
    linkLabel: "Go to income",
    cards: [
      { label: "Sources", value: "Multiple", valueColor: "text-white", sub: "Separate salary, freelance, investments and more." },
      { label: "Trends", value: "Growth focused", valueColor: "text-emerald-400", sub: "Understand how your monthly income is evolving." },
    ],
  },
  {
    id: "expenses",
    icon: <FiTrendingDown size={22} />,
    iconColor: "text-rose-400",
    iconBg: "bg-rose-500/10 border-rose-500/20",
    accent: "border-l-rose-500",
    title: "Expense Tracking",
    desc: "Log everyday spending, categorize it, and see exactly where your money goes.",
    link: "/private/expenses",
    linkLabel: "Go to expenses",
    cards: [
      { label: "Categories", value: "Customizable", valueColor: "text-white", sub: "Group expenses by needs, wants, bills and more." },
      { label: "Awareness", value: "See patterns", valueColor: "text-rose-400", sub: "Spot recurring waste and cut unnecessary costs." },
    ],
  },
  {
    id: "budgets",
    icon: <FiTarget size={22} />,
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/10 border-amber-500/20",
    accent: "border-l-amber-500",
    title: "Budget Planning",
    desc: "Set realistic spending limits by category and stay on track with clear budget usage.",
    link: "/private/budget",
    linkLabel: "Go to budgets",
    cards: [
      { label: "Limits", value: "Per category", valueColor: "text-white", sub: "Keep groceries, bills, and fun under control." },
      { label: "Progress", value: "At-a-glance", valueColor: "text-amber-300", sub: "See how much budget remains before overspending." },
    ],
  },
  {
    id: "reports",
    icon: <FiPieChart size={22} />,
    iconColor: "text-cyan-400",
    iconBg: "bg-cyan-500/10 border-cyan-500/20",
    accent: "border-l-cyan-500",
    title: "Reports & Insights",
    desc: "Turn raw numbers into simple visuals, summaries, and long-term trends for better decisions.",
    link: "/private/reports",
    linkLabel: "Go to reports",
    cards: [
      { label: "Visuals", value: "Charts & summaries", valueColor: "text-white", sub: "Compare months, track categories, and see progress." },
      { label: "Clarity", value: "Big picture", valueColor: "text-cyan-400", sub: "Understand your financial story over time." },
    ],
  },
];

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
export const Content = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] pb-20 space-y-24">

      {/* ═══════════ HERO ═══════════ */}
      <section
        id="home"
        className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center pt-8 md:pt-12"
      >
        {/* Left: text */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5 }}
          className="space-y-6 text-center lg:text-left"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium">
            <FiZap size={11} />
            Personal Finance Dashboard
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.12] tracking-tight">
            See your{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-blue-500 bg-clip-text text-transparent">
              money clearly
            </span>{" "}
            in one place.
          </h1>

          <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0">
            FinTrack helps you track income, expenses, budgets and reports with
            a clean, focused interface — so you always know where your money goes.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center lg:items-start gap-3 pt-1">
            <Link
              to="/signup"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600
                         text-white font-semibold shadow-lg shadow-cyan-500/25
                         hover:opacity-90 hover:shadow-cyan-500/40 hover:-translate-y-0.5
                         transition-all duration-200 flex items-center justify-center gap-2"
            >
              Get Started Free
              <FiArrowRight size={16} />
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl border border-white/10 bg-white/5
                         text-white font-medium hover:bg-white/10 hover:border-white/20
                         transition-all duration-200 flex items-center justify-center gap-2"
            >
              Explore Features
            </a>
          </div>

          {/* Social proof pills */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-2">
            {[
              { icon: <FiCheckCircle size={13} />, text: "Free to use", color: "text-emerald-400" },
              { icon: <FiShield size={13} />, text: "Secure & private", color: "text-cyan-400" },
              { icon: <FiRepeat size={13} />, text: "Recurring tracking", color: "text-blue-400" },
            ].map((pill, i) => (
              <span key={i} className={`flex items-center gap-1.5 text-xs font-medium ${pill.color} bg-white/5 border border-white/8 px-3 py-1.5 rounded-full`}>
                {pill.icon}
                {pill.text}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Right: App window */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex justify-center lg:justify-end"
        >
          <AppWindow />
        </motion.div>
      </section>

      {/* ═══════════ FEATURES ═══════════ */}
      <section id="features" className="space-y-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center space-y-3"
        >
          <p className="text-xs font-medium tracking-widest uppercase text-cyan-500">Why FinTrack</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Everything you need to manage your money
          </h2>
          <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
            FinTrack combines income tracking, expense logging, budgeting and
            reporting into one simple, focused interface.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className={`group bg-[var(--card)] border border-white/8 rounded-2xl p-5
                          hover:border-white/20 hover:shadow-xl ${f.glow}
                          hover:-translate-y-1 transition-all duration-300 cursor-default`}
            >
              <div className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 ${f.color} group-hover:scale-110 transition-transform duration-300`}>
                {f.icon}
              </div>
              <h3 className={`font-semibold mb-2 text-sm md:text-base ${f.color}`}>
                {f.title}
              </h3>
              <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section className="space-y-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center space-y-3"
        >
          <p className="text-xs font-medium tracking-widest uppercase text-cyan-500">How it works</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Up and running in 3 steps</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Connector line (desktop only) */}
          <div className="hidden md:block absolute top-10 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-gradient-to-r from-cyan-500/30 via-emerald-500/30 to-violet-500/30" />

          {steps.map((s, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.12 }}
              className="relative bg-[var(--card)] border border-white/8 rounded-2xl p-6 text-center
                         hover:border-white/20 hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center mx-auto mb-4 shadow-lg text-white`}>
                {s.icon}
              </div>
              <p className="text-[10px] font-bold tracking-widest text-gray-600 uppercase mb-2">{s.step}</p>
              <h3 className="text-white font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════ FEATURE SECTIONS ═══════════ */}
      <section className="space-y-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center space-y-2"
        >
          <p className="text-xs font-medium tracking-widest uppercase text-cyan-500">Deep dive</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Built for every part of your finances</h2>
        </motion.div>

        <div className="space-y-6">
          {featureSections.map((sec, i) => (
            <motion.div
              key={sec.id}
              id={sec.id}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className={`bg-[var(--card)] border border-white/8 border-l-2 ${sec.accent}
                          rounded-2xl p-5 md:p-7
                          grid grid-cols-1 md:grid-cols-3 gap-6
                          hover:border-white/15 transition-all duration-300`}
            >
              {/* Left: info */}
              <div className="md:col-span-1 space-y-3">
                <div className={`w-11 h-11 rounded-xl border flex items-center justify-center ${sec.iconBg} ${sec.iconColor}`}>
                  {sec.icon}
                </div>
                <h3 className="text-lg font-semibold text-white">{sec.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{sec.desc}</p>
                <Link
                  to={sec.link}
                  className={`inline-flex items-center gap-1.5 mt-1 text-sm font-medium ${sec.iconColor} hover:opacity-80 transition-opacity`}
                >
                  {sec.linkLabel}
                  <FiArrowRight size={14} />
                </Link>
              </div>

              {/* Right: stat cards */}
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {sec.cards.map((card, j) => (
                  <div key={j} className="bg-black/30 border border-white/8 rounded-xl p-4 hover:border-white/15 transition-colors">
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">{card.label}</p>
                    <p className={`text-base font-bold mb-1.5 ${card.valueColor}`}>{card.value}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{card.sub}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════ CTA BANNER ═══════════ */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f2027] via-[#111827] to-[#0f1115]
                   border border-white/10 p-8 md:p-12 text-center"
      >
        {/* Glow orbs */}
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-cyan-500/8 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-blue-600/8 blur-3xl pointer-events-none" />

        <div className="relative space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium">
            <FiZap size={11} />
            Start for free today
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight">
            Take control of your{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              financial life
            </span>
          </h2>
          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Join thousands of users who already track their money smarter with FinTrack.
            It's free, fast, and built for clarity.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/signup"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600
                         text-white font-semibold shadow-lg shadow-cyan-500/30
                         hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200
                         flex items-center justify-center gap-2"
            >
              Create Free Account
              <FiArrowRight size={16} />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-white/10 bg-white/5
                         text-gray-200 font-medium hover:bg-white/10 transition-all duration-200
                         flex items-center justify-center"
            >
              Already have an account? Login
            </Link>
          </div>
        </div>
      </motion.section>

    </div>
  );
};