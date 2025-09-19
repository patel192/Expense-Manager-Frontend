import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEnvelope,
  FaPhone,
  FaGithub,
  FaTachometerAlt,
  FaMoneyBillWave,
  FaWallet,
  FaChartPie,
  FaExchangeAlt,
  FaFileAlt,
  FaUser,
} from "react-icons/fa";

export const UserSidebar = ({ isOpen }) => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = localStorage.getItem("id");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedItems, setExpandedItems] = useState({});

  const menuItems = [
    { label: "Account", path: `/private/account/${userId}`, icon: <FaUser /> },
    {
      label: "Dashboard",
      path: "/private/userdashboard",
      icon: <FaTachometerAlt />,
    },
    {
      label: "Expenses",
      icon: <FaMoneyBillWave />,
      children: [
        { label: "Add Expense", path: "/private/addexpense" },
        { label: "All Expenses", path: "/private/allexpenses" },
        { label: "Recurring Expenses", path: "/private/recurring" },
      ],
    },
    {
      label: "Income",
      icon: <FaWallet />,
      children: [
        { label: "Add Income", path: "/private/addincome" },
        { label: "View Income", path: "/private/viewincome" },
        { label: "Income Summary", path: "/private/incomesummary" },
      ],
    },
    {
      label: "Budget",
      icon: <FaChartPie />,
      children: [
        { label: "Add Budget", path: "/private/addbudget" },
        { label: "View Budget", path: "/private/allbudget" },
        { label: "Budget Summary", path: "/private/budgetsummary" },
      ],
    },
    {
      label: "Transactions",
      path: "/private/transaction",
      icon: <FaExchangeAlt />,
    },
    { label: "Reports", path: "/private/reports", icon: <FaFileAlt /> },
  ];

  const toggleExpand = (label) => {
    setExpandedItems((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const matchesSearch = (item) => {
    if (!searchTerm) return true;
    const labelMatch = item.label
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const childMatch =
      item.children &&
      item.children.some((child) =>
        child.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return labelMatch || childMatch;
  };

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: isOpen ? 0 : -300 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-0 left-0 h-full z-50 w-64 sm:w-56 md:w-64 lg:w-72 overflow-y-auto bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white shadow-2xl backdrop-blur-md border-r border-white/10"
    >
      <div className="p-4">
        {/* Search */}
        <input
          type="text"
          placeholder="Search..."
          className="w-full p-2 mb-4 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Menu */}
        <nav>
          <ul>
            {menuItems.filter(matchesSearch).map((item, index) => {
              const isExpanded = expandedItems[item.label] || searchTerm !== "";
              if (item.children) {
                const childMatches = item.children.filter((child) =>
                  child.label.toLowerCase().includes(searchTerm.toLowerCase())
                );
                const shouldShowChildren = searchTerm
                  ? childMatches.length > 0
                  : isExpanded;

                return (
                  <li key={index} className="mb-1">
                    <div
                      className={`flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        shouldShowChildren
                          ? "bg-purple-900/70 font-semibold shadow-lg"
                          : "hover:bg-purple-800/50"
                      }`}
                      onClick={() => toggleExpand(item.label)}
                    >
                      {item.icon} {item.label}
                    </div>

                    <AnimatePresence>
                      {shouldShowChildren && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="ml-6 overflow-hidden"
                        >
                          {childMatches.map((child, idx) => (
                            <li key={idx}>
                              <Link
                                to={child.path}
                                className={`block py-1 px-2 rounded-lg transition-all duration-200 ${
                                  location.pathname === child.path
                                    ? "bg-pink-700/70 font-semibold shadow-md"
                                    : "hover:bg-pink-600/50"
                                }`}
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </li>
                );
              } else {
                return (
                  <li key={index} className="mb-1">
                    <Link
                      to={item.path}
                      className={`flex items-center gap-2 py-2 px-3 rounded-lg transition-all duration-200 ${
                        location.pathname === item.path
                          ? "bg-purple-900/70 font-semibold shadow-lg"
                          : "hover:bg-purple-800/50"
                      }`}
                    >
                      {item.icon} {item.label}
                    </Link>
                  </li>
                );
              }
            })}
          </ul>
        </nav>

        {/* Contact Section */}
        <div className="mt-6 border-t border-white/10 pt-4">
          <h3 className="text-white mb-2 font-semibold">Get in touch</h3>
          <p className="text-gray-300 mb-2">
            Hello, I'm <strong className="text-pink-400">Muhammad Patel</strong>
            , a passionate web developer.
          </p>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-center gap-2">
              <FaEnvelope />{" "}
              <a
                href="mailto:patelmuhammad192@gmail.com"
                className="hover:underline text-white/90"
              >
                patelmuhammad192@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <FaPhone /> +91 8980380280
            </li>
            <li className="flex items-center gap-2">
              <FaGithub />{" "}
              <a
                href="https://github.com/patel192"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-white/90"
              >
                patel192
              </a>
            </li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};
