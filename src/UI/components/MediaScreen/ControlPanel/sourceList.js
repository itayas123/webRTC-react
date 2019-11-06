import React from "react";

export default class SourceList extends React.Component {
  item(text) {
    return (
      <div className="item-list border">
        <div>{text}</div>
        <div>
          <button>+</button>
          <button>-</button>
        </div>
      </div>
    );
  }
  renderItems() {
    const arr = [];
    for (let i = 0; i < 50; i++) {
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
