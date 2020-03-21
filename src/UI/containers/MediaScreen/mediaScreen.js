import { toJS } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import stores from "../../../stores";
import VideoPanel from "../../components/MediaScreen/VideoPanel/videoPanel";
import "./mediaScreen.css";

const { videoStore } = stores;
@observer
class MediaScreen extends React.Component {
  render() {
    return (
      <div className="media-screen">
        <VideoPanel videoArray={toJS(videoStore.videoArray)} />
      </div>
    );
  }
}
export default MediaScreen;
