import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";

// ================ Material UI Components ================
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid"; 
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";

// ================ Icons ================
import {
  FiTrendingUp,
  FiTrendingDown,
  FiPieChart,
  FiShield,
  FiBarChart2,
  FiActivity,
  FiCheckCircle,
  FiArrowRight,
  FiTarget,
  FiZap,
  FiCpu,
  FiGlobe,
  FiArrowUpRight,
} from "react-icons/fi";

import { DashboardPreviewTabs } from "../landing/DashboardPreviewTabs";
import { StatsRow } from "../landing/StatsRow";
import { ActivityFeed } from "../landing/ActivityFeed";
import { IntegrationsGrid } from "../landing/IntegrationsGrid";
import { Testimonials } from "../landing/Testimonials";
import { PricingPlans } from "../landing/PricingPlans";
import { FAQSection } from "../landing/FAQSection";
import { DevBackground } from "../landing/DevBackground";
import { Footer } from "./Footer";

/* ── animation variant ── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

/* ── animated counter hook ── */
function useCounter(target, duration = 1400, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return value;
}

/* ── animated app window ── */
const AppWindow = () => {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const income = useCounter(72450, 1200, visible);
  const expenses = useCounter(49820, 1200, visible);
  const savings = useCounter(22630, 1200, visible);

  const fmt = (n) => "₹" + n.toLocaleString("en-IN");

  return (
    <Card
      ref={ref}
      sx={{
        position: "relative",
        w: "100%",
        maxW: 512,
        borderRadius: 4,
        bgcolor: "background.paper",
        border: 1,
        borderColor: "divider",
        boxShadow: (theme) =>
          theme.palette.mode === "dark"
            ? "0 20px 50px rgba(0,0,0,0.5)"
            : "0 20px 50px rgba(0,0,0,0.05)",
        overflow: "hidden",
        "&:hover .ambient-glow": { opacity: 1 },
      }}
    >
      {/* Decorative pulse background */}
      <Box
        className="ambient-glow"
        sx={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top right, rgba(6, 182, 212, 0.05), transparent, rgba(37, 99, 235, 0.05))",
          opacity: 0,
          transition: "opacity 0.7s duration",
          pointerEvents: "none",
        }}
      />

      {/* Window Title Bar Chrome */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          px: 2.5,
          py: 1.75,
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "action.hover",
          backdropFilter: "blur(8px)",
        }}
      >
        <Stack direction="row" spacing={1}>
          <Box sx={{ w: 12, h: 12, borderRadius: "50%", bgcolor: "rgba(244, 63, 94, 0.3)", border: "1px solid rgba(244, 63, 94, 0.5)" }} />
          <Box sx={{ w: 12, h: 12, borderRadius: "50%", bgcolor: "rgba(245, 158, 11, 0.3)", border: "1px solid rgba(245, 158, 11, 0.5)" }} />
          <Box sx={{ w: 12, h: 12, borderRadius: "50%", bgcolor: "rgba(16, 185, 129, 0.3)", border: "1px solid rgba(16, 185, 129, 0.5)" }} />
        </Stack>
        
        <Typography
          variant="caption"
          sx={{ fontFamily: "monospace", textTransform: "uppercase", letterSpacing: 1.5, color: "text.disabled", display: "flex", alignItems: "center", gap: 1 }}
        >
          <FiGlobe size={10} style={{ color: "var(--mui-palette-cyan-main)" }} />
          fintrack.io/live-dash
        </Typography>

        <Stack direction="row" alignItems="center" spacing={0.75}>
          <Box sx={{ w: 6, h: 6, borderRadius: "50%", bgcolor: "emerald.main", animation: "pulse 2s infinite" }} />
          <Typography variant="caption" sx={{ fontSize: "10px", fontWeight: "bold", color: "emerald.main", textTransform: "uppercase" }}>
            Sync
          </Typography>
        </Stack>
      </Stack>

      {/* Body Area Layout */}
      <Stack spacing={2.5} sx={{ p: 3, position: "relative" }}>
        
        {/* Header analytics summary line row */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="caption" sx={{ display: "block", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.2em", color: "text.disabled", fontWeight: "bold" }}>
              Runtime Analytics
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "text.primary", mt: 0.5 }}>
              Financial Status
            </Typography>
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Typography variant="caption" sx={{ display: "block", fontSize: "10px", textTransform: "uppercase", letterSpacing: 1.5, color: "text.disabled" }}>
              Net Delta
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "cyan.main" }}>
              {fmt(savings)}
            </Typography>
          </Box>
        </Stack>

        {/* Dynamic Metric Mini Card Loops */}
        <Grid container spacing={1.5}>
          {[
            { label: "Inflow", value: fmt(income), color: "emerald.main", borderColor: "rgba(16, 185, 129, 0.15)", bg: "rgba(16, 185, 129, 0.04)", icon: <FiTrendingUp size={12} /> },
            { label: "Outflow", value: fmt(expenses), color: "rose.main", borderColor: "rgba(244, 63, 94, 0.15)", bg: "rgba(244, 63, 94, 0.04)", icon: <FiTrendingDown size={12} /> },
            { label: "Liquidity", value: fmt(savings), color: "cyan.main", borderColor: "rgba(6, 182, 212, 0.15)", bg: "rgba(6, 182, 212, 0.04)", icon: <FiPieChart size={12} /> },
          ].map((m, i) => (
            <Grid size={4} key={i}>
              <Box sx={{ borderRadius: 3, border: 1, p: 1.5, bgcolor: m.bg, borderColor: m.borderColor }}>
                <Stack direction="row" alignItems="center" spacing={0.75} sx={{ color: m.color, mb: 0.75 }}>
                  {m.icon}
                  <Typography variant="caption" sx={{ fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: 0.5, opacity: 0.7 }}>
                    {m.label}
                  </Typography>
                </Stack>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: m.color }}>
                  {m.value}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Utilization Gauge Progression Strip */}
        <Stack spacing={1.5} sx={{ p: 2, borderRadius: 3, bgcolor: "action.hover", border: 1, borderColor: "divider" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ fontFamily: "monospace", fontSize: "10px" }}>
            <Typography variant="caption" sx={{ color: "text.disabled", textTransform: "uppercase" }}>
              Budget Utilization
            </Typography>
            <Typography variant="caption" sx={{ color: "warning.main", fontWeight: "bold" }}>
              72.4%
            </Typography>
          </Stack>
          
          <Box sx={{ h: 6, borderRadius: 10, bgcolor: "divider", overflow: "hidden", position: "relative" }}>
            <Box
              component={motion.div}
              initial={{ width: 0 }}
              animate={visible ? { width: "72.4%" } : { width: 0 }}
              transition={{ duration: 1.5, ease: "circOut" }}
              sx={{
                height: "100%",
                borderRadius: 10,
                background: "linear-gradient(to right, #06b6d4, #3b82f6, #6366f1)",
              }}
            />
          </Box>

          <Stack direction="row" justifyContent="space-between" sx={{ fontFamily: "monospace", fontSize: "9px", color: "text.disabled", textTransform: "uppercase" }}>
            <span>Critical: 85%</span>
            <span>Warn: 60%</span>
            <span>Safe: 40%</span>
          </Stack>
        </Stack>

        {/* Log Operations Diagnostics */}
        <Stack spacing={1}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <FiActivity size={12} style={{ color: "var(--mui-palette-cyan-main)" }} />
            <Typography variant="caption" sx={{ textTransform: "uppercase", letterSpacing: "0.2em", color: "text.disabled", fontWeight: "bold" }}>
              Event Log
            </Typography>
          </Stack>

          {[
            { label: "Stripe Webhook", status: "Success", time: "2m ago" },
            { label: "AWS Lambda / Calc", status: "Active", time: "Now" },
            { label: "DB Migration", status: "Stable", time: "1h ago" },
          ].map((row, i) => (
            <Stack
              key={i}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                fontSize: "11px",
                fontFamily: "monospace",
                py: 0.5,
                borderBottom: 1,
                borderColor: "divider",
                "&:last-child": { borderBottom: "none" },
              }}
            >
              <Typography variant="caption" sx={{ color: "text.secondary", fontFamily: "inherit" }}>{row.label}</Typography>
              <Stack direction="row" spacing={3} alignItems="center">
                <Typography variant="caption" sx={{ color: "text.disabled", opacity: 0.6, fontFamily: "inherit" }}>{row.time}</Typography>
                <Typography variant="caption" sx={{ color: "emerald.main", fontWeight: "bold", fontFamily: "inherit" }}>{row.status}</Typography>
              </Stack>
            </Stack>
          ))}
        </Stack>

      </Stack>
    </Card>
  );
};

