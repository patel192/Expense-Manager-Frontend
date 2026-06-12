import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ================ Material UI Components ================
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Badge from "@mui/material/Badge";

// ================ Icons ================
import { FiBell, FiSearch, FiMenu, FiLogOut, FiSettings } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { AdminSidebar } from "./AdminSidebar";

export const AdminDashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <Box 
      sx={{ 
        minHeight: "100vh", 
        bgcolor: "background.default", 
        color: "text.primary",
        fontFamily: "sans-serif",
        "& ::selection": { bgcolor: "rgba(34, 211, 238, 0.3)" }
      }}
    >
      {/* Sidebar Component */}
      <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Wrapper */}
      <Box
        sx={{
          transition: "all 0.3s ease-in-out",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          pl: {
            xs: 0,
            lg: isSidebarOpen ? "260px" : "80px",
          },
        }}
      >
        {/* ========== MODERN TOP NAVBAR ========== */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            top: 0,
            zIndex: 55,
            height: 80,
            justifyContent: "center",
            bgcolor: "rgba(var(--mui-palette-background-paperChannel), 0.6)",
            backdropFilter: "blur(24px)",
            borderBottom: 1,
            borderColor: "divider",
            px: { xs: 2, sm: 4 },
          }}
        >
          <Toolbar disableGutters sx={{ width: "100%", justifyContent: "space-between", gap: 2 }}>
            
            {/* Left: Mobile Toggle & Breadcrumbs */}
            <Stack direction="row" alignItems="center" spacing={2}>
              <IconButton
                onClick={toggleSidebar}
                sx={{
                  display: { lg: "none" },
                  p: 1,
                  borderRadius: 3,
                  bgcolor: "action.hover",
                  border: 1,
                  borderColor: "divider",
                  "&:hover": { bgcolor: "action.selected" },
                }}
              >
                <FiMenu size={20} style={{ color: "var(--mui-palette-text-secondary)" }} />
              </IconButton>

              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <Typography 
                  variant="body2" 
                  sx={{ fontWeight: 500, color: "text.secondary", textTransform: "capitalize" }}
                >
                  Admin{" "}
                  <Box component="span" sx={{ mx: 1, color: "text.disabled" }}>
                    /
                  </Box>{" "}
                  <Box component="span" sx={{ color: "text.primary" }}>
                    Workspace
                  </Box>
                </Typography>
              </Box>
            </Stack>

            {/* Middle: Search (Desktop) */}
            <Box sx={{ display: { xs: "none", md: "block" }, flex: 1, maxW: 440, mx: 4 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search global records..."
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <FiSearch />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 4,
                    bgcolor: "action.hover",
                    fontSize: "14px",
                    fontWeight: 500,
                  }
                }}
              />
            </Box>

            {/* Right: Actions */}
            <Stack direction="row" alignItems="center" spacing={{ xs: 1, sm: 2 }}>
              {/* Notifications */}
              <IconButton
                sx={{
                  p: 1.25,
                  borderRadius: 3,
                  bgcolor: "action.hover",
                  border: 1,
                  borderColor: "divider",
                  "&:hover": { bgcolor: "action.selected" },
                }}
              >
                <Badge
                  variant="dot"
                  color="cyan"
                  overlap="circular"
                  sx={{
                    "& .MuiBadge-badge": {
                      boxShadow: "0 0 8px rgba(34,211,238,0.5)",
                      border: "2px solid var(--mui-palette-background-paper)",
                    }
                  }}
                >
                  <FiBell size={20} style={{ color: "var(--mui-palette-text-secondary)" }} />
                </Badge>
              </IconButton>

              {/* Settings */}
              <IconButton
                onClick={() => navigate(`/admin/account/${user?._id}`)}
                sx={{
                  p: 1.25,
                  borderRadius: 3,
                  bgcolor: "action.hover",
                  border: 1,
                  borderColor: "divider",
                  "&:hover": { bgcolor: "action.selected" },
                }}
              >
                <FiSettings size={20} style={{ color: "var(--mui-palette-text-secondary)" }} />
              </IconButton>

              {/* Divider */}
              <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: { xs: 0.5, sm: 1 }, height: 24, alignSelf: "center" }} />

              {/* Logout */}
              <Button
                variant="outlined"
                color="error"
                onClick={logout}
                startIcon={<FiLogOut size={16} />}
                sx={{
                  px: { xs: 1.5, sm: 2.5 },
                  py: 1,
                  borderRadius: 3,
                  fontWeight: "bold",
                  fontSize: { xs: "12px", sm: "14px" },
                  textTransform: "none",
                  bgcolor: "rgba(244, 63, 94, 0.1)",
                  borderColor: "rgba(244, 63, 94, 0.2)",
                  color: "error.main",
                  "&:hover": {
                    bgcolor: "error.main",
                    color: "common.white",
                    borderColor: "error.main",
                  }
                }}
              >
                <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                  Sign Out
                </Box>
              </Button>
            </Stack>
          </Toolbar>
        </AppBar>

        {/* ========== DYNAMIC MAIN CONTENT ========== */}
        <Box component="main" sx={{ flex: 1, p: { xs: 2, sm: 4, lg: 5 } }}>
          <Box sx={{ maxWidth: 1600, mx: "auto" }}>
            <AnimatePresence mode="wait">
              <Box
                component={motion.div}
                key={location.pathname}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <Outlet />
              </Box>
            </AnimatePresence>
          </Box>
        </Box>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            py: 3,
            px: { xs: 3, sm: 5 },
            borderTop: 1,
            borderColor: "divider",
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: "medium", letterSpacing: "0.05em", color: "text.secondary" }}>
            © 2026 FINTRACK ANALYTICS ENGINE. ALL RIGHTS RESERVED.
          </Typography>
          <Stack direction="row" spacing={3}>
            {["SUPPORT", "API DOCS", "PRIVACY"].map((linkText) => (
              <Link
                key={linkText}
                href="#"
                underline="none"
                sx={{
                  fontSize: "11px",
                  fontWeight: "medium",
                  color: "text.secondary",
                  transition: "color 0.2s",
                  "&:hover": { color: "cyan.main" },
                }}
              >
                {linkText}
              </Link>
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};