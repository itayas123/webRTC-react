const kurentoClient = require("kurento-client");

const args = {
  ws_uri: "ws://192.168.99.100:8888/kurento"
};
async function start(uri, networkCache = 1000) {
  const kurento = await kurentoClient(args.ws_uri);
  const pipeline = await kurento.create("MediaPipeline");
  const playerEndpoint = await pipeline.create("PlayerEndpoint", {
    uri,
    networkCache
  });
  const webRtcEndpoint = await pipeline.create("WebRtcEndpoint");
}