/* ── feature cards data object descriptors ── */
const features = [
  { icon: <FiCpu size={20} />, title: "High Precision", desc: "Every transaction is tracked with 100% accuracy and millisecond latency.", color: "cyan.main" },
  { icon: <FiBarChart2 size={20} />, title: "Deep Insights", desc: "AI-driven patterns to help you optimize your spending architecture.", color: "blue.main" },
  { icon: <FiTarget size={20} />, title: "Threshold Alerts", desc: "Set real-time alerts for when budgets exceed defined parameters.", color: "indigo.main" },
  { icon: <FiShield size={20} />, title: "End-to-End Secure", desc: "Encryption-at-rest and in-transit for all your financial sensitive data.", color: "violet.main" },
];

/* ── MAIN LANDING VIEWPORT ARCHITECTURE COMPONENT ── */
export const Content = () => {
  return (
    <DevBackground>
      <Container maxWidth="lg" sx={{ pb: 12, display: "flex", flexDirection: "column", gap: 16 }}>
        
        {/* ═══════════ HERO ENTRY WRAPPER ═══════════ */}
        <Box
          id="home"
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
            gap: { xs: 8, lg: 12 },
            alignItems: "center",
            pt: { xs: 12, md: 16 },
          }}
        >
          {/* Left Text Block */}
          <Stack
            component={motion.div}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            spacing={4}
            sx={{ textAlign: { xs: "center", lg: "left" } }}
          >
            {/* Engine Generation Version Tag Chip Badge */}
            <Box>
              <Chip
                icon={<FiZap size={11} className="animate-pulse" style={{ color: "inherit" }} />}
                label="v2.0 Finance Engine"
                sx={{
                  px: 0.5,
                  borderRadius: 4,
                  bgcolor: "rgba(6, 182, 212, 0.05)",
                  border: 1,
                  borderColor: "rgba(6, 182, 212, 0.15)",
                  color: "cyan.main",
                  fontSize: "10px",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  letterSpacing: 1.5,
                }}
              />
            </Box>

            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "3rem", md: "5rem" },
                fontWeight: "bold",
                letterSpacing: "-0.03em",
                lineHeight: 0.95,
                color: "text.primary",
              }}
            >
              Manage money <br />
              <Box
                component="span"
                sx={{
                  background: "linear-gradient(to right, #06b6d4, #3b82f6, #4f46e5)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                like a pro.
              </Box>
            </Typography>

            <Typography variant="body1" sx={{ color: "text.secondary", fontSize: { xs: "1.125rem", md: "1.25rem" }, lineHeight: 1.6, maxWidth: 576, mx: { xs: "auto", lg: 0 } }}>
              FinTrack is the high-performance dashboard for engineers of their own finances. Track, analyze, and optimize your wealth with technical precision.
            </Typography>

            {/* CTA Option Grid Action Row */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ pt: 1, justifyContent: { xs: "center", lg: "flex-start" } }}>
              <Button
                component={RouterLink}
                to="/signup"
                variant="contained"
                endIcon={<FiArrowRight size={18} />}
                sx={{
                  px: 4,
                  py: 2,
                  borderRadius: 3,
                  bgcolor: "text.primary",
                  color: "background.paper",
                  fontWeight: "bold",
                  textTransform: "none",
                  fontSize: "16px",
                  transition: "all 0.3s",
                  "&:hover": { opacity: 0.9, transform: "translateY(-2px)" },
                }}
              >
                Initialize Account
              </Button>
              <Button
                component="a"
                href="#features"
                variant="outlined"
                sx={{
                  px: 4,
                  py: 2,
                  borderRadius: 3,
                  border: 1,
                  borderColor: "divider",
                  bgcolor: "rgba(var(--mui-palette-action-hoverChannel), 0.5)",
                  color: "text.primary",
                  fontWeight: "bold",
                  textTransform: "none",
                  fontSize: "16px",
                  "&:hover": { bgcolor: "action.hover", borderColor: "action.active" },
                }}
              >
                System Specs
              </Button>
            </Stack>

            {/* Multi Encrypted Encryption Proofing Node Row */}
            <Stack direction="row" flexWrap="wrap" justifyContent={{ xs: "center", lg: "flex-start" }} gap={3} sx={{ pt: 2, opacity: 0.5, filter: "grayscale(100%)", "&:hover": { filter: "none", opacity: 1 }, transition: "all 0.5s" }}>
              {["AES-256", "SOC2", "PCI-DSS"].map((spec) => (
                <Stack key={spec} direction="row" alignItems="center" spacing={1} sx={{ fontFamily: "monospace", fontSize: "12px", fontWeight: "bold" }}>
                  <FiCheckCircle style={{ color: "var(--mui-palette-cyan-main)" }} />
                  <span>{spec}</span>
                </Stack>
              ))}
            </Stack>
          </Stack>

          {/* Right Interface Mockup App Frame Element */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "circOut" }}
            sx={{
              display: "flex",
              justifyContent: { xs: "center", lg: "flex-end" },
              perspective: "1000px",
            }}
          >
            <Box
              sx={{
                transform: "rotateY(-5deg) rotateX(5deg)",
                "&:hover": { transform: "none" },
                transition: "transform 0.7s ease",
              }}
            >
              <AppWindow />
            </Box>
          </Box>
        </Box>

        {/* ═══════════ CORE VALUE UTILITIES FEATURE SECTION ═══════════ */}
        <Stack id="features" spacing={8}>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h3" sx={{ fontWeight: "bold", color: "text.primary", letterSpacing: "-0.02em", mb: 1 }}>
              Powerful{" "}
              <Box component="span" sx={{ color: "cyan.main" }}>
                Infrastructure
              </Box>
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: 640, mx: "auto" }}>
              Built with a focus on speed, privacy, and actionable intelligence.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((f, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                <Card
                  component={motion.div}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  sx={{
                    position: "relative",
                    p: 4,
                    borderRadius: 4,
                    bgcolor: "background.paper",
                    border: 1,
                    borderColor: "divider",
                    transition: "all 0.5s ease",
                    "&:hover": { borderColor: "rgba(6, 182, 212, 0.5)" },
                    "&:hover .hover-gradient": { opacity: 1 },
                    "&:hover .icon-box": { transform: "scale(1.1) rotate(3deg)" },
                    "&:hover .doc-link": { opacity: 1 },
                  }}
                >
                  <Box className="hover-gradient" sx={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom right, rgba(6, 182, 212, 0.03), transparent)", opacity: 0, transition: "opacity 0.3s", borderRadius: 4 }} />
                  
                  <Avatar
                    className="icon-box"
                    variant="rounded"
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 3,
                      bgcolor: "action.hover",
                      border: 1,
                      borderColor: "divider",
                      color: f.color,
                      mb: 3,
                      boxShadow: 1,
                      transition: "transform 0.3s ease",
                    }}
                  >
                    {f.icon}
                  </Avatar>

                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1.5, color: "text.primary" }}>
                    {f.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                    {f.desc}
                  </Typography>

                  <Stack className="doc-link" direction="row" alignItems="center" spacing={0.75} sx={{ mt: 3, fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: 1.5, color: "cyan.main", opacity: 0, transition: "opacity 0.3s" }}>
                    <span>Read Documentation</span>
                    <FiArrowUpRight size={14} />
                  </Stack>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Stack>

        {/* Modular Layout Core Attachments Section Sheets */}
        <DashboardPreviewTabs />

        <Grid container spacing={6} alignItems="start">
          <Grid size={{ xs: 12, lg: 4 }}>
            <ActivityFeed />
          </Grid>
          <Grid size={{ xs: 12, lg: 8 }}>
            <StatsRow />
          </Grid>
        </Grid>

        <Testimonials />
        <PricingPlans />

        {/* ═══════════ TARGET CALL TO ACTION SECTION ═══════════ */}
        <Card
          component={motion.section}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          sx={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 10,
            bgcolor: "text.primary",
            p: { xs: 6, md: 10 },
            textAlign: "center",
          }}
        >
          {/* Custom dot pattern architecture background layer mesh */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              opacity: 0.15,
              backgroundImage: "radial-gradient(circle at 2px 2px, var(--mui-palette-divider) 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />
          <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent, rgba(6, 182, 212, 0.1), rgba(37, 99, 235, 0.1))" }} />

          <Stack spacing={4} sx={{ position: "relative", zIndex: 10, maxWidth: 768, mx: "auto" }}>
            <Typography variant="h2" sx={{ fontSize: { xs: "2.25rem", md: "3.75rem" }, fontWeight: "bold", color: "background.paper", letterSpacing: "-0.02em" }}>
              Ready to upgrade your <br />
              <Box component="span" sx={{ color: "cyan.main" }}>financial stack?</Box>
            </Typography>

            <Typography variant="body1" sx={{ color: "rgba(255, 255, 255, 0.7)", fontSize: { xs: "1.125rem", md: "1.25rem" }, lineHeight: 1.6 }}>
              Deploy your personal finance instance in under 60 seconds. Open-source spirit, enterprise-grade performance.
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center" sx={{ pt: 2 }}>
              <Button
                component={RouterLink}
                to="/signup"
                variant="contained"
                sx={{
                  px: 5,
                  py: 2.5,
                  borderRadius: 4,
                  bgcolor: "cyan.main",
                  color: "text.primary",
                  fontWeight: 900,
                  fontSize: "1.125rem",
                  textTransform: "none",
                  boxShadow: "0 20px 40px rgba(6, 182, 212, 0.3)",
                  "&:hover": { transform: "scale(1.05)", bgcolor: "cyan.dark" },
                  transition: "all 0.2s",
                }}
              >
                Create Main Instance
              </Button>
              <Button
                component={RouterLink}
                to="/login"
                variant="outlined"
                sx={{
                  px: 5,
                  py: 2.5,
                  borderRadius: 4,
                  border: 2,
                  borderColor: "rgba(255, 255, 255, 0.2)",
                  color: "background.paper",
                  fontWeight: "bold",
                  fontSize: "1.125rem",
                  textTransform: "none",
                  "&:hover": { border: 2, borderColor: "background.paper", bgcolor: "rgba(255,255,255,0.1)" },
                  transition: "all 0.2s",
                }}
              >
                Access Console
              </Button>
            </Stack>
          </Stack>
        </Card>

        <FAQSection />
        <IntegrationsGrid />
        <Footer />
      </Container>
    </DevBackground>
  );
};