const socketIO = require("socket.io");
const {
  start,
  init,
  onRecieveIceCandaite,
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
    socket.on("userDisconnected", onUserDesconnected);
  });
};
