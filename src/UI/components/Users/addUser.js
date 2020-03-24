import React, { Component } from "react";
import Modal from "../Modal/modal";

class AddUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      isAdmin: false
    };
  }

  componentDidUpdate() {
    //TODO: change this
    const { show, initialValues } = this.props;
    if (show && !this.state.name) {
      const { name = "", email = "", admin = false } = initialValues || {};
      this.setState({ name, email, isAdmin: admin });
    }
  }

  handleChange = (name, value) => {
    this.setState({ [name]: value });
  };

  render() {
    const { show, onClose } = this.props;
    return (
      <Modal show={show} handleClose={onClose} title="Add/Edit User">
        <form className="form">
          <input
            type="text"
            required
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
            autoComplete="new-password"
            value={this.state.email}
            onChange={e => {
              this.handleChange("email", e.target.value);
            }}
          />
          <input
            type="password"
            required
            placeholder="password"
            autoComplete="new-password"
            value={this.state.password}
            onChange={e => {
              this.handleChange("password", e.target.value);
            }}
          />
          <div className="admin-checkbox">
            <input
              type="checkbox"
              required
              checked={this.state.isAdmin}
              onChange={e => {
                this.handleChange("isAdmin", !this.state.isAdmin);
              }}
            />
            <label>Is Admin?</label>
          </div>
        </form>
      </Modal>
    );
  }
}
export default AddUser;
