const app = require("express")();
const cors = require("cors");
app.use(cors());
const server = require("http").Server(app);
const io = require("socket.io")(server);

const port = process.env.PORT || 80;
server.listen(port, () => console.log(`Listening on port ${port}...`));

require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();

const { start, kurentoCandidate } = require("./routes/kurento");
io.on("connection", socket => {
  console.log("socket connected");
  for (let index = 0; index < 5; index++) {
    setTimeout(() => {
      socket.emit("try", { tt: "ttsts" });
    }, 2000);
  }
  socket.on("start", ({ sdpOffer, url }) => start(sdpOffer, url, socket));
  socket.on("candidate", ({ candidate }) => kurentoCandidate(candidate));
});

module.exports = server;
