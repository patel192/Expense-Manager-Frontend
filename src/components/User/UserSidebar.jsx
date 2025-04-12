import React from "react";
import { Link } from "react-router-dom";

export const UserSidebar = ({ isOpen, toggleSidebar }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <div id="sidebar" className={isOpen ? "" : "inactive"}>
      <div class="inner">
        <section id="search" class="alt">
          <form method="post" action="#">
            <input type="text" name="query" id="query" placeholder="Search" />
          </form>
        </section>

        <nav id="menu">
          <header class="major">
            <h2 style={{color:"white"}}>Menu</h2>
          </header>
          <ul style={{color:"white"}}>
            <li>
              <Link to="/private/userdashboard">Dashboard</Link>
            </li>

            <li>
              <span class="opener active">Expenses</span>
              <ul>
                <li>
                  <Link to="/private/addexpense">Add Expense</Link>
                </li>
                <li>
                  <Link to="/private/allexpenses">All Expenses</Link>
                </li>
              </ul>
            </li>
            <li>
              <span class="opener active">Income</span>
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
            </li>
            <li>
              <span class="opener active">Budget</span>
              <ul>
                <li>
                  <Link to="/private/addbudget">Add Budget</Link>
                </li>
                <li>
                  <Link to="/private/allbudget">View Budget</Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="/private/transaction">Transactions</Link>
            </li>
            <li>
              <a href="/private/reports">Reports</a>
            </li>
          </ul>
        </nav>

        <section style={{color:"white"}}>
          <header class="major">
            <h2 style={{color:"white"}}>Admin Details</h2>
          </header>
          <div class="mini-posts">
            <p>
              <strong style={{color:"#f56a6a"}}>Name:</strong> {user?.name}
            </p>
            <p>
              <strong style={{color:"#f56a6a"}}>Email:</strong> {user?.email}
            </p>
            <p>
              <strong style={{color:"#f56a6a"}}>Role:</strong> {user?.role}
            </p>
          </div>
        </section>
        <section  style={{color:"white"}}>
          <header class="major">
            <h2  style={{color:"white"}}>Get in touch</h2>
          </header>
          <p>
            Hello, I'm <strong style={{color:"#f56a6a"}}>Muhammad Patel</strong>, a passionate web
            developer currently pursuing my degree in Computer Science at Neo
            Tech Institute of Technology. I enjoy building responsive web
            applications and constantly exploring new technologies. Let's
            connect and build something great together!
          </p>

          <ul class="contact">
            <li class="icon solid fa-envelope">
              <a href="#">patelmuhammad192@gmail.com</a>
            </li>
            <li class="icon solid fa-phone">+91 8980380280</li>
            <li class="icon brands fa-github">
              <a href="https://github.com/patel192" target="blank">
                patel192
              </a>
            </li>
          </ul>
        </section>
      </div>
      <a href="#sidebar" class="toggle" onClick={toggleSidebar}>
        Toggle
      </a>
    </div>
  );
};
