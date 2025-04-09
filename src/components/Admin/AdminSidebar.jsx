import React from "react";
import { Link } from "react-router-dom";
export const AdminSidebar = ({ isOpen, toggleSidebar }) => {
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
            <li >
              <Link to="/admin/accesscontrol">Access Control</Link>
            </li>
            <li>
              <Link to="/admin/admindashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/admin/managecategories">Manage Categories</Link>
            </li>
            <li>
              <Link to="/admin/manageusers">Manage Users</Link>
            </li>
            <li>
              <Link to="/admin/reportadmins">Report Admins</Link>
            </li>
            <li>
              <Link to="/admin/systemlogs">System Logs</Link>
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

        <section style={{color:"white"}}>
          <header class="major">
            <h2 style={{color:"white"}}>Get in touch</h2>
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
      <a href="#sidebar" className="toggle red-hover" onClick={toggleSidebar}>
        Toggle
      </a>
    </div>
  );
};
