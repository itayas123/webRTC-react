import React from "react";
import { WidthProvider, Responsive } from "react-grid-layout";
import "./videoPanel.css";
import { xButton } from "../../../../assets";
const ResponsiveReactGridLayout = WidthProvider(Responsive);

export default class VideoPanel extends React.PureComponent {
  createElement = (video, index) => {
    const elementValues = {
      i: index.toString(),
      x: index * 5,
      y: 0,
      w: 5,
      h: 5
    };
    return (
      <div key={video._id} data-grid={elementValues}>
        <img
          src={xButton}
          className="remove-video"
          alt="remove"
          onClick={() => this.props.deleteVideo(video)}
        />
        <video className="video" id={video.name} autoPlay />
      </div>
    );
  };

  // We're using the cols coming back from this to calculate where to add new items.
  onBreakpointChange = (breakpoint, cols) => {
    this.setState({
      breakpoint: breakpoint,
      cols: cols
    });
  };

  onLayoutChange = layout => {
    this.setState({ layout: layout });
  };

  render() {
    return this.props.videoArray.length ? (
      <ResponsiveReactGridLayout
        onLayoutChange={this.onLayoutChange}
        onBreakpointChange={this.onBreakpointChange}
        className="layout"
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={100}
      >
        {this.props.videoArray.map((video, index) =>
          this.createElement(video, index)
        )}
      </ResponsiveReactGridLayout>
    ) : (
      <h1 className="add-title">Add a video</h1>
    );
  }
}
