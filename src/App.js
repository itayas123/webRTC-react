import React from "react";
import { Route, Switch, Link } from "react-router-dom";
import "./App.css";
import Navbar from "./UI/components/Navbar/navbar";
import Login from "./UI/containers/Login/login";
import MediaScreen from "./UI/containers/MediaScreen/mediaScreen";
import { connect } from "react-redux";

class App extends React.Component {
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
    isConnected: state.isConnected
  };
};

export default connect(mapStateToProp)(App);
