import { observable, action } from "mobx";
import io from "socket.io-client";

export default class VideoStore {
  @observable videoArray = observable.array([]);

  @observable videoSplit = 1;

  constructor() {
    this.webRtcPeers = {};
    this.socket = io("http://localhost:3001");
    this.setUpSocket(this.socket);
  }

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
}
