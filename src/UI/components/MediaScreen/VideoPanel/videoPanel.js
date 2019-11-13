import "./videoPanel.css";
import React from "react";
import videoSrc from "./videos/Welcome.mp4";
import videoSrc2 from "./videos/2.mp4";

export default class VideoPanel extends React.Component {
  renderVideos() {
    console.log(this.state);
    switch (this.props.split) {
      case 1:
        return (
          <div className="wh100p border-2p pointer">
            {this.props.videoArray && this.props.videoArray[0] ? (
              <video autoPlay className="video" controls src={videoSrc} />
            ) : (
              ""
            )}
          </div>
        );
      case 2:
        return (
          <div className="wh100p border flex pointer">
            <div className="width-50p border">
              {this.props.videoArray && this.props.videoArray[0] ? (
                <video autoPlay className="video" controls src={videoSrc} />
              ) : (
                ""
              )}
            </div>
            <div className="width-50p border">
              {this.props.videoArray && this.props.videoArray[1] ? (
                <video autoPlay className="video" controls src={videoSrc2} />
              ) : (
                ""
              )}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="wh100p border pointer">
            <div className="height-50p border">
              {this.props.videoArray && this.props.videoArray[0] ? (
                <video autoPlay className="video" controls src={videoSrc} />
              ) : (
                ""
              )}
            </div>
            <div className="height-50p border">
              {this.props.videoArray && this.props.videoArray[1] ? (
                <video autoPlay className="video" controls src={videoSrc2} />
              ) : (
                ""
              )}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="wh100p border pointer">
            <div className="height-50p flex">
              <div className="width-50p border">
                {this.props.videoArray && this.props.videoArray[0] ? (
                  <video autoPlay className="video" controls src={videoSrc} />
                ) : (
                  ""
                )}
              </div>
              <div className="width-50p border">
                {this.props.videoArray && this.props.videoArray[1] ? (
                  <video autoPlay className="video" controls src={videoSrc2} />
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="height-50p flex">
              <div className="width-50p border">
                {this.props.videoArray && this.props.videoArray[2] ? (
                  <video autoPlay className="video" controls src={videoSrc} />
                ) : (
                  ""
                )}
              </div>
              <div className="width-50p border">
                {this.props.videoArray && this.props.videoArray[3] ? (
                  <video autoPlay className="video" controls src={videoSrc2} />
                ) : (
                  ""
                )}
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
