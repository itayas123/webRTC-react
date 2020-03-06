import { inject, observer } from "mobx-react";
import React from "react";
import { SOURCE_STORE, USER_STORE, VIDEO_STORE } from "../../../../stores";
import AddSource from "./addSource";

@inject(SOURCE_STORE, USER_STORE, VIDEO_STORE)
@observer
class SourceList extends React.Component {
  constructor(props) {
    super(props);
    this.sourceStore = this.props[SOURCE_STORE];
    this.userStore = this.props[USER_STORE];
    this.videoStore = this.props[VIDEO_STORE];
  }

  componentDidMount = async () => {
    try {
      console.log(this.videoStore.videoSplit, this.videoStore.videoArray);
      await this.sourceStore.fetchUserSources();
    } catch (e) {
      alert(e);
    }
  };

  spaceInVideoArray = () => {
    const { videoSplit, videoArray } = this.videoStore;
    return (
      (videoSplit === 3
        ? videoSplit - 1 - videoArray.length
        : videoSplit - videoArray.length) !== 0
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
              !this.spaceInVideoArray() ||
              this.videoStore.videoArray.includes(source)
            }
            onClick={() => {
              this.videoStore.addVideo(source);
            }}
          >
            +
          </button>
          <button
            disabled={!this.videoStore.videoArray.includes(source)}
            onClick={() => {
              this.videoStore.deleteVideo(source);
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
      this.videoStore.deleteVideo(source);
    } catch (e) {
      alert(e);
    }
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
