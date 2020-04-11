const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const users = require("./services/user.service");
const sources = require("./services/sources");
const config = require("./config");

app.use(cors());
app.use(bodyParser.json());

/**
 * extended points to the ability to post nested objects.
 * if false, you can not post those.
 * if true, you can post whatever and however you like to.
 */
app.use(bodyParser.urlencoded({ extended: true }));

const router = express.Router();

router.use("/users", users);
router.use("/sources", sources);

app.use("/api", router);

app.use(function (err, req, res, next) {
  const errorStatus = err.status || 500;
  const errorMessage = err.message;

  console.error(`response failed with status ${errorStatus}`);
  console.error(`response failed with message ${errorMessage}`);

  const errObj = {
    error: errorMessage,
    status: errorStatus,
  };

  res.status(errorStatus).send(errObj);
});

const server = require("http").Server(app);
const db = config.MONGO_URL;
const port = process.env.PORT || 3001;

mongoose
  .connect(db, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log(`Connected to ${db}...`);
    app._router.stack.forEach(print.bind(null, []));

    server.listen(port, () => console.log(`Listening on port ${port}...`));
    require("./socket.handler")(server);
  })
  .catch((error) => {
    console.error(`Not connected to ${db}... ${error}`);
  });

function print(path, layer) {
  if (layer.route) {
    layer.route.stack.forEach(
      print.bind(null, path.concat(split(layer.route.path)))
    );
  } else if (layer.name === "router" && layer.handle.stack) {
    layer.handle.stack.forEach(
      print.bind(null, path.concat(split(layer.regexp)))
    );
  } else if (layer.method) {
    console.log(
      "%s /%s",
      layer.method.toUpperCase(),
      path.concat(split(layer.regexp)).filter(Boolean).join("/")
    );
  }
}

function split(thing) {
  if (typeof thing === "string") {
    return thing.split("/");
  } else if (thing.fast_slash) {
    return "";
  } else {
    var match = thing
      .toString()
      .replace("\\/?", "")
      .replace("(?=\\/|$)", "$")
      .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//);
    return match
      ? match[1].replace(/\\(.)/g, "$1").split("/")
      : "<complex:" + thing.toString() + ">";
  }
}

module.exports = server;
