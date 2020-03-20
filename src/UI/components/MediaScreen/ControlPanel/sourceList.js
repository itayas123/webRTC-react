import { inject, observer } from "mobx-react";
import React from "react";
import { SOURCE_STORE, USER_STORE, VIDEO_STORE } from "../../../../stores";
import AddSource from "./addSource";
import { camera } from "../../../../assets";

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

  addVideo = source => {
    this.videoStore.addVideo(source);
  };

  renderSource = (source, index) => {
    const isDisabled = this.videoStore.videoArray.includes(source);
    return (
      <div
        className={`item-list ${isDisabled ? "disabled" : ""}`}
        onClick={() => (isDisabled ? {} : this.addVideo(source))}
        key={index}
      >
        <div className="flex">
          <img className="camera-img" src={camera} />
          <div className="source-name">{source.name}</div>
        </div>
        <div className="source-uri">{source.uri}</div>
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
  render() {
    return (
      <div>
        <h2>video list</h2>
        <div className="source-list">
          {this.sourceStore.sources &&
            this.sourceStore.sources.map((source, index) =>
              this.renderSource(source, index)
            )}
        </div>
        {this.userStore.getUser.admin && <AddSource />}
      </div>
    );
  }
}

export default SourceList;
