import React from "react";
import { Navbar } from "../Common/Navbar";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

export const PublicLayout = () => {
  return (
    <div className="
  min-h-screen
  bg-[var(--bg)]
  text-[var(--text)]
  relative
  overflow-hidden
">
  <div className="
  absolute
  top-[-200px]
  left-[-200px]
  w-[500px]
  h-[500px]
  bg-cyan-500/10
  blur-3xl
  rounded-full
  pointer-events-none
"/>
      <Navbar />
      {/* Page wrapper */}
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
