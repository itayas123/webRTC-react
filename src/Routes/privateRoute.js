import React from "react";
import { observer } from "mobx-react";
import stores from "../stores";
import { Redirect, Route } from "react-router-dom";
import { ROUTES } from "./Routes";

const { userStore } = stores;

const PrivateRoute = ({ path, component: Component, ...rest }) => {
  if (!userStore.getUser.name) return <Redirect to={ROUTES.LOGIN} />;

  return <Route path={path} component={Component} {...rest} />;
};

export default observer(PrivateRoute);
