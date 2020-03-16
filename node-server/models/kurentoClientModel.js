const kurentoClient = require("kurento-client");

class KurentoClientModel {
  constructor() {
    this.pipeline = undefined;
    this.webRtcEndpoints = {};
    this.socket = undefined;
  }

  init = async (socket, ws_uri, options) => {
    this.socket = socket;
    const kurento = await kurentoClient(ws_uri, options);
    this.pipeline = await kurento.create("MediaPipeline");
  };

  getWebRtcEndPointById = id => {
    return (this.webRtcEndpoints[id] = this.webRtcEndpoints[id] || {
      webRtcEndpoint: undefined,
      iceCandidatesQueue: []
    });
  };

  onRecieveIceCandidate = (_candidate, id) => {
    const { webRtcEndpoint, iceCandidatesQueue } = this.getWebRtcEndPointById(
      id
    );
    const candidate = kurentoClient.getComplexType("IceCandidate")(_candidate);
    if (webRtcEndpoint) {
      webRtcEndpoint.addIceCandidate(candidate, error => {
        if (error) console.error(error);
      });
    } else {
      iceCandidatesQueue.push(candidate);
    }
  };

  onSendIceCandidate = (event, id) => {
    const candidate = event.candidate;

    console.log("Remote icecandidate " + JSON.stringify(candidate));
    this.socket.emit("candidate", { candidate, id });
  };

  createWebRtcEndpoint = async id => {
    const newWebRtcEndpoint = await this.pipeline.create("WebRtcEndpoint");
    newWebRtcEndpoint.on("OnIceCandidate", this.onSendIceCandidate);
    const { webRtcEndpoint, iceCandidatesQueue } = this.getWebRtcEndPointById(
      id
    );
    while (iceCandidatesQueue.length)
      newWebRtcEndpoint.addIceCandidate(iceCandidatesQueue.shift());
    return (webRtcEndpoint = newWebRtcEndpoint);
  };

  createPlayerEndpoint = async (uri, options) => {
    return await this.pipeline.create("PlayerEndpoint", { uri, ...options });
  };
}
module.exports = KurentoClientModel;
