import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Login from "../UI/containers/login/login";
import MediaScreen from "../UI/containers/MediaScreen/mediaScreen";
import UsersManagement from "../UI/containers/Users/usersManagement";
import SourcesManagement from "../UI/containers/Sources/sourcesManagement";
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
          <AdminRoute path={ROUTES.USERS} component={UsersManagement} />
          <AdminRoute path={ROUTES.SOURCES} component={SourcesManagement} />
          <Route path={ROUTES.LOGIN} component={Login} />
        </Switch>
      </div>
    );
  }
}

export default Routes;
