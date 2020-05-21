const socketIO = require("socket.io");
const {
  start,
  init,
  onRecieveIceCandaite,
  startRecord,
  stopRecord,
  onUserDisconnected,
  onDeleteSession,
  onUserConnected,
} = require("./services/kurento.service");
const User = require("./models/user");
const { getUserIdByToken } = require("./utils");

module.exports = async function (server) {
  const io = socketIO(server);
  await init(io);
  io.use(async (socket, next) => {
    const id = getUserIdByToken(socket.handshake.query.authorization);
    if (id) {
      const user = await User.findById(id);
      if (user) {
        next();
      } else {
        next(new Error("Invalid authorization token"));
      }
    } else {
      next(new Error("No authorization token"));
    }
  });
  io.on("connection", async (socket) => {
    onUserConnected(socket);
    // TODO: check another option
    socket.on("start", (...args) => start(args[0], args[1], args[2], socket));
    socket.on("candidate", onRecieveIceCandaite);
    socket.on("startRecord", startRecord);
    socket.on("stopRecord", (id) => stopRecord(id, socket));
    socket.on("deleteSession", onDeleteSession);
    socket.on("disconnect", () => onUserDisconnected(socket.id));
  });
};
