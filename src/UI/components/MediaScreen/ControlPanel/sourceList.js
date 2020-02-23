import { inject, observer } from "mobx-react";
import React from "react";
import { SOURCE_STORE, USER_STORE } from "../../../../stores";
import AddSource from "./addSource";

@inject(SOURCE_STORE, USER_STORE)
@observer
class SourceList extends React.Component {
  constructor(props) {
    super(props);
    this.sourceStore = this.props[SOURCE_STORE];
    this.userStore = this.props[USER_STORE];
  }

  componentDidMount = async () => {
    try {
      await this.sourceStore.fetchUserSources();
    } catch (e) {
      alert(e);
    }
  };

  spaceInVideoArray = () => {
    return (
      true ||
      (this.props.videoSplit === 3
        ? this.props.videoSplit - 1 - this.props.videoArray.length
        : this.props.videoSplit - this.props.videoArray.length) !== 0
    );
  };

  renderSource = (source, index) => {
    return (
      <div className="item-list border" key={index}>
        {this.userStore.getUser && this.userStore.getUser.admin && (
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
              true ||
              !this.spaceInVideoArray() ||
              this.props.videoArray.includes(source.name)
            }
            onClick={() => {
              // this.props.onPushVideo(source.name);
            }}
          >
            +
          </button>
          <button
            disabled={true || !this.props.videoArray.includes(source.name)}
            onClick={() => {
              // this.props.onPopVideo(source.name);
            }}
          >
            -
          </button>
        </div>
      </div>
    );
  };
  removeSource = async source => {
    try {
      await this.sourceStore.deleteSource(source.name);
    } catch (e) {
      alert(e);
    }
    // this.props.onPopVideo(source.name);
  };
  renderSouresList() {
    return (
      this.sourceStore.sources &&
      this.sourceStore.sources.map((source, index) =>
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
        {this.userStore.getUser.admin && <AddSource />}
      </div>
    );
  }
}

export default SourceList;
