const app = require("express")();
const cors = require("cors");
app.use(cors());
const server = require("http").Server(app);

const port = process.env.PORT || 3001;
server.listen(port, () => console.log(`Listening on port ${port}...`));

require("./startup/routes")(app);
require("./startup/socket")(server);
require("./startup/db")();
require("./startup/config")();

module.exports = server;
