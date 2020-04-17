import React from "react";
import { observer } from "mobx-react";
import stores from "../stores";
import { Redirect, Route } from "react-router-dom";
import { ROUTES } from "./Routes";

const { userStore } = stores;

const AdminRoute = ({ path, component: Component, ...rest }) => {
  if (!userStore.getUser.admin) return <Redirect to={ROUTES.HOME} />;

  return <Route path={path} component={Component} {...rest} />;
};

export default observer(AdminRoute);
