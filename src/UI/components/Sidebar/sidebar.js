import React from "react";
import { xButton } from "../../../assets";
import SourceList from "../MediaScreen/SourceList/sourceList";
import "./sidebar.css";

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
      <SourceList />
    </div>
  );
};

export default sidebar;
