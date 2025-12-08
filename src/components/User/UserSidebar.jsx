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
  FaTimes,
  FaChevronDown,
} from "react-icons/fa";

export const UserSidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
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

  const toggleExpand = (label) =>
    setExpandedItems((prev) => ({ ...prev, [label]: !prev[label] }));

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
    <>
      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        className="fixed top-0 left-0 h-full z-50 w-64 md:w-72 bg-white border-r border-gray-200 shadow-xl flex flex-col"
      >
        {/* Mobile Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 md:hidden">
          <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-gray-100 transition-all"
          >
            <FaTimes />
          </button>
        </div>

        {/* Main Sidebar */}
        <div className="p-4 flex-1 overflow-y-auto">
          {/* Search */}
          <input
            type="text"
            placeholder="Search..."
            className="w-full p-2 mb-4 rounded-md bg-gray-100 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                        onClick={() => toggleExpand(item.label)}
                        className={`flex items-center justify-between py-2 px-3 rounded-md cursor-pointer text-gray-700 transition-all ${
                          shouldShowChildren
                            ? "bg-indigo-50 text-indigo-600 font-medium"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-gray-500">{item.icon}</span>
                          <span>{item.label}</span>
                        </div>
                        <FaChevronDown
                          className={`text-gray-400 text-xs transition-transform ${
                            shouldShowChildren ? "rotate-180" : ""
                          }`}
                        />
                      </div>

                      <AnimatePresence>
                        {shouldShowChildren && (
                          <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="ml-8 overflow-hidden"
                          >
                            {childMatches.map((child, idx) => (
                              <li key={idx}>
                                <Link
                                  to={child.path}
                                  className={`block py-1.5 px-3 rounded-md text-sm transition-all ${
                                    location.pathname === child.path
                                      ? "text-indigo-600 bg-indigo-50 font-medium"
                                      : "text-gray-600 hover:text-indigo-600 hover:bg-gray-100"
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
                        className={`flex items-center gap-3 py-2 px-3 rounded-md text-gray-700 transition-all ${
                          location.pathname === item.path
                            ? "bg-indigo-50 text-indigo-600 font-medium"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <span className="text-gray-500">{item.icon}</span>
                        {item.label}
                      </Link>
                    </li>
                  );
                }
              })}
            </ul>
          </nav>
        </div>

        {/* Footer Contact Section */}
        <div className="p-4 border-t border-gray-200 text-sm text-gray-500 space-y-2">
          <p className="font-medium text-gray-700">Support</p>
          <div className="flex items-center gap-2">
            <FaEnvelope className="text-gray-400" />{" "}
            <a href="mailto:patelmuhammad192@gmail.com" className="hover:text-indigo-600">
              patelmuhammad192@gmail.com
            </a>
          </div>
          <div className="flex items-center gap-2">
            <FaPhone className="text-gray-400" /> <span>+91 8980380280</span>
          </div>
          <div className="flex items-center gap-2">
            <FaGithub className="text-gray-400" />{" "}
            <a
              href="https://github.com/patel192"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-600"
            >
              patel192
            </a>
          </div>
        </div>
      </motion.aside>
    </>
  );
};
