import "./mediaScreen.css";
import React from "react";
import ControlPanel from "../../components/MediaScreen/ControlPanel/controlPanel";
import VideoPanel from "../../components/MediaScreen/VideoPanel/videoPanel";

export default class MediaScreen extends React.Component {
  state = {
    splitvideos: 1
  };
  changeSplit = num => {
    this.setState({ splitvideos: num });
  };
  render() {
    return (
      <div className="media-screen">
        <ControlPanel changeSplit={this.changeSplit} />
        <VideoPanel split={this.state.splitvideos} />
      </div>
    );
  }
}
