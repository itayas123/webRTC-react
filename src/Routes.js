import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Login from "./UI/containers/login/login";
import MediaScreen from "./UI/containers/MediaScreen/mediaScreen";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  USERS: "/users",
  SOURCES: "/sources"
};

class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route exact path={ROUTES.HOME}>
          <MediaScreen />
        </Route>
        <Route path={ROUTES.LOGIN}>
          <Login />
        </Route>
      </Switch>
    );
  }
}

export default Routes;
