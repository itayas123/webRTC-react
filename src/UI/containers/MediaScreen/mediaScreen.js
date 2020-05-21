import { toJS } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import stores from "../../../stores";
import VideoSession from "../../components/MediaScreen/VideoSession/videoSession";
import "./mediaScreen.css";

const ResponsiveReactGridLayout = WidthProvider(Responsive);
const COLS = 12;
const SIZE_H = 5;
const SIZE_W = 4;
const { videoStore } = stores;

const MediaScreen = () => {
  const videos = toJS(videoStore.videoArray);

  const onVideoUnMount = (index, video) =>
    videoStore.handleDeleteVideo(videoStore.videoArray[index] || video);

  return (
    <div className="media-screen">
      {videos.length ? (
        <ResponsiveReactGridLayout
          className="layout"
          cols={{ lg: COLS, md: COLS, sm: COLS, xs: COLS, xxs: COLS }}
          rowHeight={100}
        >
          {videos.map((video, index) => (
            <div
              data-grid={{
                i: index.toString(),
                x: (index * SIZE_W) % COLS,
                y: 0,
                w: SIZE_W,
                h: SIZE_H,
              }}
              key={video._id}
            >
              <VideoSession
                video={video}
                onDelete={videoStore.deleteVideo}
                onMount={videoStore.handleAddVideo}
                onUnMount={() => onVideoUnMount(index, video)}
              />
            </div>
          ))}
        </ResponsiveReactGridLayout>
      ) : (
        <h1 className="add-title">Add a video</h1>
      )}
    </div>
  );
};
export default observer(MediaScreen);
