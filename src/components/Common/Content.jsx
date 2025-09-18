import { Link } from "react-router-dom";
import React from "react";
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
    <div>
      {/* Banner Section */}
      <section className="flex flex-row lg:flex-row items-center justify-between gap-10 px-6 py-12 bg-gradient-to-r from-blue-50 to-blue-100">
  {/* Text Content */}
  <div className="max-w-xl flex flex-col justify-between">
    <div>
      <header>
        <h1 className="text-4xl font-extrabold text-gray-800 leading-tight">
          Welcome to ExpenseTracker
          <br />
          <span className="text-blue-600">Your Personal Finance Companion</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Simplify budgeting, track expenses, and take control of your finances—all in one place.
        </p>
      </header>

      <p className="mt-6 text-gray-700 leading-relaxed">
        ExpenseTracker is a powerful, user-friendly web application built to help individuals and families manage their daily financial activities.
      </p>
      <ul className="flex gap-4 mt-6">
        <li className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-3 px-6 rounded-xl text-white font-semibold shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl">
          <Link to="/signup">Get Started</Link>
        </li>
        <li className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-3 px-6 rounded-xl text-white font-semibold shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl">
          <Link to="/features">Explore Features</Link>
        </li>
      </ul>
    </div>

    {/* Stats / Highlights */}
    <div className="mt-10 grid grid-cols-3 gap-6 text-center">
      <div>
        <p className="text-2xl font-bold text-blue-600">10K+</p>
        <p className="text-sm text-gray-600">Expenses Tracked</p>
      </div>
      <div>
        <p className="text-2xl font-bold text-blue-600">5K+</p>
        <p className="text-sm text-gray-600">Happy Users</p>
      </div>
      <div>
        <p className="text-2xl font-bold text-blue-600">99.9%</p>
        <p className="text-sm text-gray-600">Data Security</p>
      </div>
    </div>
  </div>

  {/* Banner Image */}
  <div className="flex-shrink-0">
    <img
      src="public\Expense Manager.png"
      alt="Finance Illustration"
      className="rounded-xl shadow-lg w-full max-w-md"
    />
  </div>
</section>


      {/* Features Section */}
      <section className="px-6 py-12 bg-white">
        <header className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800">
            Powerful Features to Manage Your Finances
          </h2>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <FaWallet className="text-blue-600 text-4xl" />,
              title: "Track Income & Expenses",
              desc: "Easily log your daily transactions, categorize them, and stay aware of your cash flow in real time.",
            },
            {
              icon: <FaChartPie className="text-blue-600 text-4xl" />,
              title: "Visual Reports",
              desc: "Understand your financial health with clean, visual breakdowns of your spending habits and monthly summaries.",
            },
            {
              icon: <FaBullseye className="text-blue-600 text-4xl" />,
              title: "Set Budgets",
              desc: "Create monthly or category-based budgets and get alerts when you’re close to overspending.",
            },
            {
              icon: <FaUserShield className="text-blue-600 text-4xl" />,
              title: "Secure & Private",
              desc: "Your data is securely stored and protected. Only you have access to your financial details.",
            },
          ].map((feature, idx) => (
            <article
              key={idx}
              className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-md transition"
            >
              {feature.icon}
              <h3 className="mt-4 text-lg font-semibold text-gray-800">
                {feature.title}
              </h3>
              <p className="mt-2 text-gray-600">{feature.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Modules Section */}
      <section className="px-6 py-12 bg-gray-50">
        <header className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800">
            Explore App Modules
          </h2>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <FaMoneyBillWave className="text-blue-500 text-3xl" />,
              title: "Income Tracker",
              desc: "Log and categorize income sources to stay on top of all earnings. View monthly summaries for better planning.",
            },
            {
              icon: <FaPiggyBank className="text-blue-500 text-3xl" />,
              title: "Expense Tracker",
              desc: "Monitor daily spending across categories. See where your money goes and avoid unnecessary expenses.",
            },
            {
              icon: <FaBalanceScale className="text-blue-500 text-3xl" />,
              title: "Budget Planner",
              desc: "Set monthly budgets and track spending. Stay within limits and receive alerts for overspending.",
            },
            {
              icon: <FaClipboardList className="text-blue-500 text-3xl" />,
              title: "Reports & Insights",
              desc: "Analyze your income and expenses through graphical reports. Gain insights to improve your financial decisions.",
            },
            {
              icon: <FaUserCog className="text-blue-500 text-3xl" />,
              title: "Account Management",
              desc: "Edit your profile, change password, manage preferences, and control who sees your data with privacy tools.",
            },
            {
              icon: <FaLock className="text-blue-500 text-3xl" />,
              title: "Secure Access",
              desc: "Login with secure credentials and ensure your financial data is encrypted and safe from prying eyes.",
            },
          ].map((module, idx) => (
            <article
              key={idx}
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
            >
              {module.icon}
              <h3 className="mt-3 text-lg font-semibold text-gray-800">
                {module.title}
              </h3>
              <p className="mt-2 text-gray-600">{module.desc}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
