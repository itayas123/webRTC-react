import React from "react";
import AddItem from "./addItem";
import { connect } from "react-redux";
import * as actionTypes from "../../../../store/actions";

class SourceList extends React.Component {
  componentDidMount = () => {
    const temp = [];
    for (let i = 1; i <= 50; i++) {
      temp.push(i);
    }
    this.props.onInit(temp);
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
    this.props.onPopItem(num);
    this.props.popArray(num);
  };
  pushItem = num => {
    this.props.onPushItem(num);
  };
  renderItems() {
    return (
      this.props.sourceList &&
      this.props.sourceList.map((num, index) => this.item(num, index))
    );
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
    user: state.userReducer.user,
    sourceList: state.sourceReducer.sourceArray
  };
};
const mapDispatch = dispatch => {
  return {
    onPopItem: item => dispatch({ type: actionTypes.POP_ITEM, item }),
    onPushItem: item => dispatch({ type: actionTypes.PUSH_ARRAY, item }),
    onInit: array => dispatch({ type: actionTypes.INIT_ARRAY, array })
  };
};
export default connect(
  mapStateToProp,
  mapDispatch
)(SourceList);
