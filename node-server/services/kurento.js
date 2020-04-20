// @ts-check
const KurentoClientModel = require("../models/kurentoClientModel");
const config = require("../config");

const kurentoclient = new KurentoClientModel();

const init = async (socket) => {
  setInterval(() => sendAliveSources(socket), config.ALIVE_SOURCES_TIME);
  await kurentoclient.init(config.WS_URI);
};

const sendAliveSources = async (socket) => {
  const sources = await kurentoclient.getAliveSources();
  socket.emit("aliveSources", sources);
};

const onSendIceCandidate = (event, id, socket) => {
  const candidate = event.candidate;

  console.log("Remote icecandidate " + JSON.stringify(candidate));
  socket.emit("candidate", candidate, id);
};

const start = async (sdpOffer, uri, id, socket) => {
  console.log(uri, sdpOffer, id);

  const playerEndpoint = await kurentoclient.playerEndpoints[uri];

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

  console.log("player playing and connected", webRtcEndpoint);
};

const startRecord = async (id) => {
  const recordEndpoint = await kurentoclient.createRecorderEndpoint(
    id,
    config.RECORD_FILE_URI
  );
  const { uri } = kurentoclient.getSessionById(id);
  const playerEndpoint = await kurentoclient.playerEndpoints[uri];
  //await webRtcEndpoint.connect(webRtcEndpoint);
  await playerEndpoint.connect(recordEndpoint);
  await recordEndpoint.record();
  console.log("recording", uri);
};

const stopRecord = async (id) => {
  try {
    const { recordEndpoint } = kurentoclient.getSessionById(id);
    await recordEndpoint.stop();
    const uri = await recordEndpoint.getUri();
    //socket.emit("stopRecord", uri);
    console.log(" stop recording ", uri, recordEndpoint);
  } catch (err) {
    console.error(err);
  }
};

const onRecieveIceCandaite = kurentoclient.onRecieveIceCandidate;
const onUserDesconnected = kurentoclient.onUserDesconnected;
const onDeleteSession = kurentoclient.deleteSession;

module.exports = {
  init,
  start,
  onRecieveIceCandaite,
  onUserDesconnected,
  startRecord,
  stopRecord,
  sendAliveSources,
  onDeleteSession,
};
