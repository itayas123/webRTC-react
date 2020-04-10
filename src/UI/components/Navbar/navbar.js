import React from "react";
import { Link } from "react-router-dom";
import "./navbar.css";
import { sidebarIcon, logout, tiger } from "../../../assets";
import { ROUTES } from "../../../Routes";

const navbar = ({ user, onLogout, showSidebar }) => {
  const { name, admin } = user;
  return (
    <div className="navbar">
      <img
        className="sidebar-icon"
        onClick={showSidebar}
        src={sidebarIcon}
        alt="sidebar"
      />
      <Link className="hello-div" to={ROUTES.HOME}>
        <img src={tiger} className="tiger" alt="tiger" />
        נמ"ר
      </Link>
      {admin && (
        <>
          <Link className="hello-div" to={ROUTES.USERS}>
            Users
          </Link>
          <Link className="hello-div" to={ROUTES.SOURCES}>
            Sources
          </Link>
        </>
      )}
      <div>
        {name ? (
          <div className="hello-div">
            {`Hello ${name} -`}
            <p onClick={onLogout}>Logout</p>
            <img
              src={logout}
              className="logout-img"
              alt="logout"
              onClick={onLogout}
            />
          </div>
        ) : (
          <Link className="hello-div" to={ROUTES.LOGIN}>
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default navbar;
