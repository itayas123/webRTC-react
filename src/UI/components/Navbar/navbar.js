import { inject, observer } from "mobx-react";
import React from "react";
import { Link } from "react-router-dom";
import { USER_STORE } from "../../../stores";
import "./navbar.css";

@inject(USER_STORE)
@observer
class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.userStore = this.props.userStore;
  }

  render = () => {
    return (
      <div className="navbar">
        <Link to="/">Media Screen</Link>
        {this.userStore.getUser.name ? (
          <div className="hello-div">
            {`Hello ${this.userStore.getUser.name} -`}
            <p onClick={this.userStore.logout}>Logout</p>
          </div>
        ) : (
          <Link to="/login-register">Login/ Register</Link>
        )}
      </div>
    );
  };
}

export default Navbar;
