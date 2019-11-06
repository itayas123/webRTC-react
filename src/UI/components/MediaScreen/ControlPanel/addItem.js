import React from "react";
import "./addItem.css";

export default class AddItem extends React.Component {
  state = {
    displayModal: false,
    name: ""
  };
  componentDidMount = () => {
    const modal = document.getElementById("addModal");
    window.onclick = e => {
      if (e.target === modal) {
        this.setState({ displayModal: false });
      }
    };
  };
  render() {
    return (
      <div>
        <button
          className="add-btn"
          onClick={() => {
            this.setState({ displayModal: true });
          }}
        >
          Add
        </button>
        <div
          className={`modal ${
            this.state.displayModal ? "modal-block" : "modal-none"
          }`}
          id="addModal"
        >
          <div className="modal-content">
            <span
              onClick={() => {
                this.setState({ displayModal: false });
              }}
              className="close"
            >
              x
            </span>
            <form
              onSubmit={e => {
                e.preventDefault();
                this.props.pushItem(this.state.name);
                this.setState({ displayModal: false });
              }}
              className="form"
            >
              <input
                type="text"
                required
                placeholder="name"
                value={this.state.name}
                onChange={e => {
                  this.setState({ name: e.target.value });
                }}
              />
              <button type="submit" className="add-item-submit">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
