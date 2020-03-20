import "./mediaScreen.css";
import React from "react";
import ControlPanel from "../../components/MediaScreen/ControlPanel/controlPanel";
import VideoPanel from "../../components/MediaScreen/VideoPanel/videoPanel";
import { inject, observer } from "mobx-react";
import { VIDEO_STORE } from "../../../stores";
import { toJS } from "mobx";

@inject(VIDEO_STORE)
@observer
class MediaScreen extends React.Component {
  constructor(props) {
    super(props);
    this.videStore = this.props[VIDEO_STORE];
  }

  render() {
    return (
      <div className="media-screen">
        <VideoPanel videoArray={toJS(this.videStore.videoArray)} />
      </div>
    );
  }
}
export default MediaScreen;
