import "./navbar.css";
import React from "react";
import { Link } from "react-router-dom";

export default class Navbar extends React.Component {
  render() {
    return (
      <div className="navbar">
        <Link to="/">Home</Link>
        <Link to="/media-screen">Media Screen</Link>
        <Link to="/login-register">Login/ Register</Link>
      </div>
    );
  }
}
