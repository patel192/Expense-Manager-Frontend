// =============== Imports ===============
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { Navbar } from "../Common/Navbar";

// =============== Animation Config ===============

// Reusable page transition animation
export const PublicLayout = () => {
  return (
    <div
      className="
  min-h-screen
  bg-[var(--bg)]
  text-[var(--text)]
  relative
  overflow-hidden
"
    >
      {/* Decorative background glow */}

      <div
        className="
  absolute
  top-[-200px]
  left-[-200px]
  w-[500px]
  h-[500px]
  bg-cyan-500/10
  blur-3xl
  rounded-full
  pointer-events-none
"
      />
      {/* Public navigation bar */}
      <Navbar />
      {/* Page content container */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="pb-8"
      >
        <Outlet />
      </motion.div>
    </div>
  );
};
