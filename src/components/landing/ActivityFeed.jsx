import React from "react";
import { motion } from "framer-motion";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiAlertCircle,
  FiRepeat,
} from "react-icons/fi";

const activities = [
  {
    icon: <FiTrendingUp size={14} />,
    text: "Salary credited",
    amount: "₹45,000",
    color: "text-emerald-400",
  },
  {
    icon: <FiTrendingDown size={14} />,
    text: "Grocery expense",
    amount: "₹1,250",
    color: "text-rose-400",
  },
  {
    icon: <FiAlertCircle size={14} />,
    text: "Budget alert",
    amount: "Food category",
    color: "text-amber-400",
  },
  {
    icon: <FiRepeat size={14} />,
    text: "Recurring bill paid",
    amount: "Netflix",
    color: "text-cyan-400",
  },
];

export const ActivityFeed = () => {
  return (
    <section className="py-20 space-y-8">

      {/* Header */}
      <div className="text-center space-y-2">
        <p className="text-xs uppercase tracking-widest text-cyan-500 font-medium">
          Live Activity
        </p>

        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text)]">
          See your finances in motion
        </h2>

        <p className="text-[var(--muted)] max-w-xl mx-auto text-sm">
          Track transactions, alerts, and recurring payments as they happen.
        </p>
      </div>

      {/* Activity list */}
      <div className="max-w-xl mx-auto space-y-3">

        {activities.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
            className="
              flex
              items-center
              justify-between
              px-4
              py-3
              rounded-xl
              bg-[var(--surface-primary)]
              border
              border-[var(--border)]
              shadow-sm
              hover:shadow-md
              transition
            "
          >
            <div className="flex items-center gap-3">

              <div
                className={`
                  w-9
                  h-9
                  rounded-lg
                  flex
                  items-center
                  justify-center
                  bg-[var(--surface-secondary)]
                  border
                  border-[var(--border)]
                  ${item.color}
                `}
              >
                {item.icon}
              </div>

              <div>
                <p className="text-sm font-medium text-[var(--text)]">
                  {item.text}
                </p>

                <p className="text-xs text-[var(--muted)]">
                  Just now
                </p>
              </div>

            </div>

            <p className={`text-sm font-semibold ${item.color}`}>
              {item.amount}
            </p>

          </motion.div>
        ))}

      </div>

    </section>
  );
};