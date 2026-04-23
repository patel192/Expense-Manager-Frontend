import React from "react";
import { motion } from "framer-motion";
import { FiCheck } from "react-icons/fi";
import { Link } from "react-router-dom";

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
    <section className="py-20 space-y-10">

      {/* Header */}
      <div className="text-center space-y-2">
        <p className="text-xs uppercase tracking-widest text-cyan-500 font-medium">
          Pricing
        </p>

        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text)]">
          Simple, transparent pricing
        </h2>

        <p className="text-[var(--muted)] max-w-xl mx-auto text-sm">
          Start for free and upgrade as your financial tracking needs grow.
        </p>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {plans.map((plan, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.08 }}
            className={`
              relative
              rounded-2xl
              border
              p-6
              space-y-5
              transition
              ${
                plan.highlight
                  ? "border-cyan-500 shadow-lg scale-105"
                  : "border-[var(--border)] shadow-sm"
              }
              bg-[var(--surface-primary)]
            `}
          >

            {/* Badge */}
            {plan.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-medium bg-cyan-500 text-white rounded-full">
                Most Popular
              </div>
            )}

            {/* Name */}
            <div className="text-center space-y-1">
              <p className="text-lg font-semibold text-[var(--text)]">
                {plan.name}
              </p>

              <p className="text-3xl font-bold text-cyan-400">
                {plan.price}
              </p>

              <p className="text-xs text-[var(--muted)]">
                {plan.period}
              </p>
            </div>

            {/* Features */}
            <div className="space-y-2">

              {plan.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-sm text-[var(--text-secondary)]"
                >
                  <FiCheck size={14} className="text-emerald-400" />
                  {feature}
                </div>
              ))}

            </div>

            {/* Button */}
            <Link
              to="/signup"
              className="
                block
                w-full
                text-center
                py-3
                rounded-xl
                bg-gradient-to-r
                from-cyan-500
                to-blue-600
                text-white
                font-medium
                hover:opacity-90
                transition
              "
            >
              Get Started
            </Link>

          </motion.div>
        ))}

      </div>

    </section>
  );
};