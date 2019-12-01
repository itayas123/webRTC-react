import React from "react";
import { connect } from "react-redux";
import sourceService from "../../../../services/source.service";
import userService from "../../../../services/user.service";
import * as actionTypes from "../../../../store/actions";
import { debounce } from "lodash";
import "./addSource.css";

class AddSource extends React.Component {
  state = {
    displayModal: false,
    name: "",
    src: "",
    search: "",
    usersToDisplay: [],
    filterUsers: [],
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

  renderUserItem = (email, index) => {
    return (
      <div className="item-list" key={`email${email}i${index}`}>
        {email}
        <input
          type="checkbox"
          checked={this.state.usersToSend.includes(email)}
          value={this.state.usersToSend.includes(email)}
          onChange={() => {
            const temp = [...this.state.usersToSend];
            const index = temp.indexOf(email);
            if (index > -1) {
              temp.splice(index, 1);
            } else {
              temp.push(email);
            }
            this.setState({ usersToSend: temp });
          }}
        />
      </div>
    );
  };

  openModal = () => {
    userService
      .getAllUsers()
      .then(res => {
        this.setState({
          usersToDisplay: res,
          filterUsers: res,
          displayModal: true
        });
      })
      .catch(e => {
        alert(e);
      });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { name, src, usersToSend } = this.state;
    sourceService
      .addSource(name, src, usersToSend)
      .then(res => {
        this.props.onPushSource(res);
        this.setState({ Redirect: true, displayModal: false });
      })
      .catch(res => {
        alert(e);
      });
  };

  handleAutoComplete = debounce(() => {
    const filterUsers = this.state.usersToDisplay.filter(email =>
      email.includes(this.state.search)
    );
    this.setState({ filterUsers });
  }, 350);

  handleAllUsersCheckbox = () => {
    if (
      JSON.stringify(this.state.usersToSend) ===
      JSON.stringify(this.state.filterUsers)
    ) {
      this.setState({ usersToSend: [] });
    } else {
      this.setState({
        usersToSend: [...this.state.filterUsers]
      });
    }
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
                  <div className="search-div">
                    <input
                      type="text"
                      placeholder="email"
                      className="search"
                      value={this.state.search}
                      onChange={e => {
                        this.setState({ search: e.target.value });
                        this.handleAutoComplete();
                      }}
                    />
                    <div className="all-users-checkbox">
                      <input
                        type="checkbox"
                        checked={
                          JSON.stringify(this.state.usersToSend) ===
                          JSON.stringify(this.state.filterUsers)
                        }
                        value={
                          JSON.stringify(this.state.usersToSend) ===
                          JSON.stringify(this.state.filterUsers)
                        }
                        onChange={this.handleAllUsersCheckbox}
                      />
                      <div
                        className="pointer"
                        onClick={this.handleAllUsersCheckbox}
                      >
                        All
                      </div>
                    </div>
                  </div>
                  <div className="list">
                    {this.state.filterUsers.map((email, index) =>
                      this.renderUserItem(email, index)
                    )}
                  </div>
                </div>
              )}
              <button type="submit" className="add-source-submit">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatch = dispatch => {
  return {
    onPushSource: source => dispatch({ type: actionTypes.PUSH_SOURCE, source })
  };
};
export default connect(
  null,
  mapDispatch
)(AddSource);
