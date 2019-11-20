import React from "react";
import AddItem from "./addItem";
import { connect } from "react-redux";

class SourceList extends React.Component {
  state = {
    arr: []
  };
  componentDidMount = () => {
    const temp = [...this.state.arr];
    for (let i = 1; i <= 50; i++) {
      temp.push(i);
    }
    this.setState({ arr: temp });
  };
  item = (text, index) => {
    return (
      <div className="item-list border" key={index}>
        {this.props.user.admin && (
          <div className="remove pointer" onClick={() => this.removeItem(text)}>
            x
          </div>
        )}
        <div>{text}</div>
        <div>
          <button
            disabled={
              this.props.space === 0 || this.props.videoArray.includes(text)
            }
            onClick={() => {
              this.props.pushArray(text);
            }}
          >
            +
          </button>
          <button
            disabled={!this.props.videoArray.includes(text)}
            onClick={() => {
              this.props.popArray(text);
            }}
          >
            -
          </button>
        </div>
      </div>
    );
  };
  removeItem = num => {
    const temp = [...this.state.arr];
    const index = temp.indexOf(num);
    if (index > -1) {
      temp.splice(index, 1);
    }
    this.setState({ arr: temp });
    this.props.popArray(num);
  };
  pushItem = num => {
    const temp = [...this.state.arr];
    temp.push(num);
    this.setState({ arr: temp });
  };
  renderItems() {
    return this.state.arr.map((num, index) => this.item(num, index));
  }
  render() {
    return (
      <div>
        <div className="source-list border">
          <div className="list">{this.renderItems()}</div>
        </div>
        {this.props.user.admin && <AddItem pushItem={this.pushItem} />}
      </div>
    );
  }
}
const mapStateToProp = state => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProp)(SourceList);
