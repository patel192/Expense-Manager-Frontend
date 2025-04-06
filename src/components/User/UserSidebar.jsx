import React from "react";
import { Link } from "react-router-dom";

export const UserSidebar = () => {
  return (
    <div id="sidebar" class="">
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
              <a href="#">Reports</a>
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
      <a href="#sidebar" class="toggle">
        Toggle
      </a>
    </div>
  );
};
