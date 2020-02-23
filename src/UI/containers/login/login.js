import React from "react";
import { Redirect } from "react-router-dom";
import "./login.css";
import stores from "../../../stores";
import { observer } from "mobx-react";

const { userStore } = stores;

const Login = observer(
  class Login extends React.Component {
    state = {
      email: "",
      password: "",
      name: "",
      register: false,
      Redirect: false
    };

    handleSubmit = async e => {
      e.preventDefault();

      const { name, email, password } = this.state;

      try {
        if (this.state.register) {
          await userStore.register(name, email, password);
        } else {
          await userStore.login(email, password);
        }
        this.setState({ Redirect: true });
      } catch (e) {
        alert(e);
      }
    };

    handleChange = (name, value) => {
      this.setState({ [name]: value });
    };

    render() {
      return (
        <div className="main">
          {this.state.Redirect && <Redirect to="/" />}
          <div className="buttons">
            <button
              className={this.state.register ? "" : "un-active"}
              onClick={() => {
                this.setState({ register: true });
              }}
            >
              Register
            </button>
            <button
              className={this.state.register ? "un-active" : ""}
              onClick={() => {
                this.setState({ register: false });
              }}
            >
              Login
            </button>
          </div>
          <form onSubmit={this.handleSubmit} className="form">
            <input
              type="text"
              className={this.state.register ? "" : "hide"}
              required={this.state.register}
              placeholder="name"
              value={this.state.name}
              onChange={e => {
                this.handleChange("name", e.target.value);
              }}
            />
            <input
              type="email"
              required
              placeholder="email"
              value={this.state.email}
              onChange={e => {
                this.handleChange("email", e.target.value);
              }}
            />
            <input
              type="password"
              required
              placeholder="password"
              value={this.state.password}
              onChange={e => {
                this.handleChange("password", e.target.value);
              }}
            />
            <button type="submit">Submit</button>
          </form>
        </div>
      );
    }
  }
);

export default Login;
