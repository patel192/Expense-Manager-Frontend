import React, { useState } from "react";
import { SideBar } from "./SideBar";
import { Navbar } from "./Navbar";


export const HomePage = () => {

  const [isOpen, setIsOpen] = useState(false);

const toggleSidebar = () => {
  setIsOpen(!isOpen);
};
  return (
    <>
      <div id="wrapper">
        <div id="main">
          <Navbar toggleSidebar={toggleSidebar}></Navbar>
        </div>
        <SideBar isOpen={isOpen}></SideBar>
      </div>
    </>
  );
};
