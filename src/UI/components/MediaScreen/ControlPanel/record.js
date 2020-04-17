import React, { useState, useEffect } from "react";
import { recordIcon } from "../../../../assets";
import { timeFormat } from "../../../../utils";

let timer;

const Record = ({ isRecording, name, onClick }) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    console.log(`effect ${isRecording}`);

    if (isRecording && !timer) {
      timer = setInterval(() => {
        setTime((time) => time + 1);
      }, 1000);
    } else {
      clearInterval(timer);
      timer = undefined;
      setTime(0);
    }
  }, [isRecording]);

  return (
    <div className="item-list no-border record">
      <img
        className={`record-img ${time % 2 ? "opac" : ""}`}
        alt="record"
        src={recordIcon}
        onClick={onClick}
      />
      <div className="source-details">
        <div className="source-name">{name}</div>
        <div className="source-uri">{timeFormat(time)}</div>
      </div>
    </div>
  );
};

export default Record;
