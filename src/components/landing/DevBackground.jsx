import React from "react";
import { motion } from "framer-motion";
import Box from "@mui/material/Box";

export const DevBackground = ({ children }) => {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        width: "100%",
        overflow: "hidden",
        bgcolor: "background.default",
      }}
    >
      {/* Fixed Grid Background */}
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.03,
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Moving Lines / Data Pulses */}
      <Box sx={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        {[...Array(6)].map((_, i) => (
          <Box
            component={motion.div}
            key={`h-line-${i}`}
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "linear",
              delay: i * 1.5,
            }}
            sx={{
              position: "absolute",
              h: "1px",
              w: "100%",
              background: "linear-gradient(to right, transparent, rgba(6, 182, 212, 0.2), transparent)",
              top: `${15 + i * 15}%`,
            }}
          />
        ))}
        {[...Array(6)].map((_, i) => (
          <Box
            component={motion.div}
            key={`v-line-${i}`}
            initial={{ y: "-100%" }}
            animate={{ y: "100%" }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "linear",
              delay: i * 2,
            }}
            sx={{
              position: "absolute",
              w: "1px",
              h: "100%",
              background: "linear-gradient(to bottom, transparent, rgba(59, 130, 246, 0.2), transparent)",
              left: `${10 + i * 18}%`,
            }}
          />
        ))}
      </Box>

      {/* Radial Gradient Glows */}
      <Box sx={{ position: "fixed", inset: 0, pointerEvents: "none" }}>
        <Box sx={{ position: "absolute", top: "-10%", left: "-10%", width: "40%", height: "40%", borderRadius: "50%", bgcolor: "cyan.main", opacity: 0.05, filter: "blur(120px)" }} />
        <Box sx={{ position: "absolute", bottom: "-10%", right: "-10%", width: "40%", height: "40%", borderRadius: "50%", bgcolor: "primary.main", opacity: 0.05, filter: "blur(120px)" }} />
      </Box>

      {/* Content */}
      <Box sx={{ position: "relative", zIndex: 10 }}>{children}</Box>
    </Box>
  );
};
