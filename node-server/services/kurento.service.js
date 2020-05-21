const ping = require("ping");
const KurentoClientModel = require("../models/kurentoClientModel");
const config = require("../config");
const { asyncForEach } = require("../utils");
const Source = require("../models/source");

const kurentoclient = new KurentoClientModel();
let alives = [];

const ipRegex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;

const init = async (socket) => {
  console.log(
    `check alive sources every: ${config.ALIVE_SOURCES_TIME / 1000} seconds`
  );
  setInterval(() => sendAliveSources(socket), config.ALIVE_SOURCES_TIME);
  await kurentoclient.init(config.WS_URI);
  sendAliveSources(socket);
};

const onUserConnected = (socket) => {
  console.log("user connected: ", socket.id);
  socket.emit("aliveSources", alives);
};

const sendAliveSources = async (socket) => {
  try {
    const sources = await Source.find({});
    const uris = sources.map((source) => source.uri);
    alives = [];
    await asyncForEach(uris, async (uri) => {
      //* find IP from URI
      const ip = uri.match(ipRegex) || [];
      //* check if there IP
      if (ip.length) {
        //* ping to IP
        const res = await ping.promise.probe(ip[0], { timeout: 2 });
        if (res.alive) {
          //* create/get URI's playerEndpoint
          await kurentoclient.getPlayerEndpoint(uri);
          alives.push(uri);
          //* if not alive and in players list - delete and emit everyone
        } else if (kurentoclient.playerEndpoints[uri]) {
          socket.emit("deletedSource", uri);
          kurentoclient.deletePlayer(uri);
        }
      }
    });
    //* send the alive sources list
    socket.emit("aliveSources", alives);
  } catch (error) {
    console.error(error);
  }
};

const onSendIceCandidate = (event, id, socket) => {
  const candidate = event.candidate;

  console.log("Remote icecandidate " + JSON.stringify(candidate));
  socket.emit("candidate", candidate, id);
};

/**
 *
 * @param {string} sdpOffer
 * @param {string} uri
 * @param {string} id
 * @param {SocketIO} socket
 */
const start = async (sdpOffer, uri, id, socket) => {
  try {
    //* get the URI's playerEndpoint
    const playerEndpoint = await kurentoclient.getPlayerEndpoint(uri);

    //* create webRtcEndpoint
    const webRtcEndpoint = await kurentoclient.createWebRtcEndpoint(id, uri);
    //* share ice candidate
    webRtcEndpoint.on("OnIceCandidate", (event) =>
      onSendIceCandidate(event, id, socket)
    );
    const { iceCandidatesQueue } = kurentoclient.getSessionById(id);
    //* add all ice candidates of this session that recived before
    while (iceCandidatesQueue.length)
      webRtcEndpoint.addIceCandidate(iceCandidatesQueue.shift());

    //* process the sdp offer from client - data about the stream
    const sdpAnswer = await webRtcEndpoint.processOffer(sdpOffer);

    //* gather all candidates - connect webRtc peer-to-peer
    webRtcEndpoint.gatherCandidates((err) => {
      if (err) {
        console.error("ERROR:", err);
      }
    });
    //* send the sdp answer to client
    console.log("SDP Answer from KMS to App:\n%s", sdpAnswer);
    socket.emit("sdpAnswer", sdpAnswer, id);

    //* connect the webRtc to the playerEndpoint in order to see its stream
    await playerEndpoint.connect(webRtcEndpoint);

    console.log("player playing and connected");
  } catch (error) {
    console.error(error);
  }
};

const startRecord = async (id) => {
  try {
    const { uri } = kurentoclient.getSessionById(id);
    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString();
    const ip = (uri.match(ipRegex) || [])[0] || "ip"; // just for safe
    const fileUri = config.RECORD_FILE_URI.replace(
      "{id}",
      `${ip}/${date}/${time}`
    );
    const recordEndpoint = await kurentoclient.getRecorderEndpoint(id, fileUri);
    const playerEndpoint = await kurentoclient.getPlayerEndpoint(uri);
    await playerEndpoint.connect(recordEndpoint);
    await recordEndpoint.record();
    console.log("recording", uri, fileUri);
  } catch (error) {
    console.error(error);
  }
};

const stopRecord = async (id, socket) => {
  try {
    const session = kurentoclient.getSessionById(id);
    const { recordEndpoint, uri } = session;
    await recordEndpoint.stop();
    const playerEndpoint = await kurentoclient.getPlayerEndpoint(uri);
    await playerEndpoint.disconnect(recordEndpoint);
    const fileUri = await recordEndpoint.getUri();
    socket.emit(
      "stopRecord",
      fileUri.replace(config.DOCKER_FOLDER, config.LOCAL_FOLDER)
    );
    console.log("stopRecord", fileUri);
    session.recordEndpoint = undefined;
  } catch (err) {
    console.error(err);
  }
};

const onUserDisconnected = (userId) => {
  return Promise.all(
    Object.keys(kurentoclient.sessions).map((sessionId) => {
      if (sessionId.includes(userId)) {
        return kurentoclient.deleteSession(sessionId);
      }
      return Promise.resolve();
    })
  );
};

const onRecieveIceCandaite = kurentoclient.onRecieveIceCandidate;
const onDeleteSession = kurentoclient.deleteSession;

module.exports = {
  init,
  start,
  onRecieveIceCandaite,
  onUserDisconnected,
  startRecord,
  stopRecord,
  sendAliveSources,
  onDeleteSession,
  onUserConnected,
};
