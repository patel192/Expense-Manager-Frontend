import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "./components/Utils/axiosInstance";
import { motion } from "framer-motion";

// ================ Material UI Components ================
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";

// ================ Icons ================
import {
  FiUser,
  FiCalendar,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiCheckCircle,
  FiShield,
  FiTrendingUp,
  FiPieChart,
} from "react-icons/fi";

/**
 * --- SIGNUP COMPONENT ---
 * Allows new users to create an account. Defaults all new registrations to 'User' role.
 */

export const Signup = () => {
  const { isLoading } = useSelector((state) => state.ui);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // --- ACCOUNT CREATION LOGIC ---
  const submitHandler = async (data) => {
    try {
      // We hardcode the role to "User" so new signups don't accidentally get admin rights
      const res = await axiosInstance.post("/user", { ...data, role: "User" });

      if (res.status === 201) {
        toast.success("Account created! Redirecting to login...", {
          position: "top-center",
          autoClose: 2000,
        });

        // Give the user a moment to read the success message before switching pages
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      // Show whatever error the server returned (e.g. "Email already exists")
      toast.error(
        error.response?.data?.message || "Signup failed. Please try again.",
        { position: "top-center", autoClose: 3000 },
      );
    }
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 80px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
        bgcolor: "background.default",
        color: "text.primary",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <ToastContainer transition={Bounce} theme="dark" />

      {/* Background glow orbs */}
      <Box
        sx={{
          position: "absolute",
          top: -160,
          left: -160,
          width: 500,
          height: 500,
          borderRadius: "50%",
          bgcolor: "cyan.main",
          opacity: 0.05,
          filter: "blur(120px)",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -160,
          right: -160,
          width: 500,
          height: 500,
          borderRadius: "50%",
          bgcolor: "primary.main",
          opacity: 0.05,
          filter: "blur(120px)",
          pointerEvents: "none",
        }}
      />

      <Paper
        component={motion.div}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        elevation={6}
        sx={{
          width: "100%",
          maxWidth: 1000,
          borderRadius: 8,
          overflow: "hidden",
          border: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Grid container>
          {/* ── LEFT: Decorative Panel ── */}
          <Grid
            size={{ xs: 0, lg: 6 }}
            sx={{
              display: { xs: "none", lg: "flex" },
              flexDirection: "column",
              justifyContent: "space-between",
              bgcolor: "action.hover",
              borderRight: 1,
              borderColor: "divider",
              p: 6,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(135deg, rgba(6, 182, 212, 0.03) 0%, rgba(59, 130, 246, 0.03) 100%)",
                pointerEvents: "none",
              }}
            />

            {/* Brand */}
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ zIndex: 1 }}>
              <Avatar
                sx={{
                  bgcolor: "cyan.main",
                  width: 40,
                  height: 40,
                  borderRadius: 3,
                  boxShadow: "0 8px 16px 0 rgba(6, 182, 212, 0.2)",
                }}
              >
                <FiTrendingUp style={{ color: "white" }} />
              </Avatar>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  background: "linear-gradient(to right, #06b6d4, #3b82f6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: "-0.02em",
                }}
              >
                FinTrack
              </Typography>
            </Stack>

            {/* Middle content */}
            <Stack spacing={4} sx={{ zIndex: 1, my: 4 }}>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: "bold", lineHeight: 1.15, letterSpacing: "-0.03em" }}>
                  Join the <br />
                  <Box component="span" sx={{ color: "cyan.main" }}>
                    Revolution.
                  </Box>
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 2, maxW: 360, lineHeight: 1.6 }}>
                  Start tracking income, expenses, and budgets with the world's most elegant dashboard.
                </Typography>
              </Box>

              {/* Feature list */}
              <Stack spacing={2.5}>
                {[
                  {
                    icon: <FiTrendingUp size={16} />,
                    text: "Real-time income monitoring",
                    color: "success.main",
                    bg: "rgba(16, 185, 129, 0.1)",
                    border: "rgba(16, 185, 129, 0.2)",
                  },
                  {
                    icon: <FiPieChart size={16} />,
                    text: "Automated financial reporting",
                    color: "cyan.main",
                    bg: "rgba(6, 182, 212, 0.1)",
                    border: "rgba(6, 182, 212, 0.2)",
                  },
                  {
                    icon: <FiShield size={16} />,
                    text: "Military-grade data protection",
                    color: "primary.main",
                    bg: "rgba(59, 130, 246, 0.1)",
                    border: "rgba(59, 130, 246, 0.2)",
                  },
                ].map((item, i) => (
                  <Stack key={i} direction="row" spacing={2} alignItems="center">
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 3,
                        bgcolor: item.bg,
                        color: item.color,
                        border: 1,
                        borderColor: item.border,
                      }}
                    >
                      {item.icon}
                    </Avatar>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: "text.secondary" }}>
                      {item.text}
                    </Typography>
                  </Stack>
                ))}
              </Stack>

              {/* Mini stat pills */}
              <Grid container spacing={2}>
                {[
                  { label: "Free", sublabel: "For Lifetime" },
                  { label: "Private", sublabel: "Zero Tracking" },
                ].map((s, i) => (
                  <Grid size={6} key={i}>
                    <Box
                      sx={{
                        bgcolor: "background.paper",
                        border: 1,
                        borderColor: "divider",
                        borderRadius: 4,
                        p: 2,
                        textAlign: "center",
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                        {s.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block", textTransform: "uppercase", fontSize: "9px", fontWeight: "bold", mt: 0.5 }}>
                        {s.sublabel}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Stack>

            {/* Footer note */}
            <Typography variant="caption" color="text.secondary" sx={{ zIndex: 1, display: "flex", alignItems: "center", gap: 1 }}>
              <FiCheckCircle style={{ color: "var(--mui-palette-success-main)" }} /> © 2025 FinTrack. Always for you.
            </Typography>
          </Grid>

          {/* ── RIGHT: Form Panel ── */}
          <Grid size={{ xs: 12, lg: 6 }} sx={{ p: { xs: 4, sm: 6 }, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            {/* Mobile brand header */}
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              justifyContent="center"
              sx={{ display: { xs: "flex", lg: "none" }, mb: 4 }}
            >
              <Avatar
                sx={{
                  bgcolor: "cyan.main",
                  width: 40,
                  height: 40,
                  borderRadius: 3,
                }}
              >
                <FiTrendingUp style={{ color: "white" }} />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                FinTrack
              </Typography>
            </Stack>

            {/* Form header */}
            <Box sx={{ mb: 4, textAlign: { xs: "center", lg: "left" } }}>
              <Typography variant="h4" sx={{ fontWeight: "bold", letterSpacing: "-0.02em" }}>
                Create account
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Join us and take control of your wealth.
              </Typography>
            </Box>

            <Stack component="form" onSubmit={handleSubmit(submitHandler)} spacing={3} noValidate>
              <Grid container spacing={2}>
                {/* Full Name */}
                <Grid size={{ xs: 12, sm: 8 }}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    type="text"
                    placeholder="John Doe"
                    variant="outlined"
                    required
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    {...register("name", { required: "Name is required" })}
                    slotProps={{
                      inputLabel: { shrink: true },
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <FiUser />
                          </InputAdornment>
                        ),
                      }
                    }}
                  />
                </Grid>

                {/* Age */}
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    label="Age"
                    type="number"
                    placeholder="25"
                    variant="outlined"
                    required
                    error={!!errors.age}
                    helperText={errors.age?.type === "min" ? "Must be 18+" : errors.age?.message}
                    {...register("age", { required: "Age is required", min: 18 })}
                    slotProps={{
                      inputLabel: { shrink: true },
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <FiCalendar />
                          </InputAdornment>
                        ),
                      }
                    }}
                  />
                </Grid>
              </Grid>

              {/* Email */}
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                variant="outlined"
                required
                error={!!errors.email}
                helperText={errors.email?.message}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                slotProps={{
                  inputLabel: { shrink: true },
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <FiMail />
                      </InputAdornment>
                    ),
                  }
                }}
              />

              {/* Password */}
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 characters"
                variant="outlined"
                required
                error={!!errors.password}
                helperText={errors.password?.message}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Min. 8 characters required",
                  },
                })}
                slotProps={{
                  inputLabel: { shrink: true },
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <FiLock />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <FiEyeOff /> : <FiEye />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }
                }}
              />

              {/* Submit */}
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
                sx={{
                  py: 1.75,
                  borderRadius: 3,
                  fontWeight: "bold",
                  textTransform: "none",
                  fontSize: "0.95rem",
                  background: "linear-gradient(to right, var(--mui-palette-cyan-main, #00acc1), var(--mui-palette-primary-main, #1976d2))",
                  color: "white",
                  display: "flex",
                  gap: 1.5,
                  boxShadow: "0 8px 24px rgba(6, 182, 212, 0.2)",
                  mt: 1,
                }}
              >
                {isLoading ? (
                  <>
                    <CircularProgress size={20} sx={{ color: "white" }} />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <FiArrowRight size={18} />
                  </>
                )}
              </Button>
            </Stack>

            {/* Divider */}
            <Stack direction="row" alignItems="center" spacing={2} sx={{ my: 4 }}>
              <Box sx={{ flex: 1, h: "1px", bgcolor: "divider" }} />
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", fontSize: "9px", fontWeight: "bold", letterSpacing: "0.15em" }}>
                Join Today
              </Typography>
              <Box sx={{ flex: 1, h: "1px", bgcolor: "divider" }} />
            </Stack>

            {/* Login redirect */}
            <Typography variant="body2" color="text.secondary" align="center">
              Already have an account?{" "}
              <Link
                component={RouterLink}
                to="/login"
                color="cyan.main"
                sx={{ fontWeight: "bold", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
              >
                Sign in
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

