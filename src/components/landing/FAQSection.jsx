import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";

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
  const [active, setActive] = useState(null);

  const toggle = (index) => {
    setActive(active === index ? null : index);
  };

  return (
    <section className="py-20 space-y-10">

      {/* Header */}
      <div className="text-center space-y-2">
        <p className="text-xs uppercase tracking-widest text-cyan-500 font-medium">
          FAQ
        </p>

        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text)]">
          Frequently asked questions
        </h2>

        <p className="text-[var(--muted)] max-w-xl mx-auto text-sm">
          Everything you need to know about using FinTrack.
        </p>
      </div>

      {/* FAQ List */}
      <div className="max-w-2xl mx-auto space-y-3">

        {faqs.map((faq, index) => (
          <div
            key={index}
            className="
              border
              border-[var(--border)]
              rounded-xl
              bg-[var(--surface-primary)]
              overflow-hidden
            "
          >

            {/* Question */}
            <button
              onClick={() => toggle(index)}
              className="
                w-full
                flex
                items-center
                justify-between
                px-5
                py-4
                text-left
                font-medium
                text-[var(--text)]
                hover:bg-[var(--surface-secondary)]
                transition
              "
            >
              {faq.question}

              <FiChevronDown
                size={18}
                className={`
                  transition-transform
                  ${active === index ? "rotate-180" : ""}
                `}
              />
            </button>

            {/* Answer */}
            <AnimatePresence>
              {active === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="
                    px-5
                    pb-4
                    text-sm
                    text-[var(--text-secondary)]
                  "
                >
                  {faq.answer}
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        ))}

      </div>

    </section>
  );
};