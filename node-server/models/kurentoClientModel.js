const kurentoClient = require("kurento-client");
const { asyncForEach } = require("../utils");

class KurentoClientModel {
  constructor() {
    this.kurento = undefined;
    this.pipeline = undefined;
    this.sessions = {};
    this.playerEndpoints = {};
  }

  init = async (ws_uri, options) => {
    this.kurento = await kurentoClient(ws_uri, options);
    this.pipeline = await this.kurento.create("MediaPipeline");
  };

  getSessionById = (id) => {
    return (this.sessions[id] = this.sessions[id] || {
      webRtcEndpoint: undefined,
      iceCandidatesQueue: [],
      recordEndpoint: undefined,
      uri: "",
    });
  };

  onRecieveIceCandidate = (_candidate, id) => {
    const { webRtcEndpoint, iceCandidatesQueue } = this.getSessionById(id);
    const candidate = kurentoClient.getComplexType("IceCandidate")(_candidate);

    if (webRtcEndpoint) {
      webRtcEndpoint.addIceCandidate(candidate, (error) => {
        if (error) console.error(error);
      });
    } else {
      iceCandidatesQueue.push(candidate);
    }
  };

  createWebRtcEndpoint = async (id, uri) => {
    try {
      const webRtcEndpoint = await this.pipeline.create("WebRtcEndpoint");
      let session = this.getSessionById(id);
      session = { ...session, webRtcEndpoint, uri };
      this.sessions[id] = session;
      return webRtcEndpoint;
    } catch (error) {
      console.error(error);
    }
  };

  getPlayerEndpoint = async (uri, options = { networkCache: 1000 }) => {
    if (!this.playerEndpoints[uri]) {
      console.log(`creating player endpoint: ${uri}`);
      const playerEndpoint = await this.pipeline.create("PlayerEndpoint", {
        uri,
        options,
      });
      await playerEndpoint.play();
      this.playerEndpoints[uri] = playerEndpoint;
    }

    return this.playerEndpoints[uri];
  };

  deletePlayer = async (uri) => {
    try {
      const playerEndpoint = this.playerEndpoints[uri];
      if (playerEndpoint) {
        console.log("deleting player:", uri);
        const connections = await playerEndpoint.getSinkConnections();
        await asyncForEach(connections, async (connection) => {
          const mediaObj = await this.kurento.getMediaobjectById(
            connection.sink
          );
          await playerEndpoint.disconnect(mediaObj);
        });
        await playerEndpoint.release();
        delete this.playerEndpoints[uri];
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
    }
  };

  getRecorderEndpoint = async (id, uri) => {
    try {
      const session = this.getSessionById(id);
      if (!session.recordEndpoint) {
        const recordEndpoint = await this.pipeline.create("RecorderEndpoint", {
          uri,
          //uri: `${uri}${id}.webm`,
          stopOnEndOfStream: true,
        });
        session.recordEndpoint = recordEndpoint;
      }
      return session.recordEndpoint;
    } catch (error) {
      console.error(error);
    }
  };

  deleteSession = async (sessionId) => {
    console.log(`delete session: ${sessionId}`);
    const { webRtcEndpoint, uri, recordEndpoint } = this.getSessionById(
      sessionId
    );
    const playerEndpoint = this.playerEndpoints[uri];
    if (playerEndpoint) {
      await playerEndpoint.disconnect(webRtcEndpoint);
    }
    if (webRtcEndpoint) {
      await webRtcEndpoint.release();
    }
    if (recordEndpoint) {
      await recordEndpoint.stop();
      await this.playerEndpoints[uri].disconnect(recordEndpoint);
    }
    delete this.sessions[sessionId];
    console.log("all sessions ", Object.keys(this.sessions));
  };
}
module.exports = KurentoClientModel;
