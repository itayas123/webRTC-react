import React from "react";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import Navbar from "./UI/components/navbar";
import Login from "./UI/containers/login/login";

export default class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Navbar />
        <Switch>
          <Route path="/login-register" component={Login} />
        </Switch>
      </div>
    );
  }
}
