import React from "react";
import { Link } from "react-router-dom";
import "./navbar.css";

const navbar = ({ name, logout, showSidebar }) => {
  return (
    <div className="navbar">
      <button onClick={showSidebar}>sidevar</button>
      <Link to="/">Media Screen</Link>
      {name ? (
        <div className="hello-div">
          {`Hello ${name} -`}
          <p onClick={logout}>Logout</p>
        </div>
      ) : (
        <Link to="/login-register">Login/ Register</Link>
      )}
    </div>
  );
};

export default navbar;
