const socketIO = require("socket.io");
const {
  start,
  init,
  onRecieveIceCandaite,
  startRecord,
  stopRecord,
  onUserDesconnected
} = require("../routes/kurento");
module.exports = async function(server) {
  await init();
  const io = socketIO(server);
  io.on("connection", socket => {
    const { id } = socket;
    console.log("socket connected ", id);
    socket.on("start", ({ sdpOffer, url, _id }) =>
      start(sdpOffer, url, _id, socket)
    );
    socket.on("candidate", ({ candidate, _id }) =>
      onRecieveIceCandaite(candidate, _id)
    );
    socket.on("startRecord", ({ _id, uri }) => startRecord(_id, uri));
    socket.on("stopRecord", ({ _id }) => stopRecord(_id, socket));
    socket.on("userDisconnected", onUserDesconnected);
  });
};
