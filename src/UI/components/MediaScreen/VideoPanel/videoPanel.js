import "./videoPanel.css";
import React from "react";

export default class VideoPanel extends React.Component {
  renderVideos() {
    switch (this.props.split) {
      case 1:
        return (
          <div className="wh100p border-2p pointer">
            {this.props.videoArray && this.props.videoArray[0]
              ? this.props.videoArray[0]
              : ""}
          </div>
        );
      case 2:
        return (
          <div className="wh100p border flex pointer">
            <div className="width-50p border">
              {this.props.videoArray && this.props.videoArray[0]
                ? this.props.videoArray[0]
                : ""}
            </div>
            <div className="width-50p border">
              {this.props.videoArray && this.props.videoArray[1]
                ? this.props.videoArray[1]
                : ""}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="wh100p border pointer">
            <div className="height-50p border">
              {this.props.videoArray && this.props.videoArray[0]
                ? this.props.videoArray[0]
                : ""}
            </div>
            <div className="height-50p border">
              {this.props.videoArray && this.props.videoArray[1]
                ? this.props.videoArray[1]
                : ""}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="wh100p border pointer">
            <div className="height-50p flex">
              <div className="width-50p border">
                {this.props.videoArray && this.props.videoArray[0]
                  ? this.props.videoArray[0]
                  : ""}
              </div>
              <div className="width-50p border">
                {this.props.videoArray && this.props.videoArray[1]
                  ? this.props.videoArray[1]
                  : ""}
              </div>
            </div>
            <div className="height-50p flex">
              <div className="width-50p border">
                {this.props.videoArray && this.props.videoArray[2]
                  ? this.props.videoArray[2]
                  : ""}
              </div>
              <div className="width-50p border">
                {this.props.videoArray && this.props.videoArray[3]
                  ? this.props.videoArray[3]
                  : ""}
              </div>
            </div>
          </div>
        );
      default:
        return <div className="wh100p border-2p pointer" />;
    }
  }

  render() {
    return <div className="video-panel">{this.renderVideos()}</div>;
  }
}
