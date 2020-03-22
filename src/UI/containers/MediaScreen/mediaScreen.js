import { toJS } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import stores from "../../../stores";
import VideoPanel from "../../components/MediaScreen/VideoPanel/videoPanel";
import "./mediaScreen.css";
import { Redirect } from "react-router-dom";
import { ROUTES } from "../../../Routes";
import { isNullOrUndefined } from "util";

const { videoStore, userStore } = stores;

const MediaScreen = ({}) => {
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
