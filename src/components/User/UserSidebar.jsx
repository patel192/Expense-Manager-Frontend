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
    { label: "Dashboard", path: "/private/userdashboard", icon: <FaTachometerAlt /> },
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
    { label: "Transactions", path: "/private/transaction", icon: <FaExchangeAlt /> },
    { label: "Reports", path: "/private/reports", icon: <FaFileAlt /> },
  ];

  const toggleExpand = (label) => {
    setExpandedItems((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const matchesSearch = (item) => {
    if (!searchTerm) return true;
    const labelMatch = item.label.toLowerCase().includes(searchTerm.toLowerCase());
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
      className="fixed top-0 left-0 h-full z-50 w-64 sm:w-56 md:w-64 lg:w-72 overflow-y-auto bg-gradient-to-b from-gray-900 via-purple-900 to-pink-900 text-white shadow-lg"
    >
      <div className="p-4">
        {/* Search */}
        <input
          type="text"
          placeholder="Search..."
          className="w-full p-2 mb-4 rounded bg-gray-800 text-white focus:outline-none"
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
                const shouldShowChildren = searchTerm ? childMatches.length > 0 : isExpanded;

                return (
                  <li key={index} className="mb-1">
                    <div
                      className={`flex items-center gap-2 py-2 px-3 rounded cursor-pointer hover:bg-purple-700 transition-colors ${
                        shouldShowChildren ? "bg-purple-800 font-semibold" : ""
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
                                className={`block py-1 px-2 rounded transition-colors ${
                                  location.pathname === child.path
                                    ? "bg-pink-800 font-semibold"
                                    : "hover:bg-pink-700"
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
                      className={`flex items-center gap-2 py-2 px-3 rounded transition-colors ${
                        location.pathname === item.path
                          ? "bg-purple-800 font-semibold"
                          : "hover:bg-purple-700"
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
        <div className="mt-6 border-t border-gray-700 pt-4">
          <h3 className="text-white mb-2">Get in touch</h3>
          <p className="text-gray-300 mb-2">
            Hello, I'm <strong className="text-pink-400">Muhammad Patel</strong>, a passionate web developer.
          </p>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-center gap-2">
              <FaEnvelope />{" "}
              <a href="mailto:patelmuhammad192@gmail.com" className="hover:underline">
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
                className="hover:underline"
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
