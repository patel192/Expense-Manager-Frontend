import React from "react";
import { motion } from "framer-motion";
import { FiRefreshCw } from "react-icons/fi";

/**
 * --- REUSABLE LOADING SPINNER ---
 * A lightweight spinner for localized loading states (e.g., inside a button or small card).
 */
const LoadingSpinner = ({
  size = 24,
  label = "Loading...",
  color = "text-cyan-500",
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
    >
      <motion.div
        animate={{ rotate: 360 }} // Infinite rotation
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear",
        }}
        className={color}
      >
        <FiRefreshCw size={size} />
      </motion.div>
      {label && (
        <p
          className={`text-[10px] font-bold uppercase tracking-widest ${color} opacity-80 animate-pulse`}
        >
          {label}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;

