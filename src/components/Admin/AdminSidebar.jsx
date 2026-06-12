import { Link as RouterLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// ================ Material UI Components ================
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Backdrop from "@mui/material/Backdrop";

// ================ Icons ================
import {
  FiLayout,
  FiUsers,
  FiGrid,
  FiShield,
  FiFileText,
  FiActivity,
  FiUser,
  FiX,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

export const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  const { user } = useAuth();
  const userId = user?._id || user?.id || "unknown";
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard", path: "/admin/admindashboard", icon: <FiLayout /> },
    { label: "Manage Users", path: "/admin/manageusers", icon: <FiUsers /> },
    { label: "Categories", path: "/admin/managecategories", icon: <FiGrid /> },
    { label: "Access Control", path: "/admin/accesscontrol", icon: <FiShield /> },
    { label: "Reports", path: "/admin/reportadmins", icon: <FiFileText /> },
    { label: "System Logs", path: "/admin/systemlogs", icon: <FiActivity /> },
    { label: "My Account", path: `/admin/account/${userId}`, icon: <FiUser /> },
  ];

  const drawerWidth = isOpen ? 260 : 80;

  return (
    <>
      {/* Mobile Overlay Backdrop */}
      <Backdrop
        open={isOpen}
        onClick={toggleSidebar}
        sx={{
          zIndex: 60,
          bgcolor: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(4px)",
          display: { lg: "none" },
        }}
      />

      {/* Sidebar Container */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          zIndex: 70,
          display: {
            xs: isOpen ? "block" : "none",
            lg: "block",
          },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            height: "100vh",
            position: "fixed",
            top: 0,
            left: 0,
            bgcolor: "rgba(var(--mui-palette-background-defaultChannel), 0.8)",
            backdropFilter: "blur(24px)",
            borderRight: 1,
            borderColor: "divider",
            display: "flex",
            flexDirection: "column",
            transition: (theme) => theme.transitions.create(["width", "box-shadow"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            boxShadow: isOpen ? "0px 25px 50px -12px rgba(34, 211, 238, 0.05)" : "none",
            overflowX: "hidden",
          },
        }}
      >
        {/* Header / Logo */}
        <Box
          sx={{
            height: 80,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 3,
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <Stack
                component={motion.div}
                key="logo-full"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                direction="row"
                alignItems="center"
                spacing={1.5}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 3,
                    background: "linear-gradient(135deg, #22d3ee, #2563eb)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 12px rgba(34, 211, 238, 0.2)",
                  }}
                >
                  <FiShield size={18} style={{ color: "#fff" }} />
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1.125rem",
                    letterSpacing: "-0.025em",
                    background: "linear-gradient(to right, var(--mui-palette-text-primary), var(--mui-palette-text-disabled))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  FinTrack{" "}
                  <Box component="span" sx={{ color: "cyan.main" }}>
                    Admin
                  </Box>
                </Typography>
              </Stack>
            ) : (
              <Box
                component={motion.div}
                key="logo-icon"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                sx={{ mx: "auto" }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 3,
                    background: "linear-gradient(135deg, #22d3ee, #2563eb)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 12px rgba(34, 211, 238, 0.2)",
                  }}
                >
                  <FiShield size={20} style={{ color: "#fff" }} />
                </Box>
              </Box>
            )}
          </AnimatePresence>

          {/* Mobile Close Button */}
          <IconButton
            onClick={toggleSidebar}
            sx={{ display: { lg: "none" }, color: "text.secondary", "&:hover": { color: "text.primary" } }}
          >
            <FiX size={20} />
          </IconButton>
        </Box>

        {/* Navigation List */}
        <List
          sx={{
            flex: 1,
            overflowY: "auto",
            py: 3,
            px: 1.5,
            spaceY: 1,
            scrollbarWidth: "thin",
            "&::-webkit-scrollbar": { width: 4 },
            "&::-webkit-scrollbar-track": { bgcolor: "transparent" },
            "&::-webkit-scrollbar-thumb": { bgcolor: "action.hover", borderRadius: 10 },
          }}
        >
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={RouterLink}
                  to={item.path}
                  onClick={{ xs: toggleSidebar, lg: undefined }}
                  sx={{
                    px: 2,
                    py: 1.5,
                    borderRadius: 3,
                    transition: "all 0.2s",
                    background: isActive
                      ? "linear-gradient(to right, rgba(34, 211, 238, 0.15), rgba(37, 99, 235, 0.05))"
                      : "transparent",
                    border: isActive ? "1px solid rgba(34, 211, 238, 0.25)" : "1px solid transparent",
                    color: isActive ? "text.primary" : "text.secondary",
                    "&:hover": {
                      bgcolor: isActive ? "none" : "action.hover",
                      color: "text.primary",
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: isOpen ? 2 : "auto",
                      justifyContent: "center",
                      fontSize: "1.25rem",
                      color: isActive ? "cyan.main" : "text.secondary",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>

                  {isOpen && (
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontSize: "14px",
                        fontWeight: isActive ? 600 : 500,
                      }}
                    />
                  )}

                  {isActive && isOpen && (
                    <Box
                      component={motion.div}
                      layoutId="active-pill"
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        bgcolor: "cyan.main",
                        boxShadow: "0 0 8px rgba(34, 211, 238, 0.6)",
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        {/* Footer / User Hub Profile Info */}
        <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{
              p: 1,
              borderRadius: 4,
              bgcolor: "action.hover",
              border: 1,
              borderColor: "divider",
              justifyContent: isOpen ? "flex-start" : "center",
            }}
          >
            <Avatar
              sx={{
                width: 40,
                height: 40,
                borderRadius: 3,
                background: "linear-gradient(135deg, #0891b2, #7e22ce)",
                fontSize: "14px",
                fontWeight: "bold",
                boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)",
              }}
            >
              {user?.name?.charAt(0).toUpperCase() || "A"}
            </Avatar>
            
            {isOpen && (
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary", noWrap: true }}>
                  {user?.name || "Admin"}
                </Typography>
                <Typography variant="caption" sx={{ fontSize: "10px", color: "cyan.main", fontWeight: "medium", tracking: "wider" }}>
                  SYSTEM ADMINISTRATOR
                </Typography>
              </Box>
            )}
          </Stack>

          {isOpen && (
            <Box sx={{ mt: 2, px: 1 }}>
              <Typography variant="caption" display="block" align="center" sx={{ fontSize: "10px", color: "text.disabled" }}>
                © 2026 FinTrack • v2.4.0
              </Typography>
            </Box>
          )}
        </Box>

        {/* Desktop Toggle Slider Trigger Button */}
        <IconButton
          onClick={toggleSidebar}
          sx={{
            display: { xs: "none", lg: "flex" },
            position: "absolute",
            top: "50%",
            right: -12,
            transform: "translateY(-50%)",
            width: 24,
            height: 24,
            bgcolor: "cyan.main",
            border: 1,
            borderColor: "divider",
            boxShadow: "0px 4px 10px rgba(34, 211, 238, 0.3)",
            zIndex: 80,
            "&:hover": { bgcolor: "cyan.dark" },
          }}
        >
          {isOpen ? <FiChevronLeft size={14} style={{ color: "#fff" }} /> : <FiChevronRight size={14} style={{ color: "#fff" }} />}
        </IconButton>
      </Drawer>
    </>
  );
};