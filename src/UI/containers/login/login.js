import { observer } from "mobx-react";
import React from "react";
import { Redirect } from "react-router-dom";
import { ROUTES } from "../../../Routes";
import stores from "../../../stores";
import "./login.css";
import Button from "../../components/Button/button";

const { userStore } = stores;
@observer
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      name: "",
      register: false
    };
  }

  handleSubmit = async e => {
    e.preventDefault();
    const { name, email, password } = this.state;
    const { history } = this.props;
    const { login, register } = userStore;

    try {
      if (this.state.register) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
    } catch (e) {
      alert(e);
    }
  };

  handleChange = (name, value) => {
    this.setState({ [name]: value });
  };

  render() {
    if (userStore.getUser.name) return <Redirect to={ROUTES.HOME} />;

    return (
      <div className="main">
        <div className="buttons">
          <Button
            className={this.state.register ? "" : "un-active"}
            onClick={() => {
              this.setState({ register: true });
            }}
          >
            Register
          </Button>
          <Button
            className={this.state.register ? "un-active" : ""}
            onClick={() => {
              this.setState({ register: false });
            }}
          >
            Login
          </Button>
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
          <Button type="submit">Submit</Button>
        </form>
      </div>
    );
  }
}

export default Login;
