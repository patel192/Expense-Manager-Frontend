import React from "react";
import { motion } from "framer-motion";
import { FiStar } from "react-icons/fi";

// ================ Material UI Components ================
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";

const testimonials = [
  {
    name: "Rahul Patel",
    role: "Freelance Developer",
    text: "FinTrack helped me finally understand where my money goes every month.",
  },
  {
    name: "Neha Shah",
    role: "Small Business Owner",
    text: "I track expenses daily now. The dashboard is simple and very clear.",
  },
  {
    name: "Amit Verma",
    role: "Student",
    text: "Budget planning became easy. I save more because I see everything in one place.",
  },
];

export const Testimonials = () => {
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
          Testimonials
        </Typography>

        <Typography variant="h4" component="h2" sx={{ fontWeight: "bold" }}>
          Trusted by people managing their finances
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 500 }}>
          Real users sharing how FinTrack helps them stay in control of their money.
        </Typography>
      </Stack>

      {/* Cards */}
      <Grid container spacing={4}>
        {testimonials.map((t, idx) => (
          <Grid size={{ xs: 12, md: 4 }} key={t.name || idx}>
            <Card
              component={motion.div}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.1 }}
              sx={{
                bgcolor: "background.paper",
                border: 1,
                borderColor: "divider",
                borderRadius: 4,
                boxShadow: 1,
                height: "100%",
              }}
            >
              <CardContent sx={{ p: 4, display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", boxSizing: "border-box" }}>
                <Stack spacing={3} sx={{ height: "100%" }}>
                  {/* Stars */}
                  <Stack direction="row" spacing={0.5} sx={{ color: "warning.main" }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FiStar key={star} size={14} />
                    ))}
                  </Stack>

                  {/* Text */}
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic", flexGrow: 1, lineHeight: 1.6 }}>
                    "{t.text}"
                  </Typography>

                  {/* User */}
                  <Box sx={{ pt: 2, borderTop: 1, borderColor: "divider" }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                      {t.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t.role}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
