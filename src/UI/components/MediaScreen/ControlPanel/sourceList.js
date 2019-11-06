import React from "react";

export default class SourceList extends React.Component {
  item(text) {
    return (
      <div className="item-list border">
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
  }
  renderItems() {
    const arr = [];
    for (let i = 1; i <= 50; i++) {
      arr.push(i);
    }
    return arr.map(num => this.item(num));
  }
  render() {
    return (
      <div className="source-list border">
        <div className="list">{this.renderItems()}</div>
      </div>
    );
  }
}
