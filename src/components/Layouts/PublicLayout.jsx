import React from "react";
import { Navbar } from "../Common/Navbar";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

export const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0c0e12] via-[#0f1115] to-[#0b0c10] text-white">
      <Navbar />

      {/* Page wrapper */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="px-4 sm:px-8 lg:px-14 py-8"
      >
        <Outlet />
      </motion.div>
    </div>
  );
};
