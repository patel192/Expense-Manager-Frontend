import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiTarget,
  FiPieChart,
} from "react-icons/fi";

const tabs = [
  {
    id: "income",
    label: "Income",
    icon: <FiTrendingUp size={16} />,
  },
  {
    id: "expenses",
    label: "Expenses",
    icon: <FiTrendingDown size={16} />,
  },
  {
    id: "budget",
    label: "Budget",
    icon: <FiTarget size={16} />,
  },
  {
    id: "reports",
    label: "Reports",
    icon: <FiPieChart size={16} />,
  },
];

export const DashboardPreviewTabs = () => {
  const [active, setActive] = useState("income");

  return (
    <section className="py-20 space-y-8">

      {/* Header */}
      <div className="text-center space-y-2">
        <p className="text-xs uppercase tracking-widest text-cyan-500 font-medium">
          Product Preview
        </p>

        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text)]">
          See how FinTrack works
        </h2>

        <p className="text-[var(--muted)] max-w-xl mx-auto text-sm">
          Switch between features and explore the interface before signing up.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-2">

        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`
              flex items-center gap-2
              px-4 py-2
              rounded-xl
              border
              text-sm
              transition
              ${
                active === tab.id
                  ? "bg-cyan-500 text-white border-cyan-500"
                  : "bg-[var(--surface-secondary)] text-[var(--text-secondary)] border-[var(--border)] hover:bg-[var(--surface-tertiary)]"
              }
            `}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}

      </div>

      {/* Preview Window */}
      <div className="flex justify-center">

        <div
          className="
            w-full
            max-w-2xl
            bg-[var(--card)]
            border
            border-[var(--border)]
            rounded-2xl
            shadow-lg
            overflow-hidden
          "
        >

          {/* Window Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--surface-tertiary)]">

            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
            </div>

            <p className="text-xs text-[var(--muted)]">
              FinTrack Dashboard
            </p>

            <span className="text-xs text-cyan-400">
              Live
            </span>

          </div>

          {/* Content */}
          <div className="p-6 min-h-[160px]">

            <AnimatePresence mode="wait">

              {active === "income" && (
                <motion.div
                  key="income"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="text-sm text-[var(--muted)]">
                    Monthly Income
                  </p>

                  <p className="text-2xl font-bold text-emerald-400 mt-1">
                    ₹72,000
                  </p>
                </motion.div>
              )}

              {active === "expenses" && (
                <motion.div
                  key="expenses"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="text-sm text-[var(--muted)]">
                    Monthly Expenses
                  </p>

                  <p className="text-2xl font-bold text-rose-400 mt-1">
                    ₹49,800
                  </p>
                </motion.div>
              )}

              {active === "budget" && (
                <motion.div
                  key="budget"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="text-sm text-[var(--muted)]">
                    Budget Usage
                  </p>

                  <p className="text-2xl font-bold text-amber-400 mt-1">
                    72%
                  </p>
                </motion.div>
              )}

              {active === "reports" && (
                <motion.div
                  key="reports"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="text-sm text-[var(--muted)]">
                    Reports Generated
                  </p>

                  <p className="text-2xl font-bold text-cyan-400 mt-1">
                    14 This Month
                  </p>
                </motion.div>
              )}

            </AnimatePresence>

          </div>

        </div>

      </div>

    </section>
  );
};