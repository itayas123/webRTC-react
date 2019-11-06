import React from "react";

export default class VideoButtons extends React.Component {
  render() {
    return (
      <div className="video-buttons">
        <div
          className="butoon-width border-2p pointer"
          onClick={() => {
            this.props.onClickButoon(1);
          }}
        />
        <div
          className="butoon-width border flex pointer"
          onClick={() => {
            this.props.onClickButoon(2);
          }}
        >
          <div className="width-50p border" />
          <div className="width-50p border" />
        </div>
        <div
          className="butoon-width border pointer"
          onClick={() => {
            this.props.onClickButoon(3);
          }}
        >
          <div className="height-48p border" />
          <div className="height-48p border" />
        </div>
        <div
          className="butoon-width border pointer"
          onClick={() => {
            this.props.onClickButoon(4);
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
