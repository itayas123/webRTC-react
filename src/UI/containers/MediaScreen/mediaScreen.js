import { toJS } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import stores from "../../../stores";
import VideoPanel from "../../components/MediaScreen/VideoPanel/videoPanel";
import "./mediaScreen.css";

const { videoStore } = stores;

const MediaScreen = () => {
  useEffect(() => {
    const {
      videoArray,
      handleDeleteVideo,
      handleAddVideo,
      toggleRecord,
    } = videoStore;
    // if we get in to the page and we have liveStreams we need to reconnect them
    videoArray.forEach((video) => handleAddVideo(video._id, video.uri));
    return () =>
      videoArray.forEach((video) => {
        const { _id, isRecording } = video;
        handleDeleteVideo(_id);
        if (isRecording) {
          toggleRecord(video);
        }
      });
  }, []);

  return (
    <div className="media-screen">
      <VideoPanel
        videoArray={toJS(videoStore.videoArray)}
        deleteVideo={videoStore.deleteVideo}
      />
    </div>
  );
};
export default observer(MediaScreen);
