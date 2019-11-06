import "./mediaScreen.css";
import React from "react";
import ControlPanel from "../../components/MediaScreen/controlPanel";
import VideoPanel from "../../components/MediaScreen/videoPanel";

export default class MediaScreen extends React.Component {
  render() {
    return (
      <div className="media-screen">
        <ControlPanel />
        <VideoPanel />
      </div>
    );
  }
}
