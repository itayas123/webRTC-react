import "./main.css";
import React from "react";

export default class Main extends React.Component {
  state = {
    email: "",
    password: "",
    name: ""
  };

  render() {
    return (
      <div className="main">
        <div className="buttons">
          <button
            onClick={() => {
              this.setState({ register: true });
            }}
          >
            Register
          </button>
          <button
            onClick={() => {
              this.setState({ register: false });
            }}
          >
            Login
          </button>
        </div>
        <div className="form">
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
          <button onClick={this.onSubmit}>Submit</button>
        </div>
      </div>
    );
  }
}
