import { Outlet, Link as RouterLink } from "react-router-dom";
import { logout } from "../Utils/Logout";

// ================ Material UI Components ================
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";

// ================ Icons ================
import {
  FaTwitter,
  FaFacebookF,
  FaSnapchatGhost,
  FaInstagram,
  FaMediumM,
} from "react-icons/fa";

export const AdminNavbar = () => {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", color: "text.primary" }}>
      
      {/* Navbar */}
      <AppBar
        position="sticky"
        elevation={2}
        sx={{
          top: 0,
          zIndex: (theme) => theme.zIndex.appBar,
          bgcolor: "rgba(var(--mui-palette-background-paperChannel), 0.8)",
          backdropFilter: "blur(8px)",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            disableGutters
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: "center",
              py: { xs: 1.5, sm: 2 },
              gap: { xs: 2, sm: 0 },
            }}
          >
            {/* Logo */}
            <Link
              component={RouterLink}
              to="/"
              underline="none"
              sx={{
                fontSize: { xs: "1.125rem", sm: "1.5rem", md: "1.875rem" },
                fontWeight: "bold",
                background: "linear-gradient(to right, #60a5fa, #a855f7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                transition: "transform 0.2s",
                textAlign: { xs: "center", sm: "left" },
                "&:hover": { transform: "scale(1.05)" },
              }}
            >
              Trackit | Expense App
            </Link>

            {/* Right Side Actions */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems="center"
              spacing={{ xs: 1.5, sm: 2, md: 3 }}
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              {/* Logout Button */}
              <Button
                fullWidth={{ xs: true, sm: false }}
                onClick={logout}
                variant="contained"
                sx={{
                  px: { xs: 2, md: 3 },
                  py: { xs: 1, md: 1.25 },
                  borderRadius: 2,
                  fontWeight: "bold",
                  textTransform: "none",
                  background: "linear-gradient(to right, #ef4444, #ec4899)",
                  boxShadow: "0 4px 14px 0 rgba(239, 68, 68, 0.4)",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0 6px 20px 0 rgba(239, 68, 68, 0.6)",
                    background: "linear-gradient(to right, #ef4444, #ec4899)",
                  },
                }}
              >
                Logout
              </Button>

              {/* Social Media Connections */}
              <Stack
                direction="row"
                flexWrap="wrap"
                justifyContent={{ xs: "center", sm: "flex-start" }}
                spacing={{ xs: 1, sm: 1.5 }}
              >
                {[
                  { icon: <FaTwitter />, color: "#60a5fa" },
                  { icon: <FaFacebookF />, color: "#2563eb" },
                  { icon: <FaSnapchatGhost />, color: "#facc15" },
                  { icon: <FaInstagram />, color: "#ec4899" },
                  { icon: <FaMediumM />, color: "#4ade80" },
                ].map((social, idx) => (
                  <IconButton
                    key={idx}
                    href="#"
                    sx={{
                      fontSize: { xs: "1.125rem", sm: "1.25rem", md: "1.5rem" },
                      color: "text.secondary",
                      transition: "all 0.2s",
                      "&:hover": {
                        color: social.color,
                        transform: "scale(1.1)",
                        bgcolor: "action.hover",
                      },
                    }}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Stack>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main Content Area */}
      <Container
        component="main"
        maxWidth="lg"
        sx={{ py: { xs: 2, sm: 3, md: 4 } }}
      >
        <Outlet />
      </Container>
    </Box>
  );
};