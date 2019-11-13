import "./login.css";
import React from "react";
import API from "../../../utils/API";

export default class Login extends React.Component {
  state = {
    email: "",
    password: "",
    name: "",
    register: true,
    isConnected: false
  };
  onSubmit = e => {
    e.preventDefault();
    const { name, email, password } = this.state;
    if (this.state.register) {
      API.post("/users", { name, email, password })
        .then(res => {
          console.log(res.data);
          this.setState({ isConnected: true });
        })
        .catch(res => {
          console.log(JSON.stringify(res));
        });
    } else {
      API.get(`/auth?email=${email}&password=${password}`)
        .then(res => {
          this.setState({ isConnected: true });
          console.log(res.data);
        })
        .catch(res => {
          console.log(res);
        });
    }
  };

  render() {
    return (
      <div className="main">
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
        <form onSubmit={this.onSubmit} className="form">
          <input
            type="text"
            className={this.state.register ? "" : "hide"}
            required={this.state.register}
            placeholder="name"
            value={this.state.name}
            onChange={e => {
              this.setState({ name: e.target.value });
            }}
          />
          <input
            type="email"
            required
            placeholder="email"
            value={this.state.email}
            onChange={e => {
              this.setState({ email: e.target.value });
            }}
          />
          <input
            type="password"
            required
            placeholder="password"
            value={this.state.password}
            onChange={e => {
              this.setState({ password: e.target.value });
            }}
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}
