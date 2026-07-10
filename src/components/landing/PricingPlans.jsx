import React from "react";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { FiCheck } from "react-icons/fi";
import { Link as RouterLink } from "react-router-dom";

// ================ Material UI Components ================
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    highlight: false,
    features: [
      "Track income & expenses",
      "Basic reports",
      "Budget management",
      "Secure data storage",
    ],
  },
  {
    name: "Pro",
    price: "₹199",
    period: "per month",
    highlight: true,
    features: [
      "Advanced reports",
      "Recurring transactions",
      "Export to Excel / CSV",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "pricing",
    highlight: false,
    features: [
      "Team accounts",
      "Role-based access",
      "Custom integrations",
      "Dedicated support",
    ],
  },
];

export const PricingPlans = () => {
  return (
    <Container component="section" sx={{ py: 10 }}>
      {/* Header */}
      <Stack spacing={1.5} alignItems="center" textAlign="center" sx={{ mb: 8 }}>
        <Typography
          variant="caption"
          sx={{
            fontWeight: "bold",
            color: "cyan.main",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          Pricing
        </Typography>

        <Typography variant="h4" component="h2" sx={{ fontWeight: "bold" }}>
          Simple, transparent pricing
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 500 }}>
          Start for free and upgrade as your financial tracking needs grow.
        </Typography>
      </Stack>

      {/* Plans */}
      <Grid container spacing={4} alignItems="center" justifyContent="center">
        <LazyMotion features={domAnimation}>
        {plans.map((plan, i) => (
          <Grid size={{ xs: 12, md: 4 }} key={`plan-${plan.name.toLowerCase()}`}>
            <Card
              component={m.div}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              sx={{
                position: "relative",
                borderRadius: 5,
                border: 2,
                borderColor: plan.highlight ? "cyan.main" : "divider",
                boxShadow: plan.highlight ? 4 : 1,
                bgcolor: "background.paper",
                transform: plan.highlight ? { md: "scale(1.05)" } : "none",
                zIndex: plan.highlight ? 2 : 1,
              }}
            >
              {/* Badge */}
              {plan.highlight && (
                <Chip
                  label="Most Popular"
                  color="info"
                  sx={{
                    position: "absolute",
                    top: -14,
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontWeight: "bold",
                    color: "white",
                    background: "linear-gradient(to right, #00acc1, #1976d2)",
                  }}
                />
              )}

              <CardContent sx={{ p: 4 }}>
                <Stack spacing={4}>
                  {/* Name & Pricing */}
                  <Box textAlign="center">
                    <Typography variant="h6" sx={{ fontWeight: "bold", color: "text.primary" }}>
                      {plan.name}
                    </Typography>

                    <Typography variant="h3" sx={{ fontWeight: "extrabold", color: "cyan.main", my: 1.5 }}>
                      {plan.price}
                    </Typography>

                    <Typography variant="caption" color="text.secondary">
                      {plan.period}
                    </Typography>
                  </Box>

                  {/* Features */}
                  <Stack spacing={1.5}>
                    {plan.features.map((feature) => (
                      <Stack key={`${plan.name.toLowerCase()}-${feature.replace(/\s+/g, "-")}`} direction="row" spacing={1.5} alignItems="center">
                        <FiCheck style={{ color: "var(--mui-palette-success-main)" }} />
                        <Typography variant="body2" color="text.secondary">
                          {feature}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>

                  {/* Button */}
                  <Button
                    component={RouterLink}
                    to="/signup"
                    fullWidth
                    variant="contained"
                    sx={{
                      py: 1.5,
                      borderRadius: 3,
                      fontWeight: "bold",
                      textTransform: "none",
                      background: "linear-gradient(to right, #00acc1, #1976d2)",
                      color: "white",
                      "&:hover": {
                        opacity: 0.9,
                      },
                    }}
                  >
                    Get Started
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
        </LazyMotion>
      </Grid>
    </Container>
  );
};
