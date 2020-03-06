import React from "react";
import { inject, observer } from "mobx-react";
import { VIDEO_STORE } from "../../../../stores";

@inject(VIDEO_STORE)
@observer
class VideoButtons extends React.Component {
  constructor(props) {
    super(props);
    this.videoStore = this.props[VIDEO_STORE];
  }

  render() {
    const { changeSplit } = this.videoStore;
    return (
      <div className="video-buttons">
        <div
          className="butoon-width border-2p pointer"
          onClick={() => {
            changeSplit(1);
          }}
        />
        <div
          className="butoon-width border flex pointer"
          onClick={() => {
            changeSplit(2);
          }}
        >
          <div className="width-50p border" />
          <div className="width-50p border" />
        </div>
        <div
          className="butoon-width border pointer"
          onClick={() => {
            changeSplit(3);
          }}
        >
          <div className="height-48p border" />
          <div className="height-48p border" />
        </div>
        <div
          className="butoon-width border pointer"
          onClick={() => {
            changeSplit(4);
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

export default VideoButtons;
