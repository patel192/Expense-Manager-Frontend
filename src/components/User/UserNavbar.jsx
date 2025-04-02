import React from "react";
import { Outlet } from "react-router-dom";

export const UserNavbar = () => {
  return (
    <div>
      <header id="header">
        <a href="index.html" class="logo">
          <strong>Hey</strong> Welcome
        </a>
        <ul class="icons">
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
