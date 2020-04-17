// @ts-check
import { observable, action, reaction } from "mobx";
import io from "socket.io-client";
import kurentoUtils from "kurento-utils";
import { sleep } from "../utils";
export default class VideoStore {
  @observable videoArray = observable.array([]);

  constructor(stores) {
    this.webRtcPeers = {};
    this.stores = stores;
    // setup socket io client
    this.socket = io("http://localhost:3001");
    this.setUpSocket(this.socket);
    // set up video reaction
    reaction(
      () => this.videoArray.length,
      async (videoLength) => {
        if (videoLength > Object.keys(this.webRtcPeers).length) {
          // await for the video element to be render
          await sleep(100);
          const { _id, uri } = this.videoArray[videoLength - 1];
          this.handleAddVideo(_id, uri);
        }
      }
    );
  }

  @action
  setUpSocket = (socket) => {
    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("aliveSources", ({ sources }) => {
      console.log("aliveSources", sources);
      this.stores.sourceStore.setAliveSources(sources);
    });

    socket.on("candidate", ({ candidate, id }) => {
      console.log("recieve candidate", candidate);

      this.webRtcPeers[id].addIceCandidate(candidate, (error) => {
        if (error) console.error(error);
      });
    });

    socket.on("sdpAnswer", ({ sdpAnswer, id }) => {
      console.log("sdpAnswer", JSON.stringify(sdpAnswer));
      this.webRtcPeers[id].processAnswer(sdpAnswer, (error) => {
        if (error) console.error("sdperrror", error);
      });
    });

    socket.on("stopRecord", ({ uri }) => {
      console.log("stopRecord", uri);
      this.addVideo({ uri, _id: uri, name: uri });
    });
  };

  @action
  addVideo = (video) => {
    this.videoArray.push(video);
  };

  handleAddVideo = (id, uri) => {
    const videoOutput = document.getElementById(id);
    console.log(videoOutput, id);
    if (!videoOutput) return false;
    // set unique Id
    const sessionId = id + this.socket.id;
    // options with video element and onIceCandidate callback
    const options = {
      remoteVideo: videoOutput,
      onicecandidate: (candidate) => this.sendCandidate(candidate, sessionId),
    };
    // get SDP offer with kurentoUtils by our above options
    this.webRtcPeers[sessionId] = kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(
      options,
      (error) => {
        if (error) {
          return console.error(error);
        }
        // send the SDP offer to server in order to recieve SDP answer
        this.webRtcPeers[sessionId].generateOffer((error, sdpOffer) => {
          if (error) {
            return console.error(error);
          }
          this.socket.emit("start", { sdpOffer, url: uri, _id: sessionId });
        });
        // listen to iceconnectionstatechange in order to know the state of the stream
        this.webRtcPeers[
          sessionId
        ].peerConnection.addEventListener("iceconnectionstatechange", (event) =>
          this.iceconnectionstatechange(event, sessionId)
        );
      }
    );
  };

  @action
  deleteVideo = (video) => {
    const { _id } = video;
    const index = this.videoArray.findIndex((videoObj) => _id === videoObj._id);
    if (index !== -1) {
      this.videoArray.splice(index, 1);
      this.handleDeleteVideo(_id);
    }
  };

  handleDeleteVideo = (videoId) => {
    const id = videoId + this.socket.id;
    this.socket.emit("deleteSession", { id });
    delete this.webRtcPeers[id];
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
  sendCandidate = (candidate, _id) => {
    console.log("Local icecandidate " + JSON.stringify(candidate));
    this.socket.emit("candidate", { candidate, _id });
  };

  @action
  toggleRecord = (video) => {
    let { _id, uri, isRecording } = video;
    _id += this.socket.id;
    video.isRecording = !isRecording;
    console.log(`toggler record ${!isRecording} ${_id}`);
    //this.socket.emit("startRecord", { _id, uri });
  };
}
