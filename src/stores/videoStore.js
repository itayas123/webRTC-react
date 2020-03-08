// @ts-check
import { observable, action } from "mobx";
import io from "socket.io-client";
import kurentoUtils from "kurento-utils";
export default class VideoStore {
  @observable videoArray = observable.array([]);

  @observable videoSplit = 1;

  constructor() {
    this.webRtcPeers = {};
    this.socket = io("http://localhost:3001");
    this.setUpSocket(this.socket);
  }

  @action
  setUpSocket = socket => {
    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("try", msg => {
      console.log("msg", msg);
    });

    socket.on("candidate", ({ candidate, id }) => {
      console.log("recieve candidate", candidate);

      this.webRtcPeers[id].addIceCandidate(candidate, error => {
        if (error) console.error(error);
      });
    });

    socket.on("sdpAnswer", ({ sdpAnswer, id }) => {
      console.log("sdpAnswer", JSON.stringify(sdpAnswer));
      this.webRtcPeers[id].processAnswer(sdpAnswer, error => {
        if (error) console.error("sdperrror", error);
      });
    });
  };

  @action
  addVideo = video => {
    this.videoArray.push(video);
    const { _id, name, src } = video;
    setTimeout(() => {
      const videoOutput = document.getElementById(name);
      console.log(videoOutput);
      const options = {
        remoteVideo: videoOutput,
        onicecandidate: candidate => {
          this.sendCandidate(candidate, "");
        }
      };
      this.webRtcPeers[_id] = kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(
        options,
        error => {
          if (error) console.error(error);
          else {
            this.webRtcPeers[_id].generateOffer((error, sdpOffer) => {
              if (error) console.error(error);
              else {
                this.socket.emit("start", { sdpOffer, url: src, _id });
              }
            });
            this.webRtcPeers[
              _id
            ].peerConnection.addEventListener(
              "iceconnectionstatechange",
              event => this.iceconnectionstatechange(event, _id)
            );
          }
        }
      );
    }, 1000);
  };

  @action
  deleteVideo = video => {
    const index = this.videoArray.findIndex(
      videoObj => video.src === videoObj.src
    );
    if (index !== -1) this.videoArray.splice(index, 1);
  };

  @action
  changeSplit = split => {
    const start = split === 3 ? split - 1 : split;
    const length = this.videoArray.length;
    for (let i = start; i <= length; i++) {
      this.videoArray.pop();
    }
    this.videoSplit = split;
  };

  @action
  iceconnectionstatechange = (event, id) => {
    const webRtcPeer = this.webRtcPeers[id];
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

  @action
  sendCandidate = (candidate, id) => {
    console.log("Local icecandidate " + JSON.stringify(candidate));
    this.socket.emit("candidate", { candidate, id });
  };
}
