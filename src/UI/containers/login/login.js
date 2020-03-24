import { observer } from "mobx-react";
import React from "react";
import { Redirect } from "react-router-dom";
import { ROUTES } from "../../../Routes";
import stores from "../../../stores";
import "./login.css";
import Button from "../../components/Button/button";
import { Formik, Form, Field } from "formik";
import Input from "../../components/Input/input";

const { userStore } = stores;
@observer
class Login extends React.Component {
  handleSubmit = async values => {
    const { email, password } = values;
    const { login } = userStore;

    try {
      await login(email, password);
    } catch (e) {
      alert(e);
    }
  };

  render() {
    if (userStore.getUser.name) return <Redirect to={ROUTES.HOME} />;

    return (
      <div className="login">
        <h1>Login</h1>
        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={this.handleSubmit}
          render={({ values }) => {
            return (
              <Form className="form">
                <Field
                  name="email"
                  render={({ field }) => (
                    <Input
                      placeholder="email"
                      id="email"
                      type="email"
                      {...field}
                    />
                  )}
                />
                <Field
                  name="password"
                  render={({ field }) => (
                    <Input
                      placeholder="password"
                      id="password"
                      type="password"
                      {...field}
                    />
                  )}
                />
                <Button type="submit">Submit</Button>
              </Form>
            );
          }}
        />
      </div>
    );
  }
}

export default Login;
