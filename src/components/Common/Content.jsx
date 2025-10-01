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
    <div className="overflow-hidden">
      {/* Banner Section */}
      <section className="relative flex flex-col lg:flex-row items-center justify-between gap-10 px-6 py-16 bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 text-white rounded-2xl shadow-2xl mx-4 mt-6">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-xl"
        >
          <header>
            <h1 className="text-4xl font-extrabold leading-tight drop-shadow-lg">
              Welcome to ExpenseTracker
              <br />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent">
                Your Personal Finance Companion
              </span>
            </h1>
            <p className="mt-4 text-lg text-blue-100">
              Simplify budgeting, track expenses, and take control of your
              finances—all in one place.
            </p>
          </header>

          <p className="mt-6 text-blue-200 leading-relaxed">
            ExpenseTracker is a powerful, user-friendly web application built to
            help individuals and families manage their daily financial
            activities.
          </p>

          {/* Buttons */}
          <ul className="flex gap-4 mt-8">
            <li>
              <Link
                to="/signup"
                className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg hover:scale-105 transform transition"
              >
                Get Started
              </Link>
            </li>
            <li>
              <Link
                to="/features"
                className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg hover:scale-105 transform transition"
              >
                Explore Features
              </Link>
            </li>
          </ul>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-6 text-center">
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

      {/* Features Section */}
      <section className="px-6 py-16">
        <header className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-100">
            Powerful Features to Manage Your Finances
          </h2>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <FaWallet className="text-cyan-400 text-4xl" />,
              title: "Track Income & Expenses",
              desc: "Easily log your daily transactions, categorize them, and stay aware of your cash flow in real time.",
            },
            {
              icon: <FaChartPie className="text-cyan-400 text-4xl" />,
              title: "Visual Reports",
              desc: "Understand your financial health with clean, visual breakdowns of your spending habits and monthly summaries.",
            },
            {
              icon: <FaBullseye className="text-cyan-400 text-4xl" />,
              title: "Set Budgets",
              desc: "Create monthly or category-based budgets and get alerts when you’re close to overspending.",
            },
            {
              icon: <FaUserShield className="text-cyan-400 text-4xl" />,
              title: "Secure & Private",
              desc: "Your data is securely stored and protected. Only you have access to your financial details.",
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

      {/* Modules Section */}
      <section className="px-6 py-16 bg-gradient-to-b from-gray-900 to-gray-950">
        <header className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white">Explore App Modules</h2>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <FaMoneyBillWave className="text-green-400 text-3xl" />,
              title: "Income Tracker",
              desc: "Log and categorize income sources to stay on top of all earnings. View monthly summaries for better planning.",
            },
            {
              icon: <FaPiggyBank className="text-pink-400 text-3xl" />,
              title: "Expense Tracker",
              desc: "Monitor daily spending across categories. See where your money goes and avoid unnecessary expenses.",
            },
            {
              icon: <FaBalanceScale className="text-blue-400 text-3xl" />,
              title: "Budget Planner",
              desc: "Set monthly budgets and track spending. Stay within limits and receive alerts for overspending.",
            },
            {
              icon: <FaClipboardList className="text-purple-400 text-3xl" />,
              title: "Reports & Insights",
              desc: "Analyze your income and expenses through graphical reports. Gain insights to improve your financial decisions.",
            },
            {
              icon: <FaUserCog className="text-yellow-400 text-3xl" />,
              title: "Account Management",
              desc: "Edit your profile, change password, manage preferences, and control who sees your data with privacy tools.",
            },
            {
              icon: <FaLock className="text-red-400 text-3xl" />,
              title: "Secure Access",
              desc: "Login with secure credentials and ensure your financial data is encrypted and safe from prying eyes.",
            },
          ].map((module, idx) => (
            <motion.article
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="backdrop-blur-xl bg-white/10 p-6 rounded-xl border border-white/20 shadow-lg text-white"
            >
              {module.icon}
              <h3 className="mt-3 text-lg font-semibold">{module.title}</h3>
              <p className="mt-2 text-sm text-gray-200">{module.desc}</p>
            </motion.article>
          ))}
        </div>
      </section>
    </div>
  );
};
