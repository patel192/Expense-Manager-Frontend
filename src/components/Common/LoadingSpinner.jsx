import React from "react";

// ================ Material UI Components ================
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

const DEFAULT_SX = {};

const LoadingSpinner = ({
  size = 24,
  label = "Loading...",
  color = "cyan.main",
  sx = DEFAULT_SX,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1.5, 
        ...sx,
      }}
    >
      {/* ── SPINNER ELEMENT ── */}
      <Box sx={{ color: color, display: "flex" }}>
        <CircularProgress
          size={size}
          color="inherit" 
          thickness={4.5}
          sx={{
            animationDuration: "1.5s", 
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
            letterSpacing: "0.15em", 
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