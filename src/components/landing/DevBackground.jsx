import React from "react";
import { motion } from "framer-motion";

export const DevBackground = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[var(--background)]">
      {/* Fixed Grid Background */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Moving Lines / Data Pulses */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`h-line-${i}`}
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "linear",
              delay: i * 1.5,
            }}
            className="absolute h-px w-full bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"
            style={{ top: `${15 + i * 15}%` }}
          />
        ))}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`v-line-${i}`}
            initial={{ y: "-100%" }}
            animate={{ y: "100%" }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "linear",
              delay: i * 2,
            }}
            className="absolute w-px h-full bg-gradient-to-b from-transparent via-blue-500/20 to-transparent"
            style={{ left: `${10 + i * 18}%` }}
          />
        ))}
      </div>

      {/* Radial Gradient Glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/5 blur-[120px]" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
