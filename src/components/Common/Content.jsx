import React from "react";
export const Content = () => {
  return (
    <div>
      <section id="banner">
        <div className="content">
          <header>
            <h1>
              Welcome to ExpenseTracker
              <br />
              Your Personal Finance Companion
            </h1>
            <p>
              Simplify budgeting, track expenses, and take control of your
              finances—all in one place.
            </p>
          </header>
          <p>
            ExpenseTracker is a powerful, user-friendly web application built to
            help individuals and families manage their daily financial
            activities. Add income and expenses, analyze spending habits, and
            generate monthly reports to stay on top of your financial goals.
          </p>
          <ul className="actions">
            <li>
              <a href="/signup" className="content-button big">
                Get Started
              </a>
            </li>
            <li>
              <a href="/features" className="content-button big">
                Explore Features
              </a>
            </li>
          </ul>
        </div>

        <span class="image object">
          <img
            src="src\assets\Images\istockphoto-1424757003-612x612.jpg"
            alt=""
          />
        </span>
      </section>
      <section>
        <header className="major">
          <h2>Powerful Features to Manage Your Finances</h2>
        </header>
        <div className="features">
          <article>
            <span className="icon solid fa-wallet"></span>
            <div className="content">
              <h3>Track Income & Expenses</h3>
              <p>
                Easily log your daily transactions, categorize them, and stay
                aware of your cash flow in real time.
              </p>
            </div>
          </article>
          <article>
            <span className="icon solid fa-chart-pie"></span>
            <div className="content">
              <h3>Visual Reports</h3>
              <p>
                Understand your financial health with clean, visual breakdowns
                of your spending habits and monthly summaries.
              </p>
            </div>
          </article>
          <article>
            <span className="icon solid fa-bullseye"></span>
            <div className="content">
              <h3>Set Budgets</h3>
              <p>
                Create monthly or category-based budgets and get alerts when
                you’re close to overspending.
              </p>
            </div>
          </article>
          <article>
            <span className="icon solid fa-user-shield"></span>
            <div className="content">
              <h3>Secure & Private</h3>
              <p>
                Your data is securely stored and protected. Only you have access
                to your financial details.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section>
        <header class="major">
          <h2>Explore App Modules</h2>
        </header>
        <div class="posts">
          <article>
            
            <h3>Income Tracker</h3>
            <p>
              Log and categorize income sources to stay on top of all earnings.
              View monthly summaries for better planning.
            </p>
            <ul class="actions">
              <li>
                <a href="#" class="button">
                  View
                </a>
              </li>
            </ul>
          </article>
          <article>
            
            <h3>Expense Tracker</h3>
            <p>
              Monitor daily spending across categories. See where your money
              goes and avoid unnecessary expenses.
            </p>
            <ul class="actions">
              <li>
                <a href="#" class="button">
                  View
                </a>
              </li>
            </ul>
          </article>
          <article>
           
            <h3>Budget Planner</h3>
            <p>
              Set monthly budgets and track spending. Stay within limits and
              receive alerts for overspending.
            </p>
            <ul class="actions">
              <li>
                <a href="#" class="button">
                  View
                </a>
              </li>
            </ul>
          </article>
          <article>
            
            <h3>Reports & Insights</h3>
            <p>
              Analyze your income and expenses through graphical reports. Gain
              insights to improve your financial decisions.
            </p>
            <ul class="actions">
              <li>
                <a href="#" class="button">
                  View
                </a>
              </li>
            </ul>
          </article>
          <article>
           
            <h3>Account Management</h3>
            <p>
              Edit your profile, change password, manage preferences, and
              control who sees your data with privacy tools.
            </p>
            <ul class="actions">
              <li>
                <a href="#" class="button">
                  View
                </a>
              </li>
            </ul>
          </article>
          <article>
            
            <h3>Secure Access</h3>
            <p>
              Login with secure credentials and ensure your financial data is
              encrypted and safe from prying eyes.
            </p>
            <ul class="actions">
              <li>
             
              </li>
            </ul>
          </article>
        </div>
      </section>
    </div>
  );
};
