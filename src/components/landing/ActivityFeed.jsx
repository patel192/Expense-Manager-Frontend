import React from "react";
import { motion } from "framer-motion";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiAlertCircle,
  FiRepeat,
  FiTerminal,
} from "react-icons/fi";

const activities = [
  {
    icon: <FiTrendingUp size={14} />,
    text: "Revenue_Inflow",
    amount: "+ ₹45,000",
    color: "text-emerald-500",
    bg: "bg-emerald-500/5",
  },
  {
    icon: <FiTrendingDown size={14} />,
    text: "Expense_Outflow",
    amount: "- ₹1,250",
    color: "text-rose-500",
    bg: "bg-rose-500/5",
  },
  {
    icon: <FiAlertCircle size={14} />,
    text: "Budget_Violation",
    amount: "Warn: Food",
    color: "text-amber-500",
    bg: "bg-amber-500/5",
  },
  {
    icon: <FiRepeat size={14} />,
    text: "Cron_Recurrence",
    amount: "Netflix_Sync",
    color: "text-cyan-500",
    bg: "bg-cyan-500/5",
  },
];

export const ActivityFeed = () => {
  return (
    <section className="py-12 space-y-10">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--surface-secondary)] border border-[var(--border)] text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-widest">
          <FiTerminal size={12} className="text-cyan-500" />
          Event stream_v4
        </div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
          Real-time <span className="text-cyan-500">ledger logs</span>
        </h2>
      </div>

      {/* Activity list */}
      <div className="space-y-2">
        {activities.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="
              group
              flex
              items-center
              justify-between
              px-5
              py-4
              rounded-xl
              bg-[var(--card)]
              border
              border-[var(--border)]
              hover:border-cyan-500/30
              hover:shadow-sm
              transition-all
              duration-300
            "
          >
            <div className="flex items-center gap-4">
              <div
                className={`
                  w-10
                  h-10
                  rounded-xl
                  flex
                  items-center
                  justify-center
                  ${item.bg}
                  ${item.color}
                  border border-transparent
                  group-hover:border-[currentColor]/20
                  transition-all
                `}
              >
                {item.icon}
              </div>

              <div>
                <p className="text-sm font-mono font-bold text-[var(--text-primary)]">
                  {item.text}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40" />
                   <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-tighter">
                     Verified_Block
                   </p>
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className={`text-sm font-bold ${item.color} font-mono`}>
                {item.amount}
              </p>
              <p className="text-[10px] text-[var(--text-muted)] font-mono mt-0.5">
                {2 + i}ms latency
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
