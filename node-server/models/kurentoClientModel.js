const kurentoClient = require("kurento-client");

class KurentoClientModel {
  constructor() {
    this.pipeline = undefined;
    this.sessions = {};
    this.playerEndpoints = {};
  }

  init = async (ws_uri, options) => {
    const kurento = await kurentoClient(ws_uri, options);
    this.pipeline = await kurento.create("MediaPipeline");
  };

  getSessionById = id => {
    return (this.sessions[id] = this.sessions[id] || {
      webRtcEndpoint: undefined,
      iceCandidatesQueue: [],
      recordEndpoint: undefined
    });
  };

  onRecieveIceCandidate = (_candidate, id) => {
    const { webRtcEndpoint, iceCandidatesQueue } = this.getSessionById(id);
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
      const webRtcEndpoint = await this.pipeline.create("WebRtcEndpoint");
      const session = this.getSessionById(id);
      return (session.webRtcEndpoint = webRtcEndpoint);
    } catch (error) {
      console.error(error);
    }
  };

  createPlayerEndpoint = async (uri, options) => {
    if (!this.playerEndpoints[uri]) {
      const playerEndpoint = await this.pipeline.create("PlayerEndpoint", {
        uri,
        ...options
      });
      // playerEndpoint.on("Error", err => {
      //   const deleteee = Object.values(this.playerEndpoints).find(
      //     player => player.id === err.source
      //   );
      //   console.error("deleee", deleteee, err, this.playerEndpoints);
      // });
      await playerEndpoint.play((err, error) => {});
      this.playerEndpoints[uri] = playerEndpoint;
    }
    return this.playerEndpoints[uri];
  };

  createRecorderEndpoint = async (id, uri) => {
    try {
      const recordEndpoint = await this.pipeline.create("RecorderEndpoint", {
        uri,
        //uri: `${uri}${id}.webm`,
        stopOnEndOfStream: true
      });
      const session = this.getSessionById(id);
      return (session.recordEndpoint = recordEndpoint);
    } catch (error) {
      console.error(error);
    }
  };

  onUserDesconnected = id => {
    Object.keys(this.sessions).forEach(key => {
      if (key.includes(id)) {
        const { webRtcEndpoint } = this.getSessionById(key);
        webRtcEndpoint.release();
        delete this.sessions[key];
      }
    });
    console.log(this.sessions);
  };
}
module.exports = KurentoClientModel;
