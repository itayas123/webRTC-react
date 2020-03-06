import kurentoUtils from "kurento-utils";
import React, { useEffect } from "react";
import io from "socket.io-client";
import "./videoPanel.css";
import stores from "../../../../stores";
import { observer } from "mobx-react";
let webRtcPeer = undefined;
const socket = io("http://localhost:3001");

socket.on("connect", () => {
  console.log("connected");
});

socket.on("try", msg => {
  console.log("msg", msg);
});

socket.on("candidate", ({ candidate }) => {
  console.log("recieve candidate", candidate);

  webRtcPeer.addIceCandidate(candidate, error => {
    if (error) console.error(error);
  });
});

socket.on("sdpAnswer", ({ sdpAnswer }) => {
  console.log("sdpAnswer", JSON.stringify(sdpAnswer));
  webRtcPeer.processAnswer(sdpAnswer, error => {
    if (error) console.error("sdperrror", error);
  });
});

const iceconnectionstatechange = event => {
  if (webRtcPeer && webRtcPeer.peerConnection) {
    console.log(
      "oniceconnectionstatechange -> " +
        webRtcPeer.peerConnection.iceConnectionState
    );
    console.log(
      "icegatheringstate -> " + webRtcPeer.peerConnection.iceGatheringState
    );
  }
};

const sendCandidate = candidate => {
  console.log("Local icecandidate " + JSON.stringify(candidate));

  socket.emit("candidate", { candidate });
};
const { videoStore } = stores;
const videoArray = videoStore.videoArray;
export default observer(function VideoPanel() {
  useEffect(() => {
    if (videoArray && videoArray[0]) {
      const videoOutput = document.getElementById("output");
      const options = {
        remoteVideo: videoOutput
      };
      webRtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(
        options,
        error => {
          if (error) console.error(error);
          else {
            webRtcPeer.generateOffer((error, sdpOffer) => {
              if (error) console.error(error);
              else {
                socket.emit("start", { sdpOffer, url: videoArray[0] });
              }
            });
            webRtcPeer.peerConnection.addEventListener(
              "iceconnectionstatechange",
              iceconnectionstatechange
            );
            webRtcPeer.on("icecandidate", sendCandidate);
          }
        }
      );
    }
  }, [videoArray]);

  return (
    <div className="video-panel">
      <div className="wh100p border-2p">
        <video
          id="output"
          autoPlay
          className="video"
          // controls
        />
      </div>
    </div>
  );
});

// class VideoPanel extends React.Component {
//   renderVideos() {
//     switch (this.props.videoSplit) {
//       case 1:
//         return (
//           <div className="wh100p border-2p">
//             {this.props.videoArray && this.props.videoArray[0] ? (
//               <video
//                 autoPlay
//                 className="video"
//                 controls
//                 src="http://localhost:3001/api/sources/video"
//               />
//             ) : (
//               ""
//             )}
//           </div>
//         );
//       case 2:
//         return (
//           <div className="wh100p border flex">
//             <div className="width-50p border">
//               {this.props.videoArray && this.props.videoArray[0] ? (
//                 <video autoPlay className="video" controls src={videoSrc} />
//               ) : (
//                 ""
//               )}
//             </div>
//             <div className="width-50p border">
//               {this.props.videoArray && this.props.videoArray[1] ? (
//                 <video autoPlay className="video" controls src={videoSrc2} />
//               ) : (
//                 ""
//               )}
//             </div>
//           </div>
//         );
//       case 3:
//         return (
//           <div className="wh100p border">
//             <div className="height-50p border">
//               {this.props.videoArray && this.props.videoArray[0] ? (
//                 <video autoPlay className="video" controls src={videoSrc} />
//               ) : (
//                 ""
//               )}
//             </div>
//             <div className="height-50p border">
//               {this.props.videoArray && this.props.videoArray[1] ? (
//                 <video autoPlay className="video" controls src={videoSrc2} />
//               ) : (
//                 ""
//               )}
//             </div>
//           </div>
//         );
//       case 4:
//         return (
//           <div className="wh100p border">
//             <div className="height-50p flex">
//               <div className="width-50p border">
//                 {this.props.videoArray && this.props.videoArray[0] ? (
//                   <video autoPlay className="video" controls src={videoSrc} />
//                 ) : (
//                   ""
//                 )}
//               </div>
//               <div className="width-50p border">
//                 {this.props.videoArray && this.props.videoArray[1] ? (
//                   <video autoPlay className="video" controls src={videoSrc2} />
//                 ) : (
//                   ""
//                 )}
//               </div>
//             </div>
//             <div className="height-50p flex">
//               <div className="width-50p border">
//                 {this.props.videoArray && this.props.videoArray[2] ? (
//                   <video autoPlay className="video" controls src={videoSrc} />
//                 ) : (
//                   ""
//                 )}
//               </div>
//               <div className="width-50p border">
//                 {this.props.videoArray && this.props.videoArray[3] ? (
//                   <video autoPlay className="video" controls src={videoSrc2} />
//                 ) : (
//                   ""
//                 )}
//               </div>
//             </div>
//           </div>
//         );
//       default:
//         return <div className="wh100p border-2p" />;
//     }
//   }

//   render() {
//     return <div className="video-panel">{this.renderVideos()}</div>;
//   }
// }
