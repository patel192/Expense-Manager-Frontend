import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export const Content = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] pb-16 space-y-20">
      {/* ================= HERO ================= */}
      <section
        id="home"
        className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mt-10"
      >
        {/* LEFT: MAIN TEXT */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <p className="text-xs font-medium tracking-[0.25em] uppercase text-gray-400">
            Personal Finance Dashboard
          </p>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            See your{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              money clearly
            </span>{" "}
            in one place.
          </h1>

          <p className="text-gray-300 text-base md:text-lg max-w-xl leading-relaxed">
            FinTrack helps you track income, expenses, budgets and reports with
            a clean, focused interface so you always know where your money is
            going.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/signup"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium shadow-md hover:opacity-90 transition"
            >
              Get Started Free
            </Link>

            <a
              href="#features"
              className="px-6 py-3 rounded-xl border border-white/10 bg-white/5 text-white font-medium hover:bg-white/10 transition"
            >
              Explore Features
            </a>
          </div>

          {/* tiny inline stats */}
          <div className="flex flex-wrap gap-6 pt-4 text-sm text-gray-400">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Tracking
              </p>
              <p className="text-gray-100 font-semibold">Income & Expenses</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Focus
              </p>
              <p className="text-gray-100 font-semibold">Budgets & Reports</p>
            </div>
          </div>
        </motion.div>

        {/* RIGHT: “APP WINDOW” PREVIEW */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center"
        >
          <div className="w-full max-w-md rounded-3xl bg-[#111318] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.7)] overflow-hidden">
            {/* Window top bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#181b22]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>
              <p className="text-xs text-gray-400">FinTrack · Overview</p>
              <div className="w-10" />
            </div>

            {/* Window body */}
            <div className="p-4 space-y-4">
              {/* top row: total summary */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Current month
                  </p>
                  <p className="text-lg font-semibold text-white">
                    Financial Snapshot
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] bg-white/5 border border-white/10 text-gray-300">
                  Live demo
                </span>
              </div>

              {/* metrics */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="rounded-xl bg-black/40 border border-white/10 p-3">
                  <p className="text-gray-400">Income</p>
                  <p className="mt-1 text-sm font-semibold text-emerald-400">
                    ₹72,000
                  </p>
                </div>
                <div className="rounded-xl bg-black/40 border border-white/10 p-3">
                  <p className="text-gray-400">Expenses</p>
                  <p className="mt-1 text-sm font-semibold text-rose-400">
                    ₹49,800
                  </p>
                </div>
                <div className="rounded-xl bg-black/40 border border-white/10 p-3">
                  <p className="text-gray-400">Savings</p>
                  <p className="mt-1 text-sm font-semibold text-cyan-400">
                    ₹22,200
                  </p>
                </div>
              </div>

              {/* bottom row: simple list */}
              <div className="rounded-2xl bg-black/40 border border-white/10 p-3 space-y-2 text-xs">
                <p className="text-gray-400 mb-1">Recent highlights</p>
                <div className="flex justify-between text-gray-300">
                  <span>Budget usage</span>
                  <span className="text-amber-300 font-medium">72%</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Recurring bills</span>
                  <span className="text-gray-100">5 active</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Tracked transactions</span>
                  <span className="text-gray-100">120 this month</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="space-y-8">
        <h2 className="text-2xl md:text-3xl font-semibold text-white text-center">
          Everything you need to manage your money
        </h2>
        <p className="text-sm md:text-base text-gray-400 text-center max-w-2xl mx-auto">
          FinTrack combines income tracking, expense logging, budgeting and
          reporting into one simple, focused interface.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Unified overview",
              desc: "Get a single view of income, expenses, budgets and more.",
            },
            {
              title: "Clean analytics",
              desc: "Visualize where your money goes with simple charts.",
            },
            {
              title: "Budget control",
              desc: "Set limits by category and avoid overspending.",
            },
            {
              title: "Secure by design",
              desc: "Your financial data is stored safely and privately.",
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-[#111318] border border-white/10 rounded-2xl p-5 shadow-lg"
            >
              <h3 className="text-cyan-400 font-semibold mb-2 text-sm md:text-base">
                {f.title}
              </h3>
              <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= SECTIONS: INCOME / EXPENSES / BUDGETS / REPORTS ================= */}
      <section className="space-y-16">
        {/* Income */}
        <motion.div
          id="income"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="bg-[#111318] border border-white/10 rounded-3xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="md:col-span-1 space-y-2">
            <h3 className="text-xl font-semibold text-white">
              Income Management
            </h3>
            <p className="text-sm text-gray-400">
              Track salary, freelance payments, side hustles and more — all
              categorized and visible.
            </p>
            <Link
              to="/private/addincome"
              className="inline-block mt-3 text-sm text-cyan-400 hover:text-cyan-300"
            >
              Go to income →
            </Link>
          </div>
          <div className="md:col-span-2 grid grid-cols-2 gap-4 text-xs">
            <div className="bg-black/40 border border-white/10 rounded-2xl p-4">
              <p className="text-gray-400">Sources</p>
              <p className="text-lg font-semibold text-white mt-1">Multiple</p>
              <p className="text-gray-500 mt-1">
                Separate salary, freelance, investments and more.
              </p>
            </div>
            <div className="bg-black/40 border border-white/10 rounded-2xl p-4">
              <p className="text-gray-400">Trends</p>
              <p className="text-lg font-semibold text-emerald-400 mt-1">
                Growth focused
              </p>
              <p className="text-gray-500 mt-1">
                Understand how your monthly income is evolving.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Expenses */}
        <motion.div
          id="expenses"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="bg-[#111318] border border-white/10 rounded-3xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="md:col-span-1 space-y-2">
            <h3 className="text-xl font-semibold text-white">
              Expense Tracking
            </h3>
            <p className="text-sm text-gray-400">
              Log everyday spending, categorize it, and see exactly where your
              money goes.
            </p>
            <Link
              to="/private/allexpenses"
              className="inline-block mt-3 text-sm text-cyan-400 hover:text-cyan-300"
            >
              Go to expenses →
            </Link>
          </div>
          <div className="md:col-span-2 grid grid-cols-2 gap-4 text-xs">
            <div className="bg-black/40 border border-white/10 rounded-2xl p-4">
              <p className="text-gray-400">Categories</p>
              <p className="text-lg font-semibold text-white mt-1">
                Customizable
              </p>
              <p className="text-gray-500 mt-1">
                Group expenses by needs, wants, bills and more.
              </p>
            </div>
            <div className="bg-black/40 border border-white/10 rounded-2xl p-4">
              <p className="text-gray-400">Awareness</p>
              <p className="text-lg font-semibold text-rose-400 mt-1">
                See patterns
              </p>
              <p className="text-gray-500 mt-1">
                Spot recurring waste and cut unnecessary costs.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Budgets */}
        <motion.div
          id="budgets"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="bg-[#111318] border border-white/10 rounded-3xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="md:col-span-1 space-y-2">
            <h3 className="text-xl font-semibold text-white">
              Budget Planning
            </h3>
            <p className="text-sm text-gray-400">
              Set realistic spending limits by category and stay on track with
              clear budget usage.
            </p>
            <Link
              to="/private/addbudget"
              className="inline-block mt-3 text-sm text-cyan-400 hover:text-cyan-300"
            >
              Go to budgets →
            </Link>
          </div>
          <div className="md:col-span-2 grid grid-cols-2 gap-4 text-xs">
            <div className="bg-black/40 border border-white/10 rounded-2xl p-4">
              <p className="text-gray-400">Limits</p>
              <p className="text-lg font-semibold text-white mt-1">
                Per category
              </p>
              <p className="text-gray-500 mt-1">
                Keep groceries, bills, and fun under control.
              </p>
            </div>
            <div className="bg-black/40 border border-white/10 rounded-2xl p-4">
              <p className="text-gray-400">Progress</p>
              <p className="text-lg font-semibold text-amber-300 mt-1">
                At-a-glance
              </p>
              <p className="text-gray-500 mt-1">
                See how much budget remains before overspending.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Reports */}
        <motion.div
          id="reports"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="bg-[#111318] border border-white/10 rounded-3xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="md:col-span-1 space-y-2">
            <h3 className="text-xl font-semibold text-white">
              Reports & Insights
            </h3>
            <p className="text-sm text-gray-400">
              Turn raw numbers into simple visuals, summaries, and long-term
              trends for better decisions.
            </p>
            <Link
              to="/private/reports"
              className="inline-block mt-3 text-sm text-cyan-400 hover:text-cyan-300"
            >
              Go to reports →
            </Link>
          </div>
          <div className="md:col-span-2 grid grid-cols-2 gap-4 text-xs">
            <div className="bg-black/40 border border-white/10 rounded-2xl p-4">
              <p className="text-gray-400">Visuals</p>
              <p className="text-lg font-semibold text-white mt-1">
                Charts & summaries
              </p>
              <p className="text-gray-500 mt-1">
                Compare months, track categories, and see progress.
              </p>
            </div>
            <div className="bg-black/40 border border-white/10 rounded-2xl p-4">
              <p className="text-gray-400">Clarity</p>
              <p className="text-lg font-semibold text-cyan-400 mt-1">
                Big picture
              </p>
              <p className="text-gray-500 mt-1">
                Understand your financial story over time — not just this month.
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};
