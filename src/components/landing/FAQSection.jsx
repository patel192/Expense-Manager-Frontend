import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

// ================ Material UI Components ================
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Stack from "@mui/material/Stack";

const faqs = [
  {
    question: "Is FinTrack free to use?",
    answer:
      "Yes. You can start using FinTrack completely free. Future premium features may be optional.",
  },
  {
    question: "Is my financial data secure?",
    answer:
      "Your data is encrypted and stored securely. We prioritize privacy and never share personal financial information.",
  },
  {
    question: "Can I export my data?",
    answer:
      "Yes. You can export reports and transactions in formats like CSV or Excel anytime.",
  },
  {
    question: "Does FinTrack work on mobile devices?",
    answer:
      "Yes. FinTrack is fully responsive and works smoothly on phones, tablets, and desktops.",
  },
];

export const FAQSection = () => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Container component="section" sx={{ py: 10 }}>
      {/* Header */}
      <Stack spacing={1.5} alignItems="center" textAlign="center" sx={{ mb: 6 }}>
        <Typography
          variant="caption"
          sx={{
            fontWeight: "bold",
            color: "cyan.main",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          FAQ
        </Typography>

        <Typography variant="h4" component="h2" sx={{ fontWeight: "bold" }}>
          Frequently asked questions
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ maxW: 500 }}>
          Everything you need to know about using FinTrack.
        </Typography>
      </Stack>

      {/* FAQ List */}
      <Box sx={{ maxW: 700, mx: "auto" }}>
        {faqs.map((faq, index) => (
          <Accordion
            key={`${faq.question}`}
            expanded={expanded === index}
            onChange={handleChange(index)}
            sx={{
              bgcolor: "background.paper",
              border: 1,
              borderColor: "divider",
              borderRadius: "12px !important",
              mb: 1.5,
              "&:before": {
                display: "none",
              },
              boxShadow: 1,
            }}
          >
            <AccordionSummary
              expandIcon={<FiChevronDown />}
              sx={{
                fontWeight: "bold",
                color: expanded === index ? "cyan.main" : "text.primary",
                py: 1,
                px: 3,
                borderRadius: "12px",
                "&.Mui-expanded": {
                  minHeight: 48,
                },
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                {faq.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 3, pb: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Container>
  );
};
