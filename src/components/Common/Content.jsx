import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiPieChart,
  FiShield,
  FiBarChart2,
  FiRepeat,
  FiCheckCircle,
  FiArrowRight,
  FiDollarSign,
  FiTarget,
  FiZap,
  FiLock,
  FiCpu,
  FiGlobe,
  FiArrowUpRight,
} from "react-icons/fi";
import { DashboardPreviewTabs } from "../landing/DashboardPreviewTabs";
import { StatsRow } from "../landing/StatsRow";
import { ActivityFeed } from "../landing/ActivityFeed";
import { IntegrationsGrid } from "../landing/IntegrationsGrid";
import { Testimonials } from "../landing/Testimonials";
import { PricingPlans } from "../landing/PricingPlans";
import { FAQSection } from "../landing/FAQSection";
import { DevBackground } from "../landing/DevBackground";

/* ── animation variant ── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
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
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const income = useCounter(72450, 1200, visible);
  const expenses = useCounter(49820, 1200, visible);
  const savings = useCounter(22630, 1200, visible);

  const fmt = (n) => "₹" + n.toLocaleString("en-IN");

  return (
    <div
      ref={ref}
      className="relative w-full max-w-lg rounded-2xl bg-[var(--card)] border border-[var(--border)]
                 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]
                 overflow-hidden group"
    >
      {/* Decorative pulse */}
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      {/* Window chrome */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border)] bg-[var(--surface-secondary)]/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500/30 border border-rose-500/50" />
          <span className="w-3 h-3 rounded-full bg-amber-500/30 border border-amber-500/50" />
          <span className="w-3 h-3 rounded-full bg-emerald-500/30 border border-emerald-500/50" />
        </div>
        <p className="text-[10px] text-[var(--text-muted)] font-mono uppercase tracking-widest flex items-center gap-2">
          <FiGlobe size={10} className="text-cyan-500" />
          fintrack.io/live-dash
        </p>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">Sync</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 space-y-5 relative">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] font-bold">
              Runtime Analytics
            </p>
            <p className="text-lg font-bold text-[var(--text-primary)] mt-1">
              Financial Status
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest">
              Net Delta
            </p>
            <p className="text-base font-bold text-cyan-500">{fmt(savings)}</p>
          </div>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "Inflow",
              value: fmt(income),
              color: "text-emerald-500",
              bg: "bg-emerald-500/5 border-emerald-500/10",
              icon: <FiTrendingUp size={12} />,
            },
            {
              label: "Outflow",
              value: fmt(expenses),
              color: "text-rose-500",
              bg: "bg-rose-500/5 border-rose-500/10",
              icon: <FiTrendingDown size={12} />,
            },
            {
              label: "Liquidity",
              value: fmt(savings),
              color: "text-cyan-500",
              bg: "bg-cyan-500/5 border-cyan-500/10",
              icon: <FiPieChart size={12} />,
            },
          ].map((m, i) => (
            <div key={i} className={`rounded-xl border p-3 ${m.bg}`}>
              <div className={`flex items-center gap-1.5 ${m.color} mb-1.5`}>
                {m.icon}
                <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">{m.label}</p>
              </div>
              <p className={`text-xs font-bold ${m.color}`}>{m.value}</p>
            </div>
          ))}
        </div>

        {/* System Load / Budget */}
        <div className="rounded-xl bg-[var(--surface-secondary)]/50 border border-[var(--border)] p-4 space-y-3">
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="text-[var(--text-muted)] uppercase">Budget Utilization</span>
            <span className="text-amber-500 font-bold">72.4%</span>
          </div>
          <div className="h-1.5 rounded-full bg-[var(--border)] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={visible ? { width: "72.4%" } : { width: 0 }}
              transition={{ duration: 1.5, ease: "circOut" }}
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500"
            />
          </div>
          <div className="flex justify-between items-center text-[9px] text-[var(--text-muted)] font-mono uppercase tracking-tighter">
            <span>Critical: 85%</span>
            <span>Warn: 60%</span>
            <span>Safe: 40%</span>
          </div>
        </div>

        {/* Activity log */}
        <div className="space-y-2">
           <div className="flex items-center gap-2 mb-3">
             <FiActivity size={12} className="text-cyan-500" />
             <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] font-bold">Event Log</p>
           </div>
          {[
            { label: "Stripe Webhook", status: "Success", time: "2m ago" },
            { label: "AWS Lambda / Calc", status: "Active", time: "Now" },
            { label: "DB Migration", status: "Stable", time: "1h ago" },
          ].map((row, i) => (
            <div key={i} className="flex items-center justify-between text-[11px] font-mono py-1 border-b border-[var(--border)]/50 last:border-0">
              <span className="text-[var(--text-secondary)]">{row.label}</span>
              <div className="flex items-center gap-3">
                <span className="text-cyan-500 opacity-60">{row.time}</span>
                <span className="text-emerald-500 font-bold tracking-tighter">{row.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ── feature cards data ── */
const features = [
  {
    icon: <FiCpu size={20} />,
    title: "High Precision",
    desc: "Every transaction is tracked with 100% accuracy and millisecond latency.",
    color: "text-cyan-500",
    glow: "group-hover:shadow-cyan-500/10",
  },
  {
    icon: <FiBarChart2 size={20} />,
    title: "Deep Insights",
    desc: "AI-driven patterns to help you optimize your spending architecture.",
    color: "text-blue-500",
    glow: "group-hover:shadow-blue-500/10",
  },
  {
    icon: <FiTarget size={20} />,
    title: "Threshold Alerts",
    desc: "Set real-time alerts for when budgets exceed defined parameters.",
    color: "text-indigo-500",
    glow: "group-hover:shadow-indigo-500/10",
  },
  {
    icon: <FiShield size={20} />,
    title: "End-to-End Secure",
    desc: "Encryption-at-rest and in-transit for all your financial sensitive data.",
    color: "text-violet-500",
    glow: "group-hover:shadow-violet-500/10",
  },
];

/* ── MAIN COMPONENT ── */
export const Content = () => {
  return (
    <DevBackground>
      <div className="max-w-7xl mx-auto px-6 pb-24 space-y-32">
        {/* ═══════════ HERO ═══════════ */}
        <section
          id="home"
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center pt-24 md:pt-32"
        >
          {/* Left: text */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="space-y-8 text-center lg:text-left"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/5 border border-cyan-500/10 text-cyan-500 text-[10px] font-bold uppercase tracking-widest">
              <FiZap size={11} className="animate-pulse" />
              v2.0 Finance Engine
            </div>

            <h1 className="text-5xl md:text-8xl font-bold tracking-tight leading-[0.95] text-[var(--text-primary)]">
              Manage money <br />
              <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
                like a pro.
              </span>
            </h1>

            <p className="text-[var(--text-secondary)] text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0">
              FinTrack is the high-performance dashboard for engineers of their own finances. 
              Track, analyze, and optimize your wealth with technical precision.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4 pt-2">
              <Link
                to="/signup"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[var(--text-primary)] text-[var(--card)] font-bold
                           hover:opacity-90 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Initialize Account
                <FiArrowRight size={18} />
              </Link>
              <a
                href="#features"
                className="w-full sm:w-auto px-8 py-4 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)]/50
                           text-[var(--text-primary)] font-bold hover:bg-[var(--surface-secondary)] transition-all duration-300
                           flex items-center justify-center gap-2"
              >
                System Specs
              </a>
            </div>

            {/* Tech Stack Icons / Proof */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
               <div className="flex items-center gap-2 text-xs font-mono font-bold">
                 <FiCheckCircle className="text-cyan-500" /> AES-256
               </div>
               <div className="flex items-center gap-2 text-xs font-mono font-bold">
                 <FiCheckCircle className="text-cyan-500" /> SOC2
               </div>
               <div className="flex items-center gap-2 text-xs font-mono font-bold">
                 <FiCheckCircle className="text-cyan-500" /> PCI-DSS
               </div>
            </div>
          </motion.div>

          {/* Right: App window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "circOut" }}
            className="flex justify-center lg:justify-end perspective-1000"
          >
            <div className="transform-gpu rotate-y-[-5deg] rotate-x-[5deg] hover:rotate-0 transition-transform duration-700">
              <AppWindow />
            </div>
          </motion.div>
        </section>

        {/* ═══════════ FEATURES ═══════════ */}
        <section id="features" className="space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-[var(--text-primary)] tracking-tight">
              Powerful <span className="text-cyan-500">Infrastructure</span>
            </h2>
            <p className="text-[var(--text-secondary)] max-w-2xl mx-auto text-base">
              Built with a focus on speed, privacy, and actionable intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="group relative bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 hover:border-cyan-500/50 transition-all duration-500"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                <div className={`w-12 h-12 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border)] flex items-center justify-center mb-6 ${f.color} group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm`}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-lg mb-3 text-[var(--text-primary)]">{f.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{f.desc}</p>
                <div className="mt-6 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  Read Documentation <FiArrowUpRight size={14} />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Preview Tabs */}
        <DashboardPreviewTabs />

        {/* Activity & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
           <div className="lg:col-span-1">
             <ActivityFeed />
           </div>
           <div className="lg:col-span-2">
             <StatsRow />
           </div>
        </div>

        {/* Testimonials & Pricing */}
        <Testimonials />
        <PricingPlans />

        {/* ═══════════ CTA ═══════════ */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="relative overflow-hidden rounded-[2.5rem] bg-[var(--text-primary)] p-12 md:p-20 text-center"
        >
           {/* Background Mesh */}
           <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, var(--border) 1px, transparent 0)`, backgroundSize: "32px 32px" }} />
           <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-cyan-500/10 to-blue-600/10" />

           <div className="relative z-10 max-w-3xl mx-auto space-y-8">
             <h2 className="text-4xl md:text-6xl font-bold text-[var(--card)] tracking-tight">
               Ready to upgrade your <br />
               <span className="text-cyan-400">financial stack?</span>
             </h2>
             <p className="text-[var(--card)]/70 text-lg md:text-xl leading-relaxed">
               Deploy your personal finance instance in under 60 seconds. 
               Open-source spirit, enterprise-grade performance.
             </p>
             <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
               <Link
                 to="/signup"
                 className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-cyan-500 text-[var(--text-primary)] font-black text-lg
                            hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_rgba(6,182,212,0.3)]"
               >
                 Create Main Instance
               </Link>
               <Link
                 to="/login"
                 className="w-full sm:w-auto px-10 py-5 rounded-2xl border-2 border-[var(--card)]/20 text-[var(--card)] font-bold
                            hover:bg-[var(--card)]/10 transition-all"
               >
                 Access Console
               </Link>
             </div>
           </div>
        </motion.section>

        <FAQSection />
        <IntegrationsGrid />
      </div>
    </DevBackground>
  );
};
