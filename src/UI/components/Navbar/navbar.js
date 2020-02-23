import React from "react";
import { Link } from "react-router-dom";
import "./navbar.css";
import stores from "../../../stores";
import { observer } from "mobx-react";

const { userStore } = stores;

@observer
class Navbar extends React.Component {
  render = () => {
    console.log(userStore.currentUser.name);
    return (
      <div className="navbar">
        <Link to="/">Media Screen</Link>
        {userStore.currentUser.name ? (
          <div className="hello-div">
            {`Hello ${userStore.currentUser.name} -`}
            <p onClick={userStore.logout}>Logout</p>
          </div>
        ) : (
          <Link to="/login-register">Login/ Register</Link>
        )}
      </div>
    );
  };
}

export default Navbar;
