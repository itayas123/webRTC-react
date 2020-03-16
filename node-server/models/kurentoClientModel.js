const kurentoClient = require("kurento-client");

class KurentoClientModel {
  constructor() {
    this.pipeline = undefined;
    this.webRtcEndpoints = {};
  }

  init = async (ws_uri, options) => {
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

  createWebRtcEndpoint = async id => {
    try {
      const newWebRtcEndpoint = await this.pipeline.create("WebRtcEndpoint");
      const webRtcEndpoint = this.getWebRtcEndPointById(id);
      return (webRtcEndpoint.webRtcEndpoint = newWebRtcEndpoint);
    } catch (error) {
      console.error(error);
    }
  };

  createPlayerEndpoint = async (uri, options) => {
    return await this.pipeline.create("PlayerEndpoint", { uri, ...options });
  };

  onUserDesconnected = id => {
    Object.keys(this.webRtcEndpoints).forEach(key => {
      if (key.includes(id)) delete this.webRtcEndpoints[key];
    });
    console.log(this.webRtcEndpoints);
  };
}
module.exports = KurentoClientModel;
