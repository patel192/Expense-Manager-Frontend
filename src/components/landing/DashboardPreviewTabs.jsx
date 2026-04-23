import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiTarget,
  FiPieChart,
  FiActivity,
  FiLayout,
} from "react-icons/fi";

const tabs = [
  {
    id: "income",
    label: "Income Stream",
    icon: <FiTrendingUp size={14} />,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    id: "expenses",
    label: "Outflow Tracking",
    icon: <FiTrendingDown size={14} />,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  {
    id: "budget",
    label: "Thresholds",
    icon: <FiTarget size={14} />,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    id: "reports",
    label: "Analytics",
    icon: <FiPieChart size={14} />,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
  },
];

export const DashboardPreviewTabs = () => {
  const [active, setActive] = useState("income");

  return (
    <section className="py-24 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 text-[10px] font-bold uppercase tracking-widest">
          <FiLayout size={12} />
          Architecture Preview
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] tracking-tight">
          Engineered for <span className="text-cyan-500">Clarity</span>
        </h2>
        <p className="text-[var(--text-secondary)] max-w-2xl mx-auto text-base">
          Experience a high-performance financial interface designed for rapid data entry and deep analytical insights.
        </p>
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Navigation */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`
                group relative flex items-center gap-2.5
                px-5 py-2.5 rounded-xl border transition-all duration-200
                ${
                  active === tab.id
                    ? "bg-[var(--card)] border-[var(--border)] shadow-sm text-[var(--text-primary)]"
                    : "bg-transparent border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)]"
                }
              `}
            >
              <span className={`${active === tab.id ? tab.color : "text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]"}`}>
                {tab.icon}
              </span>
              <span className="text-sm font-semibold tracking-wide">{tab.label}</span>
              {active === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -bottom-[1px] left-4 right-4 h-0.5 bg-cyan-500 rounded-full"
                />
              )}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="relative group">
          {/* Decorative Elements */}
          <div className="absolute -inset-4 bg-gradient-to-tr from-cyan-500/10 via-blue-500/5 to-transparent rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] overflow-hidden">
            {/* Browser-like Toolbar */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] bg-[var(--surface-secondary)]/50">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/20 border border-rose-500/40" />
                <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/40" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-[var(--card)] border border-[var(--border)] text-[10px] text-[var(--text-muted)] font-mono">
                <span className="text-cyan-500 opacity-50">GET</span>
                <span>/api/v1/finance/{active}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FiActivity size={12} className="text-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">Live Sync</span>
              </div>
            </div>

            {/* Inner Content */}
            <div className="p-8 min-h-[300px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, scale: 0.98, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.02, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
                >
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-bold text-cyan-500 uppercase tracking-widest mb-2">Detailed Metric</h4>
                      <p className="text-4xl font-bold text-[var(--text-primary)] tracking-tight">
                        {active === "income" && "₹72,450.00"}
                        {active === "expenses" && "₹49,820.50"}
                        {active === "budget" && "72.4%"}
                        {active === "reports" && "14 Active"}
                      </p>
                      <p className="text-sm text-[var(--text-secondary)] mt-2">
                        {active === "income" && "+12.5% from last month"}
                        {active === "expenses" && "-4.2% from last month"}
                        {active === "budget" && "Remaining: ₹22,629.50"}
                        {active === "reports" && "2 new alerts detected"}
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      {[1, 2].map((i) => (
                        <div key={i} className="h-2 w-full bg-[var(--surface-secondary)] rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.random() * 60 + 20}%` }}
                            className={`h-full rounded-full ${tabs.find(t => t.id === active).bg.replace('/10', '')}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="hidden md:block">
                    <div className="aspect-square rounded-2xl bg-gradient-to-br from-[var(--surface-secondary)] to-[var(--card)] border border-[var(--border)] p-6 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div className={`p-3 rounded-xl ${tabs.find(t => t.id === active).bg} ${tabs.find(t => t.id === active).color}`}>
                          {tabs.find(t => t.id === active).icon}
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-[var(--text-muted)] font-mono uppercase">Node_Status</p>
                          <p className="text-xs font-bold text-emerald-500">OPTIMAL</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-12 w-full bg-[var(--surface-tertiary)] rounded-lg animate-pulse" />
                        <div className="h-8 w-2/3 bg-[var(--surface-tertiary)] rounded-lg animate-pulse" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};