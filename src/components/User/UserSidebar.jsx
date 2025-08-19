import React, { useState } from "react";
import { Link } from "react-router-dom";
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

export const UserSidebar = ({ isOpen, toggleSidebar }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = localStorage.getItem("id")
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
    setExpandedItems((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
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
    <div
      id="sidebar"
      className={`transition-all duration-300 bg-gradient-to-b from-gray-900 via-purple-900 to-pink-900 text-white fixed top-0 left-0 h-full z-50 w-64 overflow-y-auto shadow-lg transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="inner p-4">
        {/* Search */}
        <section id="search" className="mb-4">
          <input
            type="text"
            placeholder="Search"
            className="w-full p-2 rounded bg-gray-800 text-white focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </section>

        {/* Menu */}
        <nav id="menu">
          <header className="major mb-2">
            <h2 className="text-white">Menu</h2>
          </header>
          <ul>
            {menuItems.filter(matchesSearch).map((item, index) => {
              const isExpanded = expandedItems[item.label] || searchTerm !== "";
              if (item.children) {
                const childMatches = item.children.filter((child) =>
                  child.label.toLowerCase().includes(searchTerm.toLowerCase())
                );
                const shouldShowChildren = searchTerm ? childMatches.length > 0 : isExpanded;
                return (
                  <li key={index}>
                    <span
                      className={`flex items-center gap-2 py-2 px-3 rounded cursor-pointer hover:bg-purple-700 transition-colors ${
                        shouldShowChildren ? "bg-purple-800" : ""
                      }`}
                      onClick={() => toggleExpand(item.label)}
                    >
                      {item.icon} {item.label}
                    </span>
                    {shouldShowChildren && (
                      <ul className="ml-6">
                        {childMatches.map((child, idx) => (
                          <li key={idx}>
                            <Link
                              to={child.path}
                              className="block py-1 px-2 rounded hover:bg-pink-700 transition-colors"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              } else {
                return (
                  <li key={index}>
                    <Link
                      to={item.path}
                      className="flex items-center gap-2 py-2 px-3 rounded hover:bg-purple-700 transition-colors"
                    >
                      {item.icon} {item.label}
                    </Link>
                  </li>
                );
              }
            })}
          </ul>
        </nav>

        {/* Admin Details */}
        <section className="mt-6">
          <header className="major">
            <h2 className="text-white">Admin Details</h2>
          </header>
          <p><strong className="text-pink-400">Name:</strong> {user?.name}</p>
          <p><strong className="text-pink-400">Email:</strong> {user?.email}</p>
          <p><strong className="text-pink-400">Role:</strong> {user?.role}</p>
        </section>

        {/* Contact Info */}
        <section className="mt-6">
          <header className="major">
            <h2 className="text-white">Get in touch</h2>
          </header>
          <p>
            Hello, I'm <strong className="text-pink-400">Muhammad Patel</strong>, a passionate web
            developer currently pursuing my degree in Computer Science.
          </p>
          <ul className="contact space-y-2 mt-2">
            <li className="flex items-center gap-2"><FaEnvelope /> <a href="mailto:patelmuhammad192@gmail.com">patelmuhammad192@gmail.com</a></li>
            <li className="flex items-center gap-2"><FaPhone /> +91 8980380280</li>
            <li className="flex items-center gap-2"><FaGithub /> <a href="https://github.com/patel192" target="_blank" rel="noopener noreferrer">patel192</a></li>
          </ul>
        </section>
      </div>
    </div>
  );
};
