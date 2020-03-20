import React from "react";
import "./controlPanel.css";
import SourceList from "./sourceList";

export default class ControlPanel extends React.Component {
  render() {
    return (
      <div className="control-panel">
        <SourceList />
        <div className="record">
          <button className="record-button" />
          <div>record</div>
          <div>00:00</div>
        </div>
      </div>
    );
  }
}
