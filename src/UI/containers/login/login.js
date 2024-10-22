import { Form, Formik } from "formik";
import { observer } from "mobx-react";
import React from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { ROUTES } from "../../../Routes/Routes";
import stores from "../../../stores";
import { validateEmail } from "../../../utils";
import Button from "../../components/Button/button";
import FormError from "../../components/Input/formError";
import "./login.css";

const { userStore } = stores;

const validate = (values) => {
  const errors = {};
  if (!values.email) {
    errors.email = "Required";
  } else if (!validateEmail(values.email)) {
    errors.email = "Invalid email address";
  }
  if (!values.password) {
    errors.password = "Required";
  } else if (values.password.length < 8) {
    errors.password = "At least 8 characters";
  }
  return errors;
};

const handleSubmit = async (values, history) => {
  const { email, password } = values;
  const { login } = userStore;

  try {
    await login(email, password);
    toast("Welcome to Namer");
    history.push(ROUTES.HOME);
  } catch (err) {
    toast.error(err.message);
  }
};

const Login = () => {
  const history = useHistory();
  return (
    <div className="login">
      <h1>Sign in</h1>
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={(values) => handleSubmit(values, history)}
        validate={validate}
      >
        {({ values, handleChange, handleBlur, handleSubmit }) => (
          <Form className="form" onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="email"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
            />
            <FormError name="email" />
            <input
              type="password"
              name="password"
              placeholder="password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
            />
            <FormError name="password" />
            <Button type="submit">Submit</Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default observer(Login);
