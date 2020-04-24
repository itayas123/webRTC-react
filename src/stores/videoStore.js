// @ts-check
import kurentoUtils from "kurento-utils";
import { action, observable } from "mobx";
import { toast } from "react-toastify";
import io from "socket.io-client";
import { sleep } from "../utils";
export default class VideoStore {
  @observable videoArray = observable.array([]);

  constructor(stores) {
    this.webRtcPeers = {};
    this.stores = stores;
    // setup socket io client
    this.socket = io("http://localhost:3001");
    this.setUpSocket();
  }

  @action
  setUpSocket = () => {
    this.socket.on("connect", () => {
      console.log("connected", this.socket.id);
    });

    this.socket.on("aliveSources", this.stores.sourceStore.setAliveSources);
    this.socket.on("candidate", this.onCandidate);
    this.socket.on("sdpAnswer", this.onSdpAnswer);
    this.socket.on("stopRecord", this.onStopRecord);
    this.socket.on("deletedSource", this.onDeletedSource);
  };

  @action
  addVideo = (video) => {
    this.videoArray.push(video);
    const { _id, uri } = video;
    this.handleAddVideo(_id, uri);
  };

  handleAddVideo = async (id, uri) => {
    // await 10 msec for the video to be render
    await sleep(10);
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
          this.socket.emit("start", sdpOffer, uri, sessionId);
        });
        // listen to ice connection state change in order to know the state of the stream
        this.webRtcPeers[
          sessionId
        ].peerConnection.addEventListener("iceconnectionstatechange", (event) =>
          this.iceconnectionstatechange(event, sessionId)
        );
      }
    );
  };

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
  deleteVideo = (video) => {
    const { _id } = video;
    const index = this.videoArray.findIndex((videoObj) => _id === videoObj._id);
    if (index !== -1) {
      this.videoArray.splice(index, 1);
      this.handleDeleteVideo(_id);
    }
  };

  handleDeleteVideo = (videoId) => {
    const sessionId = videoId + this.socket.id;
    this.socket.emit("deleteSession", sessionId);
    delete this.webRtcPeers[sessionId];
  };

  sendCandidate = (candidate, id) => {
    console.log("Local icecandidate " + JSON.stringify(candidate));
    this.socket.emit("candidate", candidate, id);
  };

  toggleRecord = (video) => {
    let { _id, isRecording } = video;
    _id += this.socket.id;
    video.isRecording = !isRecording;
    console.log(`toggler record ${!isRecording} ${_id}`);
    this.socket.emit(isRecording ? "stopRecord" : "startRecord", _id);
  };

  onCandidate = (candidate, id) => {
    console.log("recieve candidate", candidate);
    this.webRtcPeers[id].addIceCandidate(candidate, (error) => {
      if (error) console.error(error);
    });
  };

  onSdpAnswer = (sdpAnswer, id) => {
    console.log("sdpAnswer", JSON.stringify(sdpAnswer));
    this.webRtcPeers[id].processAnswer(sdpAnswer, (error) => {
      if (error) console.error("sdperrror", error);
    });
  };

  onStopRecord = (uri) => {
    console.log("stopRecord", uri);
    toast.info(`Recording saved in: ${uri}`, {
      autoClose: 10000,
      bodyClassName: "uri-toast",
    });
  };

  @action
  onDeletedSource = (uri) => {
    const index = this.videoArray.findIndex((video) => video.uri === uri);
    if (index !== -1) {
      const video = this.videoArray[index];
      this.videoArray.splice(index);
      this.handleDeleteVideo(video._id);
      toast.warn(`Source ${uri} disconnected`, {
        bodyClassName: "uri-toast",
      });
    }
  };
}
