import React from "react";
import { motion } from "framer-motion";
import {
  FiDollarSign,
  FiUsers,
  FiShield,
  FiZap,
} from "react-icons/fi";

const stats = [
  {
    icon: <FiDollarSign size={18} />,
    value: "₹2.4L+",
    label: "Tracked monthly",
    color: "text-emerald-400",
  },
  {
    icon: <FiUsers size={18} />,
    value: "10K+",
    label: "Active users",
    color: "text-cyan-400",
  },
  {
    icon: <FiShield size={18} />,
    value: "99.9%",
    label: "System uptime",
    color: "text-blue-400",
  },
  {
    icon: <FiZap size={18} />,
    value: "100%",
    label: "Free to use",
    color: "text-amber-400",
  },
];

export const StatsRow = () => {
  return (
    <section className="py-14">

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.08 }}
            className="
              bg-[var(--surface-primary)]
              border
              border-[var(--border)]
              rounded-2xl
              p-5
              text-center
              shadow-sm
              hover:shadow-md
              transition
            "
          >
            <div
              className={`
                w-10
                h-10
                mx-auto
                mb-3
                rounded-xl
                flex
                items-center
                justify-center
                bg-[var(--surface-secondary)]
                border
                border-[var(--border)]
                ${stat.color}
              `}
            >
              {stat.icon}
            </div>

            <p className={`text-xl font-bold ${stat.color}`}>
              {stat.value}
            </p>

            <p className="text-xs text-[var(--muted)] mt-1">
              {stat.label}
            </p>
          </motion.div>
        ))}

      </div>

    </section>
  );
};