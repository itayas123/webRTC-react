import { Form, Formik } from "formik";
import { observer } from "mobx-react";
import React from "react";
import { Redirect } from "react-router-dom";
import { ROUTES } from "../../../Routes";
import stores from "../../../stores";
import Button from "../../components/Button/button";
import "./login.css";

const { userStore } = stores;
@observer
class Login extends React.Component {
  handleSubmit = async (values) => {
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
        <h1>Sign in</h1>
        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={this.handleSubmit}
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
  }
}

export default Login;
