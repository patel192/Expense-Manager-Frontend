import React from "react";
import { Outlet } from "react-router-dom";
import { logout } from "../Utils/Logout";
export const UserNavbar = () => {
  return (
    <div>
      <header id="header">
        <a href="/" class="logo">
          <strong style={{ color: "white" }}>Trackit</strong> | Expense App
        </a>
        <ul class="icons">
          <button className="logout-btn" onClick={logout}>
            logout
          </button>
          <li>
            <a href="#" class="icon brands fa-twitter">
              <span class="label">Twitter</span>
            </a>
          </li>
          <li>
            <a href="#" class="icon brands fa-facebook-f">
              <span class="label">Facebook</span>
            </a>
          </li>
          <li>
            <a href="#" class="icon brands fa-snapchat-ghost">
              <span class="label">Snapchat</span>
            </a>
          </li>
          <li>
            <a href="#" class="icon brands fa-instagram">
              <span class="label">Instagram</span>
            </a>
          </li>
          <li>
            <a href="#" class="icon brands fa-medium-m">
              <span class="label">Medium</span>
            </a>
          </li>
        </ul>
      </header>

      <div className="middle">
        <Outlet></Outlet>
      </div>
    </div>
  );
};
