import React from "react";
import { Link } from "react-router-dom";
export const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div id="sidebar"  className={isOpen ? "" : "inactive"}>
      <div class="inner">
        <section id="search" class="alt">
          <form method="post" action="#">
            <input type="text" name="query" id="query" placeholder="Search" />
          </form>
        </section>

        <nav id="menu">
          <header class="major">
            <h2>Menu</h2>
          </header>
          <ul>
            <li>
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

        <section>
          <header class="major">
            <h2>Ante interdum</h2>
          </header>
          <div class="mini-posts">
            <article>
              <a href="#" class="image">
                <img src="images/pic07.jpg" alt="" />
              </a>
              <p>
                Aenean ornare velit lacus, ac varius enim lorem ullamcorper
                dolore aliquam.
              </p>
            </article>
            <article>
              <a href="#" class="image">
                <img src="images/pic08.jpg" alt="" />
              </a>
              <p>
                Aenean ornare velit lacus, ac varius enim lorem ullamcorper
                dolore aliquam.
              </p>
            </article>
            <article>
              <a href="#" class="image">
                <img src="images/pic09.jpg" alt="" />
              </a>
              <p>
                Aenean ornare velit lacus, ac varius enim lorem ullamcorper
                dolore aliquam.
              </p>
            </article>
          </div>
          <ul class="actions">
            <li>
              <a href="#" class="button">
                More
              </a>
            </li>
          </ul>
        </section>

        <section>
          <header class="major">
            <h2>Get in touch</h2>
          </header>
          <p>
            Sed varius enim lorem ullamcorper dolore aliquam aenean ornare velit
            lacus, ac varius enim lorem ullamcorper dolore. Proin sed aliquam
            facilisis ante interdum. Sed nulla amet lorem feugiat tempus
            aliquam.
          </p>
          <ul class="contact">
            <li class="icon solid fa-envelope">
              <a href="#">information@untitled.tld</a>
            </li>
            <li class="icon solid fa-phone">(000) 000-0000</li>
            <li class="icon solid fa-home">
              1234 Somewhere Road #8254
              <br />
              Nashville, TN 00000-0000
            </li>
          </ul>
        </section>

        <footer id="footer">
          <p class="copyright">
            © Untitled. All rights reserved. Demo Images:{" "}
            <a href="https://unsplash.com">Unsplash</a>. Design:{" "}
            <a href="https://html5up.net">HTML5 UP</a>.
          </p>
        </footer>
      </div>
      <a href="#sidebar" class="toggle" onClick={toggleSidebar}>
        Toggle
      </a>
    </div>
  );
};
