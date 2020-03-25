import { observer } from "mobx-react";
import React from "react";
import { camera, startRecordIcon, stopRecordIcon } from "../../../../assets";
import stores from "../../../../stores";
import AddSource from "./addSource";

const { sourceStore, userStore, videoStore } = stores;
@observer
class SourceList extends React.Component {
  renderSource = source => {
    const isDisabled = videoStore.videoArray.includes(source);
    return (
      <div
        className={`item-list ${isDisabled ? "disabled" : ""}`}
        onClick={() => (isDisabled ? {} : videoStore.addVideo(source))}
        key={source._id}
      >
        <img className="camera-img" src={camera} />
        <div className="source-details">
          <div className="source-name">{source.name}</div>
          <div className="source-uri">{source.uri}</div>
        </div>
      </div>
    );
  };

  renderRecord = video => {
    const { isRecording, _id, uri } = video;
    const { startRecord, stopRecord } = videoStore;
    return (
      <div className="item-list no-border" key={_id}>
        <img className="camera-img" src={camera} />
        <div className="source-details">
          <div className="source-name">{video.name}</div>
          <div className="source-uri">{video.uri}</div>
        </div>
        <img
          className="camera-img"
          src={isRecording ? stopRecordIcon : startRecordIcon}
          onClick={() =>
            isRecording ? stopRecord(_id) : startRecord(_id, uri)
          }
        />
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
    const { videoArray } = videoStore;
    const { userSources } = sourceStore;
    return (
      <div>
        <h2>source list</h2>
        <div className="source-list">
          {userSources && userSources.map(source => this.renderSource(source))}
        </div>
        <h2>record list</h2>
        <div className="source-list">
          {videoArray && videoArray.map(video => this.renderRecord(video))}
        </div>
        {userStore.getUser.admin && <AddSource />}
      </div>
    );
  }
}

export default SourceList;
