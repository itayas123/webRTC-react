import React from "react";
import { Link } from "react-router-dom";
import "./navbar.css";
import { sidebarIcon, logout, tiger } from "../../../assets";

const navbar = ({ name, onLogout, showSidebar }) => {
  return (
    <div className="navbar">
      <img
        className="sidebar-icon"
        onClick={showSidebar}
        src={sidebarIcon}
        alt="sidebar"
      />
      <div className="hello-div">
        <img src={tiger} className="tiger" />
        נמ"ר
      </div>
      <div>
        {name ? (
          <div className="hello-div">
            {`Hello ${name} -`}
            <p onClick={onLogout}>Logout</p>
            <img src={logout} className="logout-img" onClick={onLogout} />
          </div>
        ) : (
          <Link className="hello-div" to="/login-register">
            Login/ Register
          </Link>
        )}
      </div>
    </div>
  );
};

export default navbar;
