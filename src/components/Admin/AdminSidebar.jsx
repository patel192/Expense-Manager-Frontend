import React, { useState } from "react";
import { Link } from "react-router-dom";

export const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [searchTerm, setSearchTerm] = useState("");

  const menuItems = [
    { label: "Access Control", path: "/admin/accesscontrol" },
    { label: "Dashboard", path: "/admin/admindashboard" },
    { label: "Manage Categories", path: "/admin/managecategories" },
    { label: "Manage Users", path: "/admin/manageusers" },
    { label: "Report Admins", path: "/admin/reportadmins" },
    { label: "System Logs", path: "/admin/systemlogs" },
  ];

  const filteredMenu = menuItems.filter((item) =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            {filteredMenu.map((item, index) => (
              <li key={index}>
                <Link to={item.path}>{item.label}</Link>
              </li>
            ))}
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
      <a href="#sidebar" className="toggle red-hover" onClick={toggleSidebar}>
        Toggle
      </a>
    </div>
  );
};
