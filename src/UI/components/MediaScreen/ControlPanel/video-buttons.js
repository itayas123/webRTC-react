import React from "react";
import { connect } from "react-redux";
import * as actionTypes from "../../../../stores/actions";
class VideoButtons extends React.Component {
  render() {
    return (
      <div className="video-buttons">
        <div
          className="butoon-width border-2p pointer"
          onClick={() => {
            this.props.onChangeSplit(1);
          }}
        />
        <div
          className="butoon-width border flex pointer"
          onClick={() => {
            this.props.onChangeSplit(2);
          }}
        >
          <div className="width-50p border" />
          <div className="width-50p border" />
        </div>
        <div
          className="butoon-width border pointer"
          onClick={() => {
            this.props.onChangeSplit(3);
          }}
        >
          <div className="height-48p border" />
          <div className="height-48p border" />
        </div>
        <div
          className="butoon-width border pointer"
          onClick={() => {
            this.props.onChangeSplit(4);
          }}
        >
          <div className="height-48p flex">
            <div className="width-50p border" />
            <div className="width-50p border" />
          </div>
          <div className="height-48p flex">
            <div className="width-50p border" />
            <div className="width-50p border" />
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatch = dispatch => {
  return {
    onChangeSplit: split => dispatch({ type: actionTypes.CHANGE_SPLIT, split })
  };
};
export default connect(
  null,
  mapDispatch
)(VideoButtons);
