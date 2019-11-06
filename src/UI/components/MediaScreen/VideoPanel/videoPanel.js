import "./videoPanel.css";
import React from "react";

export default class VideoPanel extends React.Component {
  renderVideos() {
    switch (this.props.split) {
      case 1:
        return <div className="wh100p border-2p pointer" />;
      case 2:
        return (
          <div className="wh100p border flex pointer">
            <div className="width-50p border" />
            <div className="width-50p border" />
          </div>
        );
      case 3:
        return (
          <div className="wh100p border pointer">
            <div className="height-50p border" />
            <div className="height-50p border" />
          </div>
        );
      case 4:
        return (
          <div className="wh100p border pointer">
            <div className="height-50p flex">
              <div className="width-50p border" />
              <div className="width-50p border" />
            </div>
            <div className="height-50p flex">
              <div className="width-50p border" />
              <div className="width-50p border" />
            </div>
          </div>
        );
      default:
        return <div className="wh100p border-2p pointer" />;
    }
  }

  render() {
    return <div className="video-panel"> {this.renderVideos()}</div>;
  }
}
