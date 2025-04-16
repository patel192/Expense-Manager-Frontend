import React, { useState } from "react";
import { Link } from "react-router-dom";

export const UserSidebar = ({ isOpen, toggleSidebar }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [openSections, setOpenSections] = useState({
    expenses: false,
    income: false,
    budget: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  return (
    <div id="sidebar" className={isOpen ? "" : "inactive"}>
      <div className="inner">
        <section id="search" className="alt">
          <form method="post" action="#">
            <input type="text" name="query" id="query" placeholder="Search" />
          </form>
        </section>

        <nav id="menu">
          <header className="major">
            <h2 style={{ color: "white" }}>Menu</h2>
          </header>
          <ul style={{ color: "white" }}>
            <li>
              <Link to="/private/userdashboard">Dashboard</Link>
            </li>

            {/* Expenses */}
            <li>
              <span
                className={`opener ${openSections.expenses ? "active" : ""}`}
                onClick={() => toggleSection("expenses")}
              >
                Expenses
              </span>
              {openSections.expenses && (
                <ul>
                  <li>
                    <Link to="/private/addexpense">Add Expense</Link>
                  </li>
                  <li>
                    <Link to="/private/allexpenses">All Expenses</Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Income */}
            <li>
              <span
                className={`opener ${openSections.income ? "active" : ""}`}
                onClick={() => toggleSection("income")}
              >
                Income
              </span>
              {openSections.income && (
                <ul>
                  <li>
                    <Link to="/private/addincome">Add Income</Link>
                  </li>
                  <li>
                    <Link to="/private/viewincome">View Income</Link>
                  </li>
                  <li>
                    <Link to="/private/incomesummary">Income Summary</Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Budget */}
            <li>
              <span
                className={`opener ${openSections.budget ? "active" : ""}`}
                onClick={() => toggleSection("budget")}
              >
                Budget
              </span>
              {openSections.budget && (
                <ul>
                  <li>
                    <Link to="/private/addbudget">Add Budget</Link>
                  </li>
                  <li>
                    <Link to="/private/allbudget">View Budget</Link>
                  </li>
                </ul>
              )}
            </li>

            <li>
              <Link to="/private/transaction">Transactions</Link>
            </li>
            <li>
              <Link to="/private/reports">Reports</Link>
            </li>
          </ul>
        </nav>

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
              <a href="https://github.com/patel192" target="_blank" rel="noopener noreferrer">
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
