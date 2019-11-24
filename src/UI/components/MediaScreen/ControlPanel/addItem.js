import React from "react";
import "./addItem.css";
import API from "../../../../utils/API";
import { connect } from "react-redux";
import * as actionTypes from "../../../../store/actions";

class AddItem extends React.Component {
  state = {
    displayModal: false,
    name: "",
    src: "",
    usersToDisplay: [],
    usersToSend: []
  };

  componentDidMount = () => {
    const modal = document.getElementById("addModal");
    window.onclick = e => {
      if (e.target === modal) {
        this.setState({ displayModal: false });
      }
    };
  };

  renderUserItem = (value, key) => {
    return (
      <div className="item-list" key={key}>
        {value}
        <input
          type="checkbox"
          value={this.state.usersToSend.includes(value)}
          onChange={() => {
            const temp = [...this.state.usersToSend];
            const index = temp.indexOf(value);
            if (index > -1) {
              temp.splice(index, 1);
            } else {
              temp.push(value);
            }
            this.setState({ usersToSend: temp });
          }}
        />
      </div>
    );
  };

  openModal = () => {
    API.get("/users")
      .then(res => {
        if (res.data.error) {
          alert(res.data.error);
        } else if (res.data.data) {
          this.setState({
            usersToDisplay: res.data.data,
            displayModal: true
          });
        }
      })
      .catch(res => {
        console.error(JSON.stringify(res));
      });
  };

  handleSubmit = e => {
    e.preventDefault();
    API.post("/sources", {
      source: { name: this.state.name, src: this.state.src },
      users: this.state.usersToSend
    })
      .then(res => {
        if (res.data.error) {
          alert(res.data.error);
        } else if (res.data.data) {
          this.props.onPushSource(res.data.data);
          this.setState({ Redirect: true, displayModal: false });
        }
      })
      .catch(res => {
        console.error(JSON.stringify(res));
      });
  };

  render() {
    return (
      <div>
        <button className="add-btn" onClick={this.openModal}>
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
            <form onSubmit={this.handleSubmit} className="form">
              <input
                type="text"
                required
                placeholder="name"
                value={this.state.name}
                onChange={e => {
                  this.setState({ name: e.target.value });
                }}
              />
              <input
                type="text"
                required
                placeholder="src"
                value={this.state.src}
                onChange={e => {
                  this.setState({ src: e.target.value });
                }}
              />
              {this.state.usersToDisplay.length > 0 && (
                <div className="users-list">
                  <div className="list">
                    {this.state.usersToDisplay.map(user =>
                      this.renderUserItem(user.email, user._id)
                    )}
                  </div>
                </div>
              )}
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
const mapStateToProp = state => {
  return {};
};
const mapDispatch = dispatch => {
  return {
    onPushSource: source => dispatch({ type: actionTypes.PUSH_SOURCE, source })
  };
};
export default connect(
  mapStateToProp,
  mapDispatch
)(AddItem);
