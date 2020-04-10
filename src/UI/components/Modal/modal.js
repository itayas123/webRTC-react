import React, { Component } from "react";
import "./modal.css";
import { xButton } from "../../../assets";

const ESC = 27;

class Modal extends Component {
  componentDidMount() {
    document.addEventListener("keydown", this.onKeyPress, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.onKeyPress, false);
  }

  onKeyPress = event => {
    const { handleClose } = this.props;
    if (event.keyCode === ESC) {
      handleClose();
    }
  };

  onClickBackground = event => {
    const { children, handleClose } = this.props;
    if (event.target.classList.contains("modal-overlay")) {
      if (children.reset) {
        children.reset();
      }
      handleClose();
    }
  };

  render() {
    const {
      title,
      handleClose,
      show = false,
      children,
      className = ""
    } = this.props;

    return (
      <div
        className={`modal-overlay ${show ? "show" : ""}`}
        onClick={this.onClickBackground}
      >
        <div
          className={`modal modal-effect-1 ${
            show ? "modal-show" : ""
          } ${className}`}
        >
          <section className="modal-main">
            <section className="modal-header">
              <h3>{title}</h3>
              <img
                className="btn-close"
                alt="close"
                onClick={handleClose}
                src={xButton}
              />
            </section>
            <div className="modal-content">{show && children}</div>
          </section>
        </div>
      </div>
    );
  }
}

export default Modal;
