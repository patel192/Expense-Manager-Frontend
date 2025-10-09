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
  FaUserCog,
  FaLock,
} from "react-icons/fa";

export const Content = () => {
  return (
    <div className="overflow-hidden scroll-smooth">
      {/* 🌟 Hero Section */}
      <section
        id="home"
        className="relative flex flex-col lg:flex-row items-center justify-between gap-10 px-6 py-16 bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 text-white rounded-2xl shadow-2xl mx-4 mt-6"
      >
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-xl"
        >
          <header>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight drop-shadow-lg">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent">
                FinTrack
              </span>
            </h1>
            <p className="mt-4 text-lg text-blue-100">
              Simplify budgeting, track expenses, and take control of your
              finances—all in one place.
            </p>
          </header>

          <p className="mt-6 text-blue-200 leading-relaxed">
            FinTrack helps you manage your income, expenses, budgets, and
            reports seamlessly — perfect for personal or family finance.
          </p>

          {/* Buttons */}
          <ul className="flex flex-wrap gap-4 mt-8">
            <li>
              <Link
                to="/signup"
                className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg hover:scale-105 transform transition"
              >
                Get Started
              </Link>
            </li>
            <li>
              <a
                href="#features"
                className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg hover:scale-105 transform transition"
              >
                Explore Features
              </a>
            </li>
          </ul>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-4 sm:gap-6 text-center">
            {[
              { num: "10K+", label: "Expenses Tracked" },
              { num: "5K+", label: "Happy Users" },
              { num: "99.9%", label: "Data Security" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="backdrop-blur-xl bg-white/10 p-4 rounded-xl border border-white/20 shadow-lg"
              >
                <p className="text-2xl font-bold text-cyan-300">{stat.num}</p>
                <p className="text-sm text-blue-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Banner Image */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="flex-shrink-0"
        >
          <img
            src="/download.jpeg"
            alt="Finance Illustration"
            className="rounded-2xl shadow-2xl w-full max-w-md border border-white/20 backdrop-blur-lg"
          />
        </motion.div>
      </section>

      {/* 💼 Features Section */}
      <section id="features" className="px-6 py-16">
        <header className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-100">
            Powerful Features to Manage Your Finances
          </h2>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <FaWallet className="text-cyan-400 text-4xl" />,
              title: "Track Income & Expenses",
              desc: "Easily log transactions, categorize them, and monitor your cash flow in real-time.",
            },
            {
              icon: <FaChartPie className="text-cyan-400 text-4xl" />,
              title: "Visual Reports",
              desc: "Understand your financial health with clean charts and summaries.",
            },
            {
              icon: <FaBullseye className="text-cyan-400 text-4xl" />,
              title: "Set Budgets",
              desc: "Create monthly or category-based budgets and get alerts when nearing limits.",
            },
            {
              icon: <FaUserShield className="text-cyan-400 text-4xl" />,
              title: "Secure & Private",
              desc: "Your financial data is encrypted and safely stored — privacy guaranteed.",
            },
          ].map((feature, idx) => (
            <motion.article
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="backdrop-blur-xl bg-white/10 p-6 rounded-xl border border-white/20 shadow-lg text-white"
            >
              {feature.icon}
              <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-gray-200">{feature.desc}</p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* 📊 Dashboard Overview Section */}
      <section
        id="dashboard"
        className="px-6 py-16 bg-gradient-to-b from-gray-900 to-gray-950"
      >
        <header className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white">Dashboard Overview</h2>
          <p className="text-gray-300 mt-2 max-w-2xl mx-auto">
            Your personal finance command center — view summaries of all your
            income, expenses, and budgets in one clean interface.
          </p>
        </header>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="backdrop-blur-xl bg-white/10 p-8 rounded-2xl border border-white/20 shadow-lg text-center text-white max-w-4xl mx-auto"
        >
          <p className="text-lg text-gray-200 leading-relaxed">
            Get instant insights into your financial health. Compare monthly
            spending, analyze patterns, and plan smarter decisions with
            real-time charts and reports.
          </p>
          <Link
            to="/"
            className="inline-block mt-6 px-6 py-2 bg-cyan-600 rounded-lg hover:bg-cyan-700 transition"
          >
            Go to Dashboard
          </Link>
        </motion.div>
      </section>

      {/* 💰 Income Section */}
      <section id="income" className="px-6 py-16">
        <header className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white">Income Management</h2>
          <p className="text-gray-300 mt-2 max-w-2xl mx-auto">
            Record your earnings from multiple sources — salary, side hustles,
            investments, or freelance work.
          </p>
        </header>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="backdrop-blur-xl bg-white/10 p-8 rounded-2xl border border-white/20 shadow-lg text-center text-white max-w-4xl mx-auto"
        >
          <FaMoneyBillWave className="text-green-400 text-5xl mx-auto mb-4" />
          <p className="text-lg text-gray-200 leading-relaxed">
            Keep track of all your income sources and see how they contribute to
            your monthly goals. Visualize growth with smart analytics.
          </p>
          <Link
            to="/income"
            className="inline-block mt-6 px-6 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition"
          >
            Manage Income
          </Link>
        </motion.div>
      </section>

      {/* 💸 Expense Section */}
      <section id="expenses" className="px-6 py-16 bg-gradient-to-b from-gray-900 to-gray-950">
        <header className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white">Expense Tracking</h2>
          <p className="text-gray-300 mt-2 max-w-2xl mx-auto">
            Track daily expenses effortlessly and categorize them for better
            budgeting.
          </p>
        </header>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="backdrop-blur-xl bg-white/10 p-8 rounded-2xl border border-white/20 shadow-lg text-center text-white max-w-4xl mx-auto"
        >
          <FaPiggyBank className="text-pink-400 text-5xl mx-auto mb-4" />
          <p className="text-lg text-gray-200 leading-relaxed">
            Understand where your money goes. Gain control over your finances
            and identify unnecessary spending with smart visualizations.
          </p>
          <Link
            to="/expenses"
            className="inline-block mt-6 px-6 py-2 bg-pink-600 rounded-lg hover:bg-pink-700 transition"
          >
            Track Expenses
          </Link>
        </motion.div>
      </section>

      {/* 🎯 Budget Section */}
      <section id="budgets" className="px-6 py-16">
        <header className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white">Budget Planning</h2>
          <p className="text-gray-300 mt-2 max-w-2xl mx-auto">
            Set realistic spending limits, monitor your progress, and save more
            effectively.
          </p>
        </header>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="backdrop-blur-xl bg-white/10 p-8 rounded-2xl border border-white/20 shadow-lg text-center text-white max-w-4xl mx-auto"
        >
          <FaBalanceScale className="text-blue-400 text-5xl mx-auto mb-4" />
          <p className="text-lg text-gray-200 leading-relaxed">
            Plan your finances smartly by setting category-based budgets and
            getting insights on overspending.
          </p>
          <Link
            to="/budgets"
            className="inline-block mt-6 px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          >
            Create Budget
          </Link>
        </motion.div>
      </section>

      {/* 📈 Reports Section */}
      <section id="reports" className="px-6 py-16 bg-gradient-to-b from-gray-900 to-gray-950">
        <header className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white">Reports & Insights</h2>
          <p className="text-gray-300 mt-2 max-w-2xl mx-auto">
            Turn your data into insights — analyze patterns, monthly summaries,
            and long-term goals visually.
          </p>
        </header>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="backdrop-blur-xl bg-white/10 p-8 rounded-2xl border border-white/20 shadow-lg text-center text-white max-w-4xl mx-auto"
        >
          <FaClipboardList className="text-purple-400 text-5xl mx-auto mb-4" />
          <p className="text-lg text-gray-200 leading-relaxed">
            Generate visual reports with charts and analytics to make smarter
            financial decisions.
          </p>
          <Link
            to="/reports"
            className="inline-block mt-6 px-6 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition"
          >
            View Reports
          </Link>
        </motion.div>
      </section>
    </div>
  );
};
