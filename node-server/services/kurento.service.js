// @ts-check
const KurentoClientModel = require("../models/kurentoClientModel");
const config = require("../config");
const { ipRegex } = require("../utils");

const kurentoclient = new KurentoClientModel();

const init = async (socket) => {
  setInterval(() => sendAliveSources(socket), config.ALIVE_SOURCES_TIME);
  await kurentoclient.init(config.WS_URI);
};

const sendAliveSources = async (socket) => {
  const sources = await kurentoclient.getAliveSources((deletedUri) => {
    socket.emit("deletedSource", deletedUri);
  });
  socket.emit("aliveSources", sources);
};

const onSendIceCandidate = (event, id, socket) => {
  const candidate = event.candidate;

  console.log("Remote icecandidate " + JSON.stringify(candidate));
  socket.emit("candidate", candidate, id);
};

const start = async (sdpOffer, uri, id, socket) => {
  console.log(uri, sdpOffer, id);

  const playerEndpoint = await kurentoclient.getPlayerEndpoint(uri);

  const webRtcEndpoint = await kurentoclient.createWebRtcEndpoint(id, uri);
  webRtcEndpoint.on("OnIceCandidate", (event) =>
    onSendIceCandidate(event, id, socket)
  );
  const { iceCandidatesQueue } = kurentoclient.getSessionById(id);
  while (iceCandidatesQueue.length)
    webRtcEndpoint.addIceCandidate(iceCandidatesQueue.shift());

  // Start the WebRtcEndpoint
  const sdpAnswer = await webRtcEndpoint.processOffer(sdpOffer);

  webRtcEndpoint.gatherCandidates((err) => {
    if (err) {
      console.error("ERROR:", err);
    }
  });
  console.log("SDP Answer from KMS to App:\n%s", sdpAnswer);
  socket.emit("sdpAnswer", sdpAnswer, id);

  await playerEndpoint.connect(webRtcEndpoint);

  console.log("player playing and connected");
};

const startRecord = async (id) => {
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
  console.log("recording", uri);
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
  Object.keys(kurentoclient.sessions).forEach((sessionId) => {
    if (sessionId.includes(userId)) {
      kurentoclient.deleteSession(sessionId);
    }
  });
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
};
