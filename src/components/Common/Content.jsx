import { Link } from "react-router-dom";
import React from "react";
import { motion } from "framer-motion";
import {
  FaWallet,
  FaChartPie,
  FaBullseye,
  FaUserShield,
  FaMoneyBillWave,
  FaPiggyBank,
  FaBalanceScale,
  FaClipboardList,
} from "react-icons/fa";

// Animation Presets
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0 },
};

const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0 },
};

export const Content = () => {
  return (
    <div className="overflow-hidden scroll-smooth">

      {/* ===================== 🌟 HERO ===================== */}
      <section
        id="home"
        className="relative flex flex-col lg:flex-row items-center justify-between gap-12 px-6 py-20 rounded-3xl mx-4 mt-10
        bg-gradient-to-br from-blue-900 via-blue-800 to-gray-900 shadow-2xl border border-white/10 backdrop-blur-xl"
      >
        {/* Glow Decorations */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-cyan-500 opacity-20 blur-2xl rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-56 h-56 bg-blue-500 opacity-25 blur-2xl rounded-full"></div>

        {/* Text Content */}
        <motion.div
          variants={fadeLeft}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.7 }}
          className="max-w-xl z-10"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
            Take Control of{" "}
            <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
              Your Finances
            </span>
          </h1>

          <p className="mt-5 text-lg text-blue-100">
            FinTrack helps you track income, expenses, and budgets with ease —
            bringing clarity to your financial health.
          </p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-wrap gap-4 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Link
              to="/signup"
              className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg hover:scale-105 transition"
            >
              Get Started
            </Link>

            <a
              href="#features"
              className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg hover:scale-105 transition"
            >
              Explore Features
            </a>
          </motion.div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-4 sm:gap-6 text-center">
            {[
              { num: "10K+", label: "Expenses Tracked" },
              { num: "5K+", label: "Active Users" },
              { num: "99.9%", label: "Secure Data" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                transition={{ delay: i * 0.2 }}
                className="backdrop-blur-xl bg-white/10 p-4 rounded-xl border border-white/20 shadow-lg"
              >
                <p className="text-2xl font-bold text-cyan-300">{stat.num}</p>
                <p className="text-sm text-blue-100">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Illustration */}
        <motion.div
          variants={fadeRight}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <motion.img
            src="/download.jpeg"
            alt="Finance Illustration"
            className="rounded-2xl shadow-2xl w-full max-w-md border border-white/20 backdrop-blur-lg"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      </section>

      {/* ===================== ⚡ FEATURES ===================== */}
      <section id="features" className="px-6 py-20">
        <header className="text-center mb-14">
          <h2 className="text-4xl font-bold text-gray-100">Why Choose FinTrack?</h2>
          <p className="text-gray-400 mt-2 max-w-2xl mx-auto">
            Powerful tools crafted to help you master your financial life.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <FaWallet className="text-cyan-400 text-5xl" />,
              title: "Track Income & Expenses",
              desc: "Manage cash flow effortlessly with intelligent categorization.",
            },
            {
              icon: <FaChartPie className="text-cyan-400 text-5xl" />,
              title: "Visual Insights",
              desc: "Interactive charts help you understand spending habits instantly.",
            },
            {
              icon: <FaBullseye className="text-cyan-400 text-5xl" />,
              title: "Plan Budgets",
              desc: "Set goals and monitor them in real time with smart alerts.",
            },
            {
              icon: <FaUserShield className="text-cyan-400 text-5xl" />,
              title: "Secure Platform",
              desc: "End-to-end encryption ensures your financial data stays private.",
            },
          ].map((feature, i) => (
            <motion.article
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="group backdrop-blur-xl bg-white/10 p-6 rounded-xl border border-white/20 shadow-lg 
              hover:bg-white/20 transition relative overflow-hidden"
            >
              {/* Glow Hover Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-cyan-500 blur-xl transition"></div>

              <div className="relative z-10">
                {feature.icon}
                <h3 className="mt-4 text-xl font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-gray-200">{feature.desc}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ===================== 📊 DASHBOARD OVERVIEW ===================== */}
      <section
        id="dashboard"
        className="px-6 py-20 bg-gradient-to-br from-gray-900 to-gray-950"
      >
        <header className="text-center mb-10">
          <h2 className="text-4xl font-bold text-white">Dashboard Overview</h2>
          <p className="text-gray-400 mt-2 max-w-2xl mx-auto">
            Your personal finance control center — insights made simple.
          </p>
        </header>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.6 }}
          className="backdrop-blur-xl bg-white/10 p-10 rounded-2xl border border-white/20 shadow-lg text-center text-white max-w-4xl mx-auto"
        >
          <p className="text-lg text-gray-200">
            Monitor all your financial activity in one place. Visual summaries,
            charts, budgets, and more — instantly accessible.
          </p>

          <Link
            to="/"
            className="inline-block mt-6 px-8 py-3 bg-cyan-600 rounded-lg hover:bg-cyan-700 transition shadow-md"
          >
            Go to Dashboard
          </Link>
        </motion.div>
      </section>

      {/* ===================== 💰 INCOME ===================== */}
      <section id="income" className="px-6 py-20">
        <header className="text-center mb-10">
          <h2 className="text-4xl font-bold text-white">Income Management</h2>
          <p className="text-gray-400 mt-2 max-w-2xl mx-auto">
            Track all your earnings and understand how they support your goals.
          </p>
        </header>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.6 }}
          className="backdrop-blur-xl bg-white/10 p-10 rounded-2xl border border-white/20 shadow-lg text-center text-white max-w-4xl mx-auto"
        >
          <FaMoneyBillWave className="text-green-400 text-5xl mx-auto mb-4" />

          <p className="text-lg text-gray-200">
            Track salary, freelance income, investments, and more with ease.
          </p>

          <Link
            to="/income"
            className="inline-block mt-6 px-8 py-3 bg-green-600 rounded-lg hover:bg-green-700 transition"
          >
            Manage Income
          </Link>
        </motion.div>
      </section>

      {/* ===================== 💸 EXPENSES ===================== */}
      <section id="expenses" className="px-6 py-20 bg-gradient-to-br from-gray-900 to-gray-950">
        <header className="text-center mb-10">
          <h2 className="text-4xl font-bold text-white">Expense Tracking</h2>
          <p className="text-gray-400 mt-2 max-w-2xl mx-auto">
            Track your daily spending and understand where your money goes.
          </p>
        </header>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.6 }}
          className="backdrop-blur-xl bg-white/10 p-10 rounded-2xl border border-white/20 shadow-lg text-center text-white max-w-4xl mx-auto"
        >
          <FaPiggyBank className="text-pink-400 text-5xl mx-auto mb-4" />

          <p className="text-lg text-gray-200">
            Categorize spending, track patterns, and get meaningful insights.
          </p>

          <Link
            to="/expenses"
            className="inline-block mt-6 px-8 py-3 bg-pink-600 rounded-lg hover:bg-pink-700 transition"
          >
            Track Expenses
          </Link>
        </motion.div>
      </section>

      {/* ===================== 🎯 BUDGETS ===================== */}
      <section id="budgets" className="px-6 py-20">
        <header className="text-center mb-10">
          <h2 className="text-4xl font-bold text-white">Budget Planning</h2>
          <p className="text-gray-400 mt-2 max-w-2xl mx-auto">
            Set spending limits and stay aligned with your financial goals.
          </p>
        </header>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.6 }}
          className="backdrop-blur-xl bg-white/10 p-10 rounded-2xl border border-white/20 shadow-lg text-center text-white max-w-4xl mx-auto"
        >
          <FaBalanceScale className="text-blue-400 text-5xl mx-auto mb-4" />

          <p className="text-lg text-gray-200">
            Budget by category and monitor progress using smart analytics.
          </p>

          <Link
            to="/budgets"
            className="inline-block mt-6 px-8 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          >
            Create Budget
          </Link>
        </motion.div>
      </section>

      {/* ===================== 📈 REPORTS ===================== */}
      <section id="reports" className="px-6 py-20 bg-gradient-to-br from-gray-900 to-gray-950">
        <header className="text-center mb-10">
          <h2 className="text-4xl font-bold text-white">Reports & Insights</h2>
          <p className="text-gray-400 mt-2 max-w-2xl mx-auto">
            Discover meaningful insights through detailed visual reports.
          </p>
        </header>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.6 }}
          className="backdrop-blur-xl bg-white/10 p-10 rounded-2xl border border-white/20 shadow-lg text-center text-white max-w-4xl mx-auto"
        >
          <FaClipboardList className="text-purple-400 text-5xl mx-auto mb-4" />

          <p className="text-lg text-gray-200">
            Visualize your spending habits & financial journey with clarity.
          </p>

          <Link
            to="/reports"
            className="inline-block mt-6 px-8 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition"
          >
            View Reports
          </Link>
        </motion.div>
      </section>
    </div>
  );
};
