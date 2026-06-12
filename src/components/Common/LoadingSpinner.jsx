import React from "react";

// ================ Material UI Components ================
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

/**
 * --- REUSABLE LOADING SPINNER ---
 * A lightweight spinner for localized loading states (e.g., inside a button or small card).
 */
const LoadingSpinner = ({
  size = 24,
  label = "Loading...",
  color = "cyan.main", // Standardized to accept a theme token pathway
  sx = {}, // Standardized override hook matching standard MUI best practices
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1.5, // Equivalent to gap-3 (3 * 4px = 12px)
        ...sx,
      }}
    >
      {/* ── SPINNER ELEMENT ── */}
      <Box sx={{ color: color, display: "flex" }}>
        <CircularProgress
          size={size}
          color="inherit" // Inherits the wrapper's text token context
          thickness={4.5}
          sx={{
            animationDuration: "1.5s", // Maintains the original customized linear cadence
          }}
        />
      </Box>

      {/* ── TEXT LABEL ── */}
      {label && (
        <Typography
          variant="caption"
          sx={{
            fontSize: "10px",
            fontWeight: "bold",
            textTransform: "uppercase",
            letterSpacing: "0.15em", // Equivalent to tracking-widest
            color: color,
            opacity: 0.8,
            animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite", // Recreates Tailwind's animate-pulse inline
          }}
        >
          {label}
        </Typography>
      )}
    </Box>
  );
};

export default LoadingSpinner;