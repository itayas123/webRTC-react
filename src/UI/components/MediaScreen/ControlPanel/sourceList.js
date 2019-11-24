import React from "react";
import AddItem from "./addItem";
import { connect } from "react-redux";
import * as actionTypes from "../../../../store/actions";
import API from "../../../../utils/API";

class SourceList extends React.Component {
  componentDidMount = () => {
    API.get(`/sources?email=${this.props.user.email}`)
      .then(res => {
        this.props.onInit(res);
      })
      .catch(e => {
        alert(e);
      });
  };

  spaceInVideoArray = () => {
    return (
      (this.props.videoSplit === 3
        ? this.props.videoSplit - 1 - this.props.videoArray.length
        : this.props.videoSplit - this.props.videoArray.length) !== 0
    );
  };

  renderSource = (source, index) => {
    return (
      <div className="item-list border" key={index}>
        {this.props.user.admin && (
          <div
            className="remove pointer"
            onClick={() => this.removeSource(source)}
          >
            x
          </div>
        )}
        <div>{source.name}</div>
        <div>
          <button
            disabled={
              !this.spaceInVideoArray() ||
              this.props.videoArray.includes(source.name)
            }
            onClick={() => {
              this.props.onPushVideo(source.name);
            }}
          >
            +
          </button>
          <button
            disabled={!this.props.videoArray.includes(source.name)}
            onClick={() => {
              this.props.onPopVideo(source.name);
            }}
          >
            -
          </button>
        </div>
      </div>
    );
  };
  removeSource = source => {
    API.delete(`/sources?name=${source.name}`)
      .then(res => {
        if (res) {
          this.props.onPopSource(source);
          this.props.onPopVideo(source.name);
        }
      })
      .catch(e => {
        alert(e);
      });
  };
  renderSouresList() {
    return (
      this.props.sourceList &&
      this.props.sourceList.map((source, index) =>
        this.renderSource(source, index)
      )
    );
  }
  render() {
    return (
      <div>
        <div className="source-list border">
          <div className="list">{this.renderSouresList()}</div>
        </div>
        {this.props.user.admin && <AddItem />}
      </div>
    );
  }
}
const mapStateToProp = state => {
  return {
    user: state.userReducer.user,
    sourceList: state.sourceReducer.sourceArray,
    videoArray: state.videoReducer.videoArray,
    videoSplit: state.videoReducer.videoSplit
  };
};
const mapDispatch = dispatch => {
  return {
    onPopSource: source => dispatch({ type: actionTypes.POP_SOURCE, source }),
    onInit: array => dispatch({ type: actionTypes.INIT_SOURCE_ARRAY, array }),
    onPushVideo: video => dispatch({ type: actionTypes.PUSH_VIDEO, video }),
    onPopVideo: video => dispatch({ type: actionTypes.POP_VIDEO, video })
  };
};
export default connect(
  mapStateToProp,
  mapDispatch
)(SourceList);
