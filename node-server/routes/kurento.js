// @ts-check
const kurentoClient = require("kurento-client");

const args = {
  ws_uri: "ws://127.0.0.1:8888/kurento"
};

const kurentoGlobal = {
  client: undefined,
  pipeline: undefined,
  webRtcEndpoints: {}
};

async function getKurentoClient() {
  if (!kurentoGlobal.client)
    kurentoGlobal.client = await kurentoClient(args.ws_uri);
  return kurentoGlobal.client;
}

async function getPipeline() {
  if (!kurentoGlobal.pipeline) {
    const kurento = await getKurentoClient();
    kurentoGlobal.pipeline = await kurento.create("MediaPipeline");
  }
  return kurentoGlobal.pipeline;
}
const kurentoCandidate = (_candidate, id) => {
  const webRtcEndpoint = kurentoGlobal.webRtcEndpoints[id];
  if (webRtcEndpoint) {
    console.log("recieve candidate", _candidate);
    const candidate = kurentoClient.getComplexType("IceCandidate")(_candidate);

    webRtcEndpoint.addIceCandidate(candidate, error => {
      if (error) console.error(error);
    });
  }
};

const start = async (sdpOffer, uri, id, socket, networkCache = 1000) => {
  console.log(sdpOffer, uri, id, networkCache);

  const pipeline = await getPipeline();
  const playerEndpoint = await pipeline.create("PlayerEndpoint", {
    uri,
    networkCache
  });
  const webRtcEndpoint = await pipeline.create("WebRtcEndpoint");
  kurentoGlobal.webRtcEndpoints[id] = webRtcEndpoint;
  // set ice candidtae
  webRtcEndpoint.on("OnIceCandidate", event => {
    // const iceCandidate = kurentoClient.getComplexType("IceCandidate")(
    //   event.candidate
    // );
    const candidate = event.candidate;

    console.log("Remote icecandidate " + JSON.stringify(candidate));
    socket.emit("candidate", { candidate, id });
  });

  // Start the WebRtcEndpoint
  const sdpAnswer = await webRtcEndpoint.processOffer(sdpOffer);
  webRtcEndpoint.gatherCandidates(err => {
    if (err) {
      console.error("ERROR:", err);
    }
  });

  console.log("SDP Answer from KMS to App:\n%s", sdpAnswer);
  socket.emit("sdpAnswer", { sdpAnswer, id });

  await playerEndpoint.play();
  await playerEndpoint.connect(webRtcEndpoint);
  console.log("player playing and connected");
};
module.exports.start = start;
module.exports.kurentoCandidate = kurentoCandidate;
