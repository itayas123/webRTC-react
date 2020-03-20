import React from "react";
import { Link } from "react-router-dom";
import "./navbar.css";
import { sidebarIcon, logout } from "../../../assets";

const navbar = ({ name, onLogout, showSidebar }) => {
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
            <p onClick={onLogout}>Logout</p>
            <img src={logout} className="logout-img" onClick={onLogout} />
          </div>
        ) : (
          <Link to="/login-register">Login/ Register</Link>
        )}
      </div>
    </div>
  );
};

export default navbar;
