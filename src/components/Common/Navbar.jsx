import React, { useState, useEffect, useRef } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// ================ Material UI Components ================
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";

// ================ Icons ================
import { FiMenu, FiX, FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";

/**
 * --- MAIN NAVIGATION BAR ---
 * Handles site-wide navigation, section scrolling, and theme switching.
 */
export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);

  // --- UI EFFECTS ---

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // --- NAVIGATION HELPERS ---

  const links = [
    { label: "Home", to: "/" },
    { label: "Income", id: "income" },
    { label: "Expenses", id: "expenses" },
    { label: "Budgets", id: "budgets" },
    { label: "Reports", id: "reports" },
  ];

  const scrollToSection = (e, id) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      window.location.href = `/#${id}`;
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
    setOpen(false);
  };

  const isHomeActive = location.pathname === "/";

  return (
    <AppBar
      ref={menuRef}
      position="sticky"
      elevation={0}
      sx={{
        top: 0,
        zIndex: (theme) => theme.zIndex.appBar + 100,
        borderBottom: 1,
        borderColor: "divider",
        bgcolor: scrolled ? "rgba(var(--bg-rgb), 0.95)" : "rgba(var(--bg-rgb), 0.8)",
        backdropFilter: scrolled ? "blur(24px)" : "blur(16px)",
        transition: "all 0.3s ease-in-out",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{
            justifyContent: "between",
            py: scrolled ? 1 : 1.75,
            transition: "padding 0.3s ease-in-out",
          }}
        >
          {/* ── LOGO BRAND MARK ── */}
          <Stack
            component={motion.div}
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            direction="row"
            spacing={1.5}
            alignItems="center"
            sx={{ flexGrow: { xs: 1, md: 0 }, mr: 4 }}
          >
            <Box
              sx={{
                height: 32,
                width: 32,
                borderRadius: 2,
                background: "linear-gradient(135deg, #06b6d4, #2563eb)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(6, 182, 212, 0.2)",
              }}
            >
              <Box
                component="svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.2}
                sx={{ width: 16, height: 16, color: "common.white" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8v1m0 9v1M5.05 5.05A9 9 0 1118.95 18.95"
                />
              </Box>
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontSize: "1.1rem",
                fontWeight: "bold",
                letterSpacing: "-0.02em",
                background: "linear-gradient(to right, #22d3ee, #3b82f6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              FinTrack
            </Typography>
          </Stack>

          {/* ── DESKTOP NAVIGATION INTERFACE ── */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 0.5,
              flexGrow: 1,
            }}
          >
            {links.map((link, i) =>
              link.id ? (
                <Button
                  key={i}
                  onClick={(e) => scrollToSection(e, link.id)}
                  sx={{
                    px: 1.5,
                    py: 1,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 500,
                    color: "text.secondary",
                    "&:hover": { color: "text.primary", bgcolor: "action.hover" },
                  }}
                >
                  {link.label}
                </Button>
              ) : (
                <Button
                  key={i}
                  component={RouterLink}
                  to={link.to}
                  sx={{
                    px: 1.5,
                    py: 1,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 500,
                    color: isHomeActive ? "text.primary" : "text.secondary",
                    bgcolor: isHomeActive ? "action.hover" : "transparent",
                    "&:hover": { color: "text.primary", bgcolor: "action.hover" },
                  }}
                >
                  {link.label}
                </Button>
              )
            )}

            <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 1.5, my: 1 }} />

            {/* Light / Dark Mode Toggle Action Element */}
            <IconButton
              onClick={toggleTheme}
              sx={{
                p: 1,
                borderRadius: 2,
                border: 1,
                borderColor: "divider",
                bgcolor: "background.paper",
                color: "text.primary",
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              {theme === "dark" ? <FiSun size={17} /> : <FiMoon size={17} />}
            </IconButton>

            <Stack direction="row" spacing={1.5} sx={{ ml: "auto" }}>
              <Button
                component={RouterLink}
                to="/login"
                variant="outlined"
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  borderColor: "divider",
                  color: "text.secondary",
                  bgcolor: "action.hover",
                  "&:hover": { bgcolor: "action.selected", borderColor: "divider" },
                }}
              >
                Login
              </Button>
              <Button
                component={RouterLink}
                to="/signup"
                variant="contained"
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                  borderRadius: 2,
                  background: "linear-gradient(to right, #06b6d4, #2563eb)",
                  color: "common.white",
                  "&:hover": {
                    opacity: 0.9,
                    boxShadow: "0 8px 16px rgba(6, 182, 212, 0.25)",
                  },
                }}
              >
                Sign Up
              </Button>
            </Stack>
          </Box>

          {/* ── MOBILE ACTIONS VIEWPORT BAR ── */}
          <Stack direction="row" spacing={1} alignItems="center" sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              onClick={toggleTheme}
              sx={{
                p: 1,
                borderRadius: 2,
                border: 1,
                borderColor: "divider",
                bgcolor: "background.paper",
                fontSize: "1rem",
              }}
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </IconButton>

            <Button
              component={RouterLink}
              to="/login"
              size="small"
              sx={{ textTransform: "none", color: "text.secondary", bgcolor: "action.hover", px: 1.5 }}
            >
              Login
            </Button>

            <Button
              component={RouterLink}
              to="/signup"
              size="small"
              variant="contained"
              sx={{
                textTransform: "none",
                background: "linear-gradient(to right, #06b6d4, #2563eb)",
                color: "common.white",
                fontWeight: 500,
                px: 1.5,
              }}
            >
              Sign Up
            </Button>

            <IconButton
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              aria-expanded={open}
              sx={{
                p: 1,
                borderRadius: 2,
                color: "text.secondary",
                "&:hover": { color: "text.primary", bgcolor: "rgba(255,255,255,0.1)" },
                width: 40,
                height: 40,
              }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <Box
                  component={motion.span}
                  key={open ? "close" : "open"}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.15 }}
                  sx={{ display: "flex" }}
                >
                  {open ? <FiX size={20} /> : <FiMenu size={20} />}
                </Box>
              </AnimatePresence>
            </IconButton>
          </Stack>
        </Toolbar>
      </Container>

      {/* ── MOBILE COLLAPSED DROPDOWN ACCORDION MENU ── */}
      <AnimatePresence>
        {open && (
          <Box
            component={motion.div}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            sx={{
              display: { md: "none" },
              overflow: "hidden",
              borderTop: 1,
              borderColor: "divider",
              bgcolor: "rgba(var(--bg-rgb), 0.98)",
              backdropFilter: "blur(24px)",
            }}
          >
            <Stack sx={{ px: 2, py: 1.5 }}>
              <Typography
                variant="caption"
                sx={{
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.25em",
                  color: "text.disabled",
                  fontWeight: 500,
                  px: 1.5,
                  mb: 0.5,
                }}
              >
                Navigate
              </Typography>

              {links.map((link, i) =>
                link.id ? (
                  <Button
                    key={i}
                    onClick={(e) => scrollToSection(e, link.id)}
                    startIcon={<Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "cyan.main", opacity: 0.6 }} />}
                    sx={{
                      justifyContent: "flex-start",
                      textTransform: "none",
                      color: "text.secondary",
                      py: 1.5,
                      px: 1.5,
                      borderRadius: 3,
                      fontSize: "0.875rem",
                      minHeight: 44,
                      "&:hover": { color: "text.primary", bgcolor: "action.hover" },
                    }}
                  >
                    {link.label}
                  </Button>
                ) : (
                  <Button
                    key={i}
                    component={RouterLink}
                    to={link.to}
                    onClick={() => setOpen(false)}
                    startIcon={
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          bgcolor: isHomeActive ? "cyan.main" : "text.disabled",
                        }}
                      />
                    }
                    sx={{
                      justifyContent: "flex-start",
                      textTransform: "none",
                      color: isHomeActive ? "cyan.main" : "text.secondary",
                      bgcolor: isHomeActive ? "rgba(6, 182, 212, 0.08)" : "transparent",
                      py: 1.5,
                      px: 1.5,
                      borderRadius: 3,
                      fontSize: "0.875rem",
                      minHeight: 44,
                      "&:hover": { color: "text.primary", bgcolor: "action.hover" },
                    }}
                  >
                    {link.label}
                  </Button>
                )
              )}

              <Divider sx={{ my: 1.5 }} />

              <Typography
                variant="caption"
                sx={{
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.25em",
                  color: "text.disabled",
                  fontWeight: 500,
                  px: 1.5,
                  mb: 0.5,
                }}
              >
                Account
              </Typography>

              <Stack spacing={1} sx={{ pb: 1 }}>
                <Button
                  component={RouterLink}
                  to="/login"
                  onClick={() => setOpen(false)}
                  sx={{
                    py: 1.5,
                    borderRadius: 3,
                    border: 1,
                    borderColor: "divider",
                    bgcolor: "action.hover",
                    color: "text.secondary",
                    textTransform: "none",
                    minHeight: 44,
                  }}
                >
                  Login
                </Button>
                <Button
                  component={RouterLink}
                  to="/signup"
                  onClick={() => setOpen(false)}
                  variant="contained"
                  sx={{
                    py: 1.5,
                    borderRadius: 3,
                    background: "linear-gradient(to right, #06b6d4, #2563eb)",
                    color: "common.white",
                    textTransform: "none",
                    minHeight: 44,
                    boxShadow: "0 4px 12px rgba(6, 182, 212, 0.2)",
                  }}
                >
                  Sign Up — It's Free
                </Button>
              </Stack>
            </Stack>
          </Box>
        )}
      </AnimatePresence>
    </AppBar>
  );
};