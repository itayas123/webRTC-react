import React from "react";

export default class SourceList extends React.Component {
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
        <div className="remove pointer" onClick={() => this.removeItem(text)}>
          x
        </div>
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
  };
  renderItems() {
    return this.state.arr.map((num, index) => this.item(num, index));
  }
  render() {
    return (
      <div className="source-list border">
        <div className="list">{this.renderItems()}</div>
      </div>
    );
  }
}
