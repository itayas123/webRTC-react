import React, { useRef, useEffect } from "react";
import { xButton } from "../../../../assets";
import "./videoSession.css";

const VideoSession = ({ video, onDelete, onMount, onUnMount }) => {
  const videoRef = useRef(null);
  const videoId = video._id;

  useEffect(() => {
    onMount(videoRef.current, videoId, video.uri);
    return () => onUnMount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <img
        src={xButton}
        className="remove-video"
        alt="remove"
        onClick={() => onDelete(video)}
      />
      <video
        className="video"
        id={videoId}
        autoPlay
        ref={videoRef}
        onDoubleClick={() => {
          if (videoRef.current) {
            videoRef.current.requestFullscreen();
          }
        }}
      />
    </>
  );
};

export default VideoSession;
