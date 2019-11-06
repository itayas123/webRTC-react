import React from "react";

export default class VideoButtons extends React.Component {
  render() {
    return (
      <div className="video-buttons">
        <div className="butoon-width border-2p pointer" />
        <div className="butoon-width border flex pointer">
          <div className="width-50p border" />
          <div className="width-50p border" />
        </div>
        <div className="butoon-width border pointer">
          <div className="height-50p border" />
          <div className="height-50p border" />
        </div>
        <div className="butoon-width border pointer">
          <div className="height-50p flex">
            <div className="width-50p border" />
            <div className="width-50p border" />
          </div>
          <div className="height-50p flex">
            <div className="width-50p border" />
            <div className="width-50p border" />
          </div>
        </div>
      </div>
    );
  }
}
