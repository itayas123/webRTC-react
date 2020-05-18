import { observer } from "mobx-react";
import React from "react";
import { camera } from "../../../../assets";
import stores from "../../../../stores";
import Record from "./record";
import "./sourceList.css";

const { sourceStore, videoStore } = stores;
@observer
class SourceList extends React.Component {
  renderSource = (source) => {
    const isDisabled =
      videoStore.videoArray.findIndex((src) => src._id === source._id) !== -1;
    return (
      <div
        className={`item-list ${isDisabled ? "disabled" : ""}`}
        onClick={() => videoStore.addVideo(source)}
        key={source._id}
      >
        <img className="camera-img" src={camera} alt="camera" />
        <div className="source-details">
          <div className="source-name">{source.name}</div>
          <div className="source-uri">{source.uri}</div>
        </div>
      </div>
    );
  };

  renderRecord = (video, index) => {
    const { isRecording, _id, uri, name } = video;
    const { toggleRecord } = videoStore;
    return (
      <Record
        key={_id}
        isRecording={isRecording}
        name={name}
        uri={uri}
        onClick={() => toggleRecord(index)}
      />
    );
  };

  render() {
    const { videoArray } = videoStore;
    const { userAliveSources } = sourceStore;
    return (
      <div className="sources-list">
        <h2>source list</h2>
        <div className="alive-source-list">
          {userAliveSources.length ? (
            userAliveSources.map((source) => this.renderSource(source))
          ) : (
            <h3>No Alive & Allowed Sources</h3>
          )}
        </div>
        {videoArray.length > 0 && (
          <>
            <h2>record list</h2>
            <div className="record-list">
              {videoArray.map(this.renderRecord)}
            </div>
            {/* {userStore.getUser.admin && <AddSource />} */}
          </>
        )}
      </div>
    );
  }
}

export default SourceList;
