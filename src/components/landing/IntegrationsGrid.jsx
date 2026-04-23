import React from "react";
import { motion } from "framer-motion";
import {
  FiFileText,
  FiDatabase,
  FiShield,
  FiBarChart2,
  FiCloud,
  FiGrid,
  FiLayers,
  FiLock,
} from "react-icons/fi";

const integrations = [
  { name: "CSV Export", icon: <FiFileText size={18} /> },
  { name: "Excel", icon: <FiGrid size={18} /> },
  { name: "API Access", icon: <FiDatabase size={18} /> },
  { name: "Reports", icon: <FiBarChart2 size={18} /> },
  { name: "Cloud Sync", icon: <FiCloud size={18} /> },
  { name: "Data Backup", icon: <FiLayers size={18} /> },
  { name: "Secure Storage", icon: <FiShield size={18} /> },
  { name: "Encryption", icon: <FiLock size={18} /> },
];

export const IntegrationsGrid = () => {
  return (
    <section className="py-20 space-y-10">

      {/* Header */}
      <div className="text-center space-y-2">
        <p className="text-xs uppercase tracking-widest text-cyan-500 font-medium">
          Integrations
        </p>

        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text)]">
          Works with your workflow
        </h2>

        <p className="text-[var(--muted)] max-w-xl mx-auto text-sm">
          Export data, generate reports, and keep everything secure with built-in integrations.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">

        {integrations.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="
              flex
              flex-col
              items-center
              justify-center
              gap-2
              px-4
              py-6
              rounded-2xl
              bg-[var(--surface-primary)]
              border
              border-[var(--border)]
              shadow-sm
              hover:shadow-md
              hover:-translate-y-1
              transition
            "
          >
            <div
              className="
                w-10
                h-10
                rounded-xl
                flex
                items-center
                justify-center
                bg-[var(--surface-secondary)]
                border
                border-[var(--border)]
                text-cyan-400
              "
            >
              {item.icon}
            </div>

            <p className="text-xs font-medium text-[var(--text-secondary)]">
              {item.name}
            </p>

          </motion.div>
        ))}

      </div>

    </section>
  );
};