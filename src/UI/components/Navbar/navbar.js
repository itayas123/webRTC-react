import "./navbar.css";
import React from "react";
import { Link } from "react-router-dom";
import * as actionTypes from "../../../store/actions";
import { connect } from "react-redux";

class Navbar extends React.Component {
  render = () => {
    return (
      <div className="navbar">
        <Link to="/">Media Screen</Link>
        {this.props.isConnected ? (
          <div className="hello-div">
            {`Hello ${this.props.user.name} -`}
            <p onClick={this.props.onLogout}>Logout</p>
          </div>
        ) : (
          <Link to="/login-register">Login/ Register</Link>
        )}
      </div>
    );
  };
}

const mapStateToProp = state => {
  return {
    isConnected: state.userReducer.isConnected,
    user: state.userReducer.user
  };
};

const mapDispatch = dispatch => {
  return {
    onLogout: () => dispatch({ type: actionTypes.LOGOUT, user: null })
  };
};
export default connect(
  mapStateToProp,
  mapDispatch
)(Navbar);
