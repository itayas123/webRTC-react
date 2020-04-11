const socketIO = require("socket.io");
const {
  start,
  init,
  onRecieveIceCandaite,
  startRecord,
  stopRecord,
  onUserDesconnected,
  sendAliveSources,
} = require("./services/kurento");
module.exports = async function (server) {
  const io = socketIO(server);
  await init(io.sockets);
  io.on("connection", async (socket) => {
    const { id } = socket;
    console.log("socket connected ", id);
    sendAliveSources(socket);
    socket.on("start", ({ sdpOffer, url, _id }) =>
      start(sdpOffer, url, _id, socket)
    );
    socket.on("candidate", ({ candidate, _id }) =>
      onRecieveIceCandaite(candidate, _id)
    );
    socket.on("startRecord", ({ _id, uri }) => startRecord(_id, uri));
    socket.on("stopRecord", ({ _id }) => stopRecord(_id, socket));
    socket.on("disconnect", () => onUserDesconnected(id));
  });
};
