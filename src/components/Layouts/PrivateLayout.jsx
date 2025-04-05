import React from "react";
import { UserNavbar } from "../User/UserNavbar";
import { UserSidebar } from "../User/UserSidebar";

export const PrivateLayout = () => {
  return (
    <div id="wrapper" className="user-layout">
      <div id="main">
        <div className="inner">
          <UserNavbar></UserNavbar>
        </div>
      </div>
      <UserSidebar></UserSidebar>
    </div>
  );
};
