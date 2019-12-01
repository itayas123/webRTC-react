import React from "react";
import { Route, Switch, Link } from "react-router-dom";
import "./App.css";
import Navbar from "./UI/components/Navbar/navbar";
import Login from "./UI/containers/Login/login";
import MediaScreen from "./UI/containers/MediaScreen/mediaScreen";
import { connect } from "react-redux";
import userService from "./services/user.service";
import * as actionTypes from "./store/actions";

class App extends React.Component {
  componentDidMount() {
    userService
      .getCurrentUser()
      .then(user => {
        if (user) {
          this.props.onLogin(user);
        }
      })
      .catch(e => {
        alert(e);
      });
  }

  render() {
    return (
      <div className="App">
        <Navbar />
        <Switch>
          <Route exact path="/">
            {this.props.isConnected ? (
              <MediaScreen />
            ) : (
              <div>
                <h1>You need to connect to see this page</h1>
                <Link to="/login-register">Login/ Register</Link>
              </div>
            )}
          </Route>
          <Route path="/login-register">
            <Login />
          </Route>
        </Switch>
      </div>
    );
  }
}
const mapStateToProp = state => {
  return {
    isConnected: state.userReducer.isConnected
  };
};
const mapDispatch = dispatch => {
  return {
    onLogin: user => dispatch({ type: actionTypes.LOGIN, user: user })
  };
};
export default connect(
  mapStateToProp,
  mapDispatch
)(App);
