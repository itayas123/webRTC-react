import { Form, Formik } from "formik";
import { observer } from "mobx-react";
import React from "react";
import { withRouter } from "react-router-dom";
import { ROUTES } from "../../../Routes/Routes";
import stores from "../../../stores";
import Button from "../../components/Button/button";
import "./login.css";

const { userStore } = stores;

const Login = ({ history }) => {
  const handleSubmit = async (values) => {
    const { email, password } = values;
    const { login } = userStore;

    try {
      await login(email, password);
      history.push(ROUTES.HOME);
    } catch (e) {
      alert(e);
    }
  };

  return (
    <div className="login">
      <h1>Sign in</h1>
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          /* and other goodies */
        }) => (
          <Form className="form" onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="email"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
            />
            <input
              type="password"
              name="password"
              placeholder="password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
            />
            <Button type="submit">Submit</Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default withRouter(observer(Login));
