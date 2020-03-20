import React from "react";
import { Link } from "react-router-dom";
import "./navbar.css";
import { sidebarIcon } from "../../../assets";

const navbar = ({ name, logout, showSidebar }) => {
  return (
    <div className="navbar">
      <img
        className="sidebar-icon"
        onClick={showSidebar}
        src={sidebarIcon}
        alt="sidebar"
      />
      <Link to="/">Media Screen</Link>
      <div>
        {name ? (
          <div className="hello-div">
            {`Hello ${name} -`}
            <p onClick={logout}>Logout</p>
          </div>
        ) : (
          <Link to="/login-register">Login/ Register</Link>
        )}
      </div>
    </div>
  );
};

export default navbar;
