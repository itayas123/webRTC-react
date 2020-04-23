import React from "react";
import { Link, useLocation } from "react-router-dom";
import { logout, sidebarIcon, tiger } from "../../../assets";
import { ROUTES } from "../../../Routes/Routes";
import "./navbar.css";

const Navbar = ({ user, onLogout, showSidebar }) => {
  const { name, admin } = user;
  const location = useLocation();
  const isHomePage = location.pathname === ROUTES.HOME;
  return (
    <div className="navbar">
      <img
        className={`sidebar-icon ${isHomePage ? "" : "disabled"}`}
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

export default Navbar;
