import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { Navbar } from "../Common/Navbar";

/**
 * --- PUBLIC FACING LAYOUT ---
 * Used for pages like Home, Login, and Signup.
 * Features a standard navbar and smooth entry animations.
 */
export const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] relative overflow-hidden">
      
      {/* ── DECORATIVE BACKGROUND ── */}
      {/* Subtle ambient glow to match the premium aesthetic */}
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

      {/* ── NAVIGATION ── */}
      <Navbar />

      {/* ── MAIN CONTENT ── */}
      {/* Uses Framer Motion to slide/fade content in as user navigates */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="pb-8"
      >
        <Outlet />
      </motion.div>
    </div>
  );
};

