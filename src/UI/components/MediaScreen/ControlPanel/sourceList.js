import React from "react";
import AddItem from "./addItem";
import { connect } from "react-redux";
import * as actionTypes from "../../../../store/actions";
import API from "../../../../utils/API";

class SourceList extends React.Component {
  componentDidMount = () => {
    API.get(`/sources?email=${this.props.user.email}`)
      .then(res => {
        if (res.data.error) {
          alert(res.data.error);
        } else if (res.data.data) {
          this.props.onInit(res.data.data);
        }
      })
      .catch(res => {
        console.log(res);
      });
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
              this.props.space === 0 ||
              this.props.videoArray.includes(source.name)
            }
            onClick={() => {
              this.props.pushArray(source.name);
            }}
          >
            +
          </button>
          <button
            disabled={!this.props.videoArray.includes(source.name)}
            onClick={() => {
              this.props.popArray(source.name);
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
        if (res.data.error) {
          alert(res.data.error);
        } else if (res.data.data) {
          this.props.onPopItem(source);
          this.props.popArray(source);
        }
      })
      .catch(res => {
        console.error(JSON.stringify(res));
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
    sourceList: state.sourceReducer.sourceArray
  };
};
const mapDispatch = dispatch => {
  return {
    onPopItem: item => dispatch({ type: actionTypes.POP_ITEM, item }),
    onInit: array => dispatch({ type: actionTypes.INIT_SOURCE_ARRAY, array })
  };
};
export default connect(
  mapStateToProp,
  mapDispatch
)(SourceList);
