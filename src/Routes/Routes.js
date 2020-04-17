import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Login from "../UI/containers/login/login";
import MediaScreen from "../UI/containers/MediaScreen/mediaScreen";
import Users from "../UI/containers/Users/users";
import Sources from "../UI/containers/Sources/sources";
import PrivateRoute from "./privateRoute";
import AdminRoute from "./adminRoute";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  USERS: "/users",
  SOURCES: "/sources",
};

class Routes extends Component {
  render() {
    return (
      <div className="routes">
        <Switch>
          <PrivateRoute exact path={ROUTES.HOME} component={MediaScreen} />
          <AdminRoute path={ROUTES.USERS} component={Users} />
          <AdminRoute path={ROUTES.SOURCES} component={Sources} />
          <Route path={ROUTES.LOGIN} component={Login} />
        </Switch>
      </div>
    );
  }
}

export default Routes;
