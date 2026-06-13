import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiTarget,
  FiPieChart,
  FiLayout,
} from "react-icons/fi";

// ================ Material UI Components ================
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import Avatar from "@mui/material/Avatar";

const tabs = [
  {
    id: "income",
    label: "Income Stream",
    icon: <FiTrendingUp size={14} />,
    color: "success.main",
    bg: "rgba(16, 185, 129, 0.1)",
  },
  {
    id: "expenses",
    label: "Outflow Tracking",
    icon: <FiTrendingDown size={14} />,
    color: "error.main",
    bg: "rgba(244, 63, 94, 0.1)",
  },
  {
    id: "budget",
    label: "Thresholds",
    icon: <FiTarget size={14} />,
    color: "warning.main",
    bg: "rgba(245, 158, 11, 0.1)",
  },
  {
    id: "reports",
    label: "Analytics",
    icon: <FiPieChart size={14} />,
    color: "cyan.main",
    bg: "rgba(6, 182, 212, 0.1)",
  },
];

export const DashboardPreviewTabs = () => {
  const [active, setActive] = useState("income");

  const currentTab = tabs.find((t) => t.id === active);

  return (
    <Container component="section" sx={{ py: 10 }}>
      {/* Header */}
      <Stack spacing={2} alignItems="center" textAlign="center" sx={{ mb: 6 }}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{
            px: 2,
            py: 0.5,
            borderRadius: 10,
            bgcolor: "cyan.main",
            opacity: 0.8,
            color: "cyan.contrastText",
          }}
        >
          <FiLayout size={12} />
          <Typography variant="caption" sx={{ fontWeight: "bold", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Architecture Preview
          </Typography>
        </Stack>
        <Typography variant="h4" component="h2" sx={{ fontWeight: "bold", tracking: "-0.02em" }}>
          Engineered for{" "}
          <Box component="span" sx={{ color: "cyan.main" }}>
            Clarity
          </Box>
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxW: 600, mx: "auto" }}>
          Experience a high-performance financial interface designed for rapid data entry and deep analytical insights.
        </Typography>
      </Stack>

      <Box sx={{ maxW: 1000, mx: "auto" }}>
        {/* Navigation */}
        <Stack
          direction="row"
          justifyContent="center"
          flexWrap="wrap"
          spacing={2}
          sx={{ mb: 4 }}
        >
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              variant={active === tab.id ? "contained" : "outlined"}
              color={active === tab.id ? "primary" : "inherit"}
              startIcon={tab.icon}
              sx={{
                borderRadius: 3,
                textTransform: "none",
                fontWeight: "bold",
                px: 3,
                py: 1,
                borderColor: active === tab.id ? "primary.main" : "divider",
                bgcolor: active === tab.id ? "primary.main" : "transparent",
                color: active === tab.id ? "primary.contrastText" : "text.secondary",
                "&:hover": {
                  bgcolor: active === tab.id ? "primary.main" : "action.hover",
                },
              }}
            >
              {tab.label}
            </Button>
          ))}
        </Stack>

        {/* Content Area */}
        <Box sx={{ position: "relative" }}>
          {/* Ambient Glow */}
          <Box
            sx={{
              position: "absolute",
              inset: -16,
              background: "linear-gradient(to right, rgba(6, 182, 212, 0.05), rgba(59, 130, 246, 0.05))",
              filter: "blur(24px)",
              borderRadius: 8,
              opacity: 1,
              pointerEvents: "none",
            }}
          />

          <Card
            sx={{
              position: "relative",
              border: 1,
              borderColor: "divider",
              borderRadius: 6,
              boxShadow: 3,
              overflow: "hidden",
              bgcolor: "background.paper",
            }}
          >
            {/* Toolbar */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                px: 3,
                py: 2,
                borderBottom: 1,
                borderColor: "divider",
                bgcolor: "action.hover",
              }}
            >
              <Stack direction="row" spacing={1}>
                <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "rgba(244, 63, 94, 0.4)" }} />
                <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "rgba(245, 158, 11, 0.4)" }} />
                <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "rgba(16, 185, 129, 0.4)" }} />
              </Stack>
              <Box
                sx={{
                  px: 2,
                  py: 0.5,
                  borderRadius: 1,
                  bgcolor: "background.paper",
                  border: 1,
                  borderColor: "divider",
                  fontFamily: "monospace",
                  fontSize: 10,
                  color: "text.secondary",
                }}
              >
                <Box component="span" sx={{ color: "cyan.main", mr: 1, fontWeight: "bold" }}>
                  GET
                </Box>
                /api/v1/finance/{active}
              </Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <Box
                  component="span"
                  className="animate-pulse"
                  sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "success.main" }}
                />
                <Typography variant="caption" sx={{ fontWeight: "bold", color: "success.main", tracking: "-0.01em" }}>
                  Live Sync
                </Typography>
              </Stack>
            </Stack>

            {/* Inner Content */}
            <CardContent sx={{ p: 4, minHeight: 300, display: "flex", alignItems: "center" }}>
              <AnimatePresence mode="wait">
                <Grid
                  container
                  spacing={4}
                  size={12}
                  component={motion.div}
                  key={active}
                  initial={{ opacity: 0, scale: 0.98, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.02, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  alignItems="center"
                >
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Stack spacing={3}>
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: "bold", color: "cyan.main", tracking: "0.1em", textTransform: "uppercase" }}>
                          Detailed Metric
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: "bold", mt: 1, tracking: "-0.03em" }}>
                          {active === "income" && "₹72,450.00"}
                          {active === "expenses" && "₹49,820.50"}
                          {active === "budget" && "72.4%"}
                          {active === "reports" && "14 Active"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          {active === "income" && "+12.5% from last month"}
                          {active === "expenses" && "-4.2% from last month"}
                          {active === "budget" && "Remaining: ₹22,629.50"}
                          {active === "reports" && "2 new alerts detected"}
                        </Typography>
                      </Box>

                      <Stack spacing={2}>
                        {[75, 45].map((val, idx) => (
                          <LinearProgress
                            key={idx}
                            variant="determinate"
                            value={val}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              bgcolor: "action.hover",
                              "& .MuiLinearProgress-bar": {
                                bgcolor: currentTab.color,
                              },
                            }}
                          />
                        ))}
                      </Stack>
                    </Stack>
                  </Grid>

                  <Grid size={{ xs: 0, md: 6 }} sx={{ display: { xs: "none", md: "block" } }}>
                    <Box
                      sx={{
                        borderRadius: 4,
                        border: 1,
                        borderColor: "divider",
                        p: 4,
                        bgcolor: "action.hover",
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Avatar
                          sx={{
                            bgcolor: currentTab.bg,
                            color: currentTab.color,
                            borderRadius: 3,
                            width: 44,
                            height: 44,
                            border: 1,
                            borderColor: "divider",
                          }}
                        >
                          {currentTab.icon}
                        </Avatar>
                        <Box textAlign="right">
                          <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "monospace", display: "block" }}>
                            NODE_STATUS
                          </Typography>
                          <Typography variant="caption" sx={{ fontWeight: "bold", color: "success.main" }}>
                            OPTIMAL
                          </Typography>
                        </Box>
                      </Stack>

                      <Stack spacing={1.5}>
                        <Box sx={{ width: "100%", height: 32, borderRadius: 2, bgcolor: "background.paper", border: 1, borderColor: "divider", opacity: 0.8 }} />
                        <Box sx={{ width: "66%", height: 24, borderRadius: 2, bgcolor: "background.paper", border: 1, borderColor: "divider", opacity: 0.8 }} />
                      </Stack>
                    </Box>
                  </Grid>
                </Grid>
              </AnimatePresence>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
};

