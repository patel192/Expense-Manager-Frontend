import React from "react";
import { motion } from "framer-motion";
import {
  FiDollarSign,
  FiUsers,
  FiShield,
  FiZap,
  FiTerminal,
} from "react-icons/fi";

const stats = [
  {
    icon: <FiDollarSign size={16} />,
    value: "₹2.4M+",
    label: "Flow throughput",
    color: "text-emerald-500",
  },
  {
    icon: <FiUsers size={16} />,
    value: "10K+",
    label: "Active nodes",
    color: "text-cyan-500",
  },
  {
    icon: <FiShield size={16} />,
    value: "99.99%",
    label: "SLA Uptime",
    color: "text-blue-500",
  },
  {
    icon: <FiZap size={16} />,
    value: "< 50ms",
    label: "Sync latency",
    color: "text-amber-500",
  },
];

export const StatsRow = () => {
  return (
    <section className="py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="group relative bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 overflow-hidden"
          >
            {/* Minimal line decoration */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-transparent via-cyan-500/5 to-transparent rotate-45 transform translate-x-12 -translate-y-12" />
            
            <div className={`mb-4 flex items-center gap-2 ${stat.color} font-mono text-[10px] font-bold uppercase tracking-widest`}>
              <FiTerminal size={12} />
              METRIC_{i+1}
            </div>

            <div className="space-y-1">
              <p className={`text-2xl font-bold text-[var(--text-primary)] tracking-tight`}>
                {stat.value}
              </p>
              <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                {stat.label}
              </p>
            </div>

            {/* Micro progress bar */}
            <div className="mt-4 h-1 w-full bg-[var(--surface-secondary)] rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 whileInView={{ width: "100%" }}
                 transition={{ duration: 1, delay: 0.5 }}
                 className={`h-full ${stat.color.replace('text-', 'bg-')}`}
               />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};