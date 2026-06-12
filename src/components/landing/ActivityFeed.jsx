import React from "react";
import { motion } from "framer-motion";

// ================ Material UI Components ================
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";

// ================ Icons ================
import {
  FiTrendingUp,
  FiTrendingDown,
  FiAlertCircle,
  FiRepeat,
  FiTerminal,
} from "react-icons/fi";

// --- NORMALIZED DATA ENGINE WITH MUI STYLE PALETTE MAPPINGS ---
const activities = [
  {
    icon: <FiTrendingUp size={14} />,
    text: "Revenue_Inflow",
    amount: "+ ₹45,000",
    color: "success.main",
    bg: "rgba(46, 125, 50, 0.08)", // Equivalent to success alpha tint context
  },
  {
    icon: <FiTrendingDown size={14} />,
    text: "Expense_Outflow",
    amount: "- ₹1,250",
    color: "error.main",
    bg: "rgba(211, 47, 47, 0.08)", // Equivalent to error alpha tint context
  },
  {
    icon: <FiAlertCircle size={14} />,
    text: "Budget_Violation",
    amount: "Warn: Food",
    color: "warning.main",
    bg: "rgba(237, 108, 2, 0.08)", // Equivalent to warning alpha tint context
  },
  {
    icon: <FiRepeat size={14} />,
    text: "Cron_Recurrence",
    amount: "Netflix_Sync",
    color: "info.main",
    bg: "rgba(2, 136, 209, 0.08)", // Equivalent to info alpha tint context
  },
];

export const ActivityFeed = () => {
  return (
    <Box component="section" sx={{ py: 6, display: "flex", flexDirection: "column", gap: 5 }}>
      
      {/* ── HEADER BLOCK ── */}
      <Stack spacing={2}>
        <Box sx={{ display: "flex" }}>
          <Chip
            icon={<FiTerminal size={12} style={{ color: "var(--mui-palette-cyan-main)" }} />}
            label="Event stream_v4"
            variant="outlined"
            sx={{
              height: 24,
              px: 0.5,
              borderRadius: "16px",
              bgcolor: "action.hover",
              borderColor: "divider",
              color: "text.secondary",
              fontFamily: "monospace",
              fontSize: "10px",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              "& .MuiChip-icon": { ml: 1, mr: -0.5 },
            }}
          />
        </Box>
        <Typography
          variant="h5"
          component="h2"
          sx={{
            fontWeight: "bold",
            color: "text.primary",
            letterSpacing: "-0.02em",
          }}
        >
          Real-time{" "}
          <Box component="span" sx={{ color: "cyan.main" }}>
            ledger logs
          </Box>
        </Typography>
      </Stack>

      {/* ── ACTIVITY STREAM LIST ── */}
      <Stack spacing={1}>
        {activities.map((item, i) => (
          <Paper
            key={i}
            elevation={0}
            component={motion.div}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2.5,
              py: 2,
              borderRadius: 3,
              bgcolor: "background.paper",
              border: 1,
              borderColor: "divider",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                borderColor: "rgba(6, 182, 212, 0.3)", // Target cyan glow context outline explicitly
                boxShadow: (theme) => theme.shadows[1],
                "& .icon-wrapper": {
                  borderColor: "inherit",
                },
              },
            }}
          >
            {/* Left Content Column Frame */}
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                className="icon-wrapper"
                sx={{
                  w: 40,
                  h: 40,
                  borderRadius: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: item.bg,
                  color: item.color,
                  border: "1px solid transparent",
                  transition: "all 0.2s ease",
                }}
              >
                {item.icon}
              </Box>

              <Stack spacing={0.25}>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "monospace",
                    fontWeight: "bold",
                    color: "text.primary",
                  }}
                >
                  {item.text}
                </Typography>
                
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box
                    sx={{
                      w: 6,
                      h: 6,
                      borderRadius: "50%",
                      bgcolor: "success.main",
                      opacity: 0.4,
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: "10px",
                      fontWeight: "bold",
                      color: "text.disabled",
                      textTransform: "uppercase",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Verified_Block
                  </Typography>
                </Stack>
              </Stack>
            </Stack>

            {/* Right Diagnostic Latency Matrix Metrics */}
            <Box sx={{ textAlign: "right" }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: "bold",
                  color: item.color,
                  fontFamily: "monospace",
                }}
              >
                {item.amount}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontSize: "10px",
                  color: "text.disabled",
                  fontFamily: "monospace",
                  display: "block",
                  mt: 0.25,
                }}
              >
                {2 + i}ms latency
              </Typography>
            </Box>

          </Paper>
        ))}
      </Stack>
    </Box>
  );
};