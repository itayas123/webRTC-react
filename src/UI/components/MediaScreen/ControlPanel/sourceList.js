import { observer } from "mobx-react";
import React from "react";
import { camera } from "../../../../assets";
import stores from "../../../../stores";
import AddSource from "./addSource";

const { sourceStore, userStore, videoStore } = stores;
@observer
class SourceList extends React.Component {
  renderSource = (source, index) => {
    const isDisabled = videoStore.videoArray.includes(source);
    return (
      <div
        className={`item-list ${isDisabled ? "disabled" : ""}`}
        onClick={() => (isDisabled ? {} : videoStore.addVideo(source))}
        key={index}
      >
        <img className="camera-img" src={camera} />
        <div className="source-details">
          <div className="source-name">{source.name}</div>
          <div className="source-uri">{source.uri}</div>
        </div>
      </div>
    );
  };

  removeSource = async source => {
    try {
      await sourceStore.deleteSource(source.name);
      videoStore.deleteVideo(source);
    } catch (e) {
      alert(e);
    }
  };

  render() {
    const { userSources } = sourceStore;
    return (
      <div>
        <h2>source list</h2>
        <div className="source-list">
          {userSources &&
            userSources.map((source, index) =>
              this.renderSource(source, index)
            )}
        </div>
        {userStore.getUser.admin && <AddSource />}
      </div>
    );
  }
}

export default SourceList;
