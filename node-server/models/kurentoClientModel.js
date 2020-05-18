const kurentoClient = require("kurento-client");

class KurentoClientModel {
  constructor() {
    this.kurento = undefined;
    this.pipeline = undefined;
    this.sessions = {};
    this.playerEndpoints = {};
  }

  init = async (ws_uri, options) => {
    try {
      this.kurento = await kurentoClient(ws_uri, options);
      this.pipeline = await this.kurento.create("MediaPipeline");
    } catch (error) {
      console.error(error);
    }
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
    const session = this.getSessionById(id);
    if (!session.webRtcEndpoint) {
      try {
        const webRtcEndpoint = await this.pipeline.create("WebRtcEndpoint");
        session.webRtcEndpoint = webRtcEndpoint;
        session.uri = uri;
      } catch (error) {
        console.error(error);
      }
    }
    return session.webRtcEndpoint;
  };

  getPlayerEndpoint = async (uri, options = { networkCache: 0 }) => {
    if (!this.playerEndpoints[uri]) {
      try {
        console.log(`creating player endpoint: ${uri}`);
        const playerEndpoint = await this.pipeline.create("PlayerEndpoint", {
          uri,
          ...options,
        });
        playerEndpoint.on("Error", async (err) => {
          console.error(`player error ${uri}: `, err);
          // the player will be True for SendAliveSources to notify the client
          this.playerEndpoints[uri] = await this.deletePlayer(uri);
        });
        await playerEndpoint.play();
        this.playerEndpoints[uri] = playerEndpoint;
      } catch (error) {
        console.error(error);
      }
    }
    return this.playerEndpoints[uri];
  };

  getRecorderEndpoint = async (id, uri) => {
    const session = this.getSessionById(id);
    if (!session.recordEndpoint) {
      try {
        const recordEndpoint = await this.pipeline.create("RecorderEndpoint", {
          uri,
          stopOnEndOfStream: true,
        });
        session.recordEndpoint = recordEndpoint;
      } catch (error) {
        console.error(error);
      }
    }
    return session.recordEndpoint;
  };

  deletePlayer = async (uri) => {
    try {
      const playerEndpoint = this.playerEndpoints[uri];
      if (playerEndpoint && typeof playerEndpoint === "object") {
        console.log("deleting player:", uri);
        const connections = await playerEndpoint.getSinkConnections();
        await Promise.all(
          connections.map((connection) =>
            this.kurento
              .getMediaobjectById(connection.sink)
              .then((mediaObj) => playerEndpoint.disconnect(mediaObj))
              .catch((err) => console.error(err))
          )
        );
        await playerEndpoint.release();
        delete this.playerEndpoints[uri];
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
    }
  };

  deleteSession = async (sessionId) => {
    try {
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
      if (recordEndpoint && playerEndpoint) {
        await recordEndpoint.stop();
        await playerEndpoint.disconnect(recordEndpoint);
      }
      delete this.sessions[sessionId];
      console.log("all sessions ", Object.keys(this.sessions));
    } catch (error) {
      console.error(error);
    }
  };
}
module.exports = KurentoClientModel;
