import React from "react";
import "./sidebar.css";
import ControlPanel from "../MediaScreen/ControlPanel/controlPanel";
import { xButton } from "../../../assets";

const sidebar = ({ show, hideSidebar }) => {
  return (
    <div className={`sidebar ${show ? "show-sidebar" : ""}`}>
      <div className="sidebar-title">
        <img
          className="sidebar-close"
          alt="close"
          onClick={hideSidebar}
          src={xButton}
        />
      </div>
      <ControlPanel />
    </div>
  );
};

export default sidebar;
