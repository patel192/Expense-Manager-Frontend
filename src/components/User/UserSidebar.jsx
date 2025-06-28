import React, { useState } from "react";
import { Link } from "react-router-dom";

export const UserSidebar = ({ isOpen, toggleSidebar }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedItems, setExpandedItems] = useState({});

  const menuItems = [
    { label: "Dashboard", path: "/private/userdashboard" },
    {
      label: "Expenses",
      children: [
        { label: "Add Expense", path: "/private/addexpense" },
        { label: "All Expenses", path: "/private/allexpenses" },
      ],
    },
    {
      label: "Income",
      children: [
        { label: "Add Income", path: "/private/addincome" },
        { label: "View Income", path: "/private/viewincome" },
        { label: "Income Summary", path: "/private/incomesummary" },
      ],
    },
    {
      label: "Budget",
      children: [
        { label: "Add Budget", path: "/private/addbudget" },
        { label: "View Budget", path: "/private/allbudget" },
      ],
    },
    { label: "Transactions", path: "/private/transaction" },
    { label: "Reports", path: "/private/reports" },
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
    <div id="sidebar" className={isOpen ? "" : "inactive"}>
      <div className="inner">
        <section id="search" className="alt">
          <form>
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        </section>

        <nav id="menu">
          <header className="major">
            <h2 style={{ color: "white" }}>Menu</h2>
          </header>
          <ul style={{ color: "white" }}>
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
                      className={`opener ${shouldShowChildren ? "active" : ""}`}
                      onClick={() => toggleExpand(item.label)}
                      style={{ cursor: "pointer" }}
                    >
                      {item.label}
                    </span>
                    {shouldShowChildren && (
                      <ul>
                        {childMatches.map((child, idx) => (
                          <li key={idx}>
                            <Link to={child.path}>{child.label}</Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              } else {
                return (
                  <li key={index}>
                    <Link to={item.path}>{item.label}</Link>
                  </li>
                );
              }
            })}
          </ul>
        </nav>

        {/* Admin Details */}
        <section style={{ color: "white" }}>
          <header className="major">
            <h2 style={{ color: "white" }}>Admin Details</h2>
          </header>
          <div className="mini-posts">
            <p>
              <strong style={{ color: "#f56a6a" }}>Name:</strong> {user?.name}
            </p>
            <p>
              <strong style={{ color: "#f56a6a" }}>Email:</strong> {user?.email}
            </p>
            <p>
              <strong style={{ color: "#f56a6a" }}>Role:</strong> {user?.role}
            </p>
          </div>
        </section>

        {/* Contact Info */}
        <section style={{ color: "white" }}>
          <header className="major">
            <h2 style={{ color: "white" }}>Get in touch</h2>
          </header>
          <p>
            Hello, I'm <strong style={{ color: "#f56a6a" }}>Muhammad Patel</strong>, a passionate web
            developer currently pursuing my degree in Computer Science at Neo
            Tech Institute of Technology. I enjoy building responsive web
            applications and constantly exploring new technologies. Let's
            connect and build something great together!
          </p>
          <ul className="contact">
            <li className="icon solid fa-envelope">
              <a href="#">patelmuhammad192@gmail.com</a>
            </li>
            <li className="icon solid fa-phone">+91 8980380280</li>
            <li className="icon brands fa-github">
              <a
                href="https://github.com/patel192"
                target="_blank"
                rel="noopener noreferrer"
              >
                patel192
              </a>
            </li>
          </ul>
        </section>
      </div>
      <a href="#sidebar" className="toggle" onClick={toggleSidebar}>
        Toggle
      </a>
    </div>
  );
};
