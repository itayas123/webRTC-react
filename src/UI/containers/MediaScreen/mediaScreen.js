import "./mediaScreen.css";
import React from "react";
import ControlPanel from "../../components/MediaScreen/ControlPanel/controlPanel";
import VideoPanel from "../../components/MediaScreen/VideoPanel/videoPanel";

export default class MediaScreen extends React.Component {
  state = {
    splitvideos: 1,
    videoArray: []
  };
  changeSplit = num => {
    const len = this.state.videoArray.length;
    for (let i = num === 3 ? num - 1 : num; i < len; i++) {
      this.state.videoArray.pop();
    }
    this.setState({ splitvideos: num });
  };
  pushArray = num => {
    const arr = [...this.state.videoArray];
    arr.push(num);
    this.setState({ videoArray: arr });
  };
  popArray = num => {
    const arr = [...this.state.videoArray];
    const index = arr.indexOf(num);
    if (index > -1) {
      arr.splice(index, 1);
    }
    this.setState({ videoArray: arr }, () => {
      console.log(this.state.videoArray);
    });
  };
  render() {
    return (
      <div className="media-screen">
        <ControlPanel
          changeSplit={this.changeSplit}
          pushArray={this.pushArray}
          popArray={this.popArray}
          space={
            this.state.splitvideos === 3
              ? this.state.splitvideos - 1 - this.state.videoArray.length
              : this.state.splitvideos - this.state.videoArray.length
          }
          videoArray={this.state.videoArray}
        />
        <VideoPanel
          split={this.state.splitvideos}
          videoArray={this.state.videoArray}
        />
      </div>
    );
  }
}
