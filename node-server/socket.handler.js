const socketIO = require("socket.io");
const {
  start,
  init,
  onRecieveIceCandaite,
  startRecord,
  stopRecord,
  onUserDisconnected,
  onDeleteSession,
} = require("./services/kurento.service");
module.exports = async function (server) {
  const io = socketIO(server);
  await init(io);
  io.on("connection", async (socket) => {
    const { id } = socket;
    console.log("socket connected ", id);
    // TODO: check another option
    socket.on("start", (...args) => start(args[0], args[1], args[2], socket));
    socket.on("candidate", onRecieveIceCandaite);
    socket.on("startRecord", startRecord);
    socket.on("stopRecord", (id) => stopRecord(id, socket));
    socket.on("deleteSession", onDeleteSession);
    socket.on("disconnect", () => onUserDisconnected(id));
  });
};
