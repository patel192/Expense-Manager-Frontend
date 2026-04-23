import React from "react";
import { motion } from "framer-motion";
import { FiStar } from "react-icons/fi";

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
    <section className="py-20 space-y-10">

      {/* Header */}
      <div className="text-center space-y-2">
        <p className="text-xs uppercase tracking-widest text-cyan-500 font-medium">
          Testimonials
        </p>

        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text)]">
          Trusted by people managing their finances
        </h2>

        <p className="text-[var(--muted)] max-w-xl mx-auto text-sm">
          Real users sharing how FinTrack helps them stay in control of their money.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.08 }}
            className="
              bg-[var(--surface-primary)]
              border
              border-[var(--border)]
              rounded-2xl
              p-6
              shadow-sm
              hover:shadow-md
              transition
              space-y-4
            "
          >
            {/* Stars */}
            <div className="flex gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <FiStar key={star} size={14} />
              ))}
            </div>

            {/* Text */}
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              "{t.text}"
            </p>

            {/* User */}
            <div className="pt-2 border-t border-[var(--border)]">
              <p className="text-sm font-semibold text-[var(--text)]">
                {t.name}
              </p>
              <p className="text-xs text-[var(--muted)]">
                {t.role}
              </p>
            </div>

          </motion.div>
        ))}

      </div>

    </section>
  );
};