import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { Navbar } from "../Common/Navbar";
import Box from "@mui/material/Box";

/**
 * --- PUBLIC FACING LAYOUT ---
 * Used for pages like Home, Login, and Signup.
 * Features a standard navbar and smooth entry animations.
 */
export const PublicLayout = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── DECORATIVE BACKGROUND ── */}
      {/* Subtle ambient glow to match the premium aesthetic */}
      <Box
        sx={{
          position: "absolute",
          top: -200,
          left: -200,
          width: 500,
          height: 500,
          bgcolor: "cyan.main",
          opacity: 0.05,
          filter: "blur(64px)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      {/* ── NAVIGATION ── */}
      <Navbar />

      {/* ── MAIN CONTENT ── */}
      {/* Uses Framer Motion to slide/fade content in as user navigates */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        sx={{ pb: 8 }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};


