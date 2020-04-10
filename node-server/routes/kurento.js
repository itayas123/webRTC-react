// @ts-check
const KurentoClientModel = require("../models/kurentoClientModel");

const args = {
  ws_uri: "ws://127.0.0.1:8888/kurento",
  file_uri: "file:///tmp/try-home.webm",
  //file_uri: "https://namer-records.s3.eu-central-1.amazonaws.com/"
};

const kurentoclient = new KurentoClientModel();

const init = async (socket) => {
  setInterval(() => sendAliveSources(socket), 20000);
  await kurentoclient.init(args.ws_uri);
};

const sendAliveSources = async (socket) => {
  const sources = await kurentoclient.getAliveSources();
  socket.emit("aliveSources", { sources });
};

const onSendIceCandidate = (event, id, socket) => {
  const candidate = event.candidate;

  console.log("Remote icecandidate " + JSON.stringify(candidate));
  socket.emit("candidate", {
    candidate,
    id,
  });
};

const start = async (sdpOffer, uri, id, socket) => {
  console.log(uri, sdpOffer, id);

  const playerEndpoint = await kurentoclient.getPlayerEndpoint(uri);

  const webRtcEndpoint = await kurentoclient.createWebRtcEndpoint(id);
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
  socket.emit("sdpAnswer", { sdpAnswer, id });

  await playerEndpoint.connect(webRtcEndpoint);

  console.log("player playing and connected", kurentoclient);
};

const startRecord = async (id, uri) => {
  const recordEndpoint = await kurentoclient.createRecorderEndpoint(
    id,
    args.file_uri
  );
  const playerEndpoint = await kurentoclient.getPlayerEndpoint(uri);
  //await webRtcEndpoint.connect(webRtcEndpoint);
  await playerEndpoint.connect(recordEndpoint);
  await recordEndpoint.record();
  console.log("recording");
};

const stopRecord = async (id, socket) => {
  try {
    const { recordEndpoint } = kurentoclient.getSessionById(id);
    await recordEndpoint.stop();
    const uri = await recordEndpoint.getUri();
    //socket.emit("stopRecord", { uri });
    console.log(" stop recording ", uri, recordEndpoint);
  } catch (err) {
    console.error(err);
  }
};

const onRecieveIceCandaite = kurentoclient.onRecieveIceCandidate;
const onUserDesconnected = kurentoclient.onUserDesconnected;

module.exports = {
  init,
  start,
  onRecieveIceCandaite,
  onUserDesconnected,
  startRecord,
  stopRecord,
  sendAliveSources,
};
