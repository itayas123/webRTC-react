import React from "react";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import Navbar from "./UI/components/Navbar/navbar";
import Login from "./UI/containers/Login/login";
import MediaScreen from "./UI/containers/MediaScreen/mediaScreen";
import Welcome from "./UI/containers/Welcome/welcome";

export default class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Navbar />
        <Switch>
          <Route exact path="/">
            <Welcome />
          </Route>
          <Route path="/media-screen">
            <MediaScreen />
          </Route>
          <Route path="/login-register">
            <Login />
          </Route>
        </Switch>
      </div>
    );
  }
}
