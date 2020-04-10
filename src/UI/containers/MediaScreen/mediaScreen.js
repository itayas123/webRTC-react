import { toJS } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { Redirect } from "react-router-dom";
import { isNullOrUndefined } from "util";
import { ROUTES } from "../../../Routes";
import stores from "../../../stores";
import VideoPanel from "../../components/MediaScreen/VideoPanel/videoPanel";
import "./mediaScreen.css";

const { videoStore, userStore } = stores;

const MediaScreen = () => {
  if (isNullOrUndefined(userStore.getUser.name))
    return <Redirect to={ROUTES.LOGIN} />;

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
