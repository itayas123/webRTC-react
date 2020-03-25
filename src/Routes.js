import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Login from "./UI/containers/login/login";
import MediaScreen from "./UI/containers/MediaScreen/mediaScreen";
import Users from "./UI/containers/Users/users";
import Sources from "./UI/containers/Sources/sources";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  USERS: "/users",
  SOURCES: "/sources"
};

class Routes extends Component {
  render() {
    return (
      <div className="routes">
        <Switch>
          <Route exact path={ROUTES.HOME}>
            <MediaScreen />
          </Route>
          <Route path={ROUTES.LOGIN}>
            <Login />
          </Route>
          <Route path={ROUTES.USERS}>
            <Users />
          </Route>
          <Route path={ROUTES.SOURCES}>
            <Sources />
          </Route>
        </Switch>
      </div>
    );
  }
}

export default Routes;
