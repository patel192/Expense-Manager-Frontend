import React from "react";
import { Navbar } from "../Common/Navbar";

export const PublicLayout = () => {
  return (
    <div id="wrapper" className="public-layout">
      <div id="main">
        <div className="inner">
          <Navbar />
        </div>
      </div>
    </div>
  );
};
