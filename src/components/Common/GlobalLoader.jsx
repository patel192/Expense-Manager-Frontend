import React from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

// ================ Material UI Components ================
import Backdrop from "@mui/material/Backdrop";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";

/**
 * --- GLOBAL APPLICATION LOADER ---
 * This overlay appears whenever a global API request is in progress.
 * It uses Redux to know when to show itself and what text to display.
 */
const GlobalLoader = () => {
  const { isLoading, loadingText } = useSelector((state) => state.ui);

  return (
    <AnimatePresence>
      {isLoading && (
        <Backdrop
          open={isLoading}
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          sx={{
            zIndex: (theme) => theme.zIndex.modal + 2000, // Explicit layout priority (equivalent to z-[9999])
            bgcolor: "rgba(15, 23, 42, 0.6)", // Equivalent to bg-slate-900/60
            backdropFilter: "blur(12px)", // Equivalent to backdrop-blur-md
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box sx={{ position: "relative" }}>
            {/* ── AMBIENT GLOW ── */}
            <Box
              component={motion.div}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              sx={{
                position: "absolute",
                inset: 0,
                bgcolor: "cyan.main",
                filter: "blur(24px)", // Equivalent to blur-2xl
                borderRadius: "50%",
              }}
            />

            {/* ── SPINNER BOX ── */}
            <Paper
              elevation={24}
              sx={{
                position: "relative",
                p: 4, // Equivalent to p-8
                borderRadius: 6, // Equivalent to rounded-3xl
                bgcolor: "grey.900", // Dark slate background matching code intent
                border: "1px solid rgba(255, 255, 255, 0.1)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              {/* Spinning Loader Element */}
              <Box sx={{ color: "cyan.main", display: "flex", p: 1 }}>
                <CircularProgress
                  color="inherit"
                  size={48}
                  thickness={4}
                  sx={{
                    animationDuration: "1.5s", // Matches the customized spin timing
                  }}
                />
              </Box>

              {/* Dynamic Status Text Typography */}
              <Stack spacing={0.5} sx={{ textAlign: "center" }}>
                <Typography
                  variant="h6"
                  component={motion.h3}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  sx={{
                    fontWeight: "semibold",
                    color: "common.white",
                  }}
                >
                  {loadingText || "Processing..."}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Please wait a moment
                </Typography>
              </Stack>

              {/* Infinite Loading Progression Strip */}
              <Box sx={{ width: 128, mt: 1 }}>
                <LinearProgress
                  variant="indeterminate"
                  sx={{
                    height: 4,
                    borderRadius: 2,
                    bgcolor: "grey.800",
                    "& .MuiLinearProgress-bar": {
                      background: "linear-gradient(to right, transparent, var(--mui-palette-cyan-main), transparent)",
                    },
                  }}
                />
              </Box>
            </Paper>
          </Box>
        </Backdrop>
      )}
    </AnimatePresence>
  );
};

export default GlobalLoader;