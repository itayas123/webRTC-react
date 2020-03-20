import React from "react";
import "./sidebar.css";
import ControlPanel from "../MediaScreen/ControlPanel/controlPanel";

const sidebar = ({ show, hideSidebar }) => {
  return (
    <div className={`sidebar ${show ? "show-sidebar" : ""}`}>
      <button onClick={hideSidebar}>hide</button>
      <ControlPanel />
    </div>
  );
};

export default sidebar;
