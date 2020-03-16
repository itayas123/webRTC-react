// @ts-check
const KurentoClientModel = require("../models/kurentoClientModel");
const args = {
  ws_uri: "ws://127.0.0.1:8888/kurento"
};

const kurentoclient = new KurentoClientModel();

const init = async socket => {
  kurentoclient.init(socket, args.ws_uri);
};

const start = async (sdpOffer, uri, id, socket, networkCache = 1000) => {
  console.log(sdpOffer, uri, id, networkCache);

  const playerEndpoint = await kurentoclient.createPlayerEndpoint(uri, {
    networkCache
  });

  const webRtcEndpoint = await kurentoclient.createWebRtcEndpoint(id);

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

const onRecieveIceCandaite = kurentoclient.onRecieveIceCandidate;
module.exports = { init, start, onRecieveIceCandaite };
