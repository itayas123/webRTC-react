const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const users = require("./services/user.service");
const sources = require("./services/source.service");
const config = require("./config");
const User = require("./models/user");
const { getUserIdByToken } = require("./utils");

app.use(cors({ origin: config.ALLOWED_ORIGINS }));
app.use(bodyParser.json());

/**
 * extended points to the ability to post nested objects.
 * if false, you can not post those.
 * if true, you can post whatever and however you like to.
 */
app.use(bodyParser.urlencoded({ extended: true }));

app.use(async function (req, res, next) {
  const id = getUserIdByToken(req.headers.authorization);
  if (id) {
    req.user = await User.findById(id);
  }
  next();
});

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
    useFindAndModify: false,
  })
  .then(() => {
    console.log(`Connected to ${db}...`);

    server.listen(port, () => console.log(`Listening on port ${port}...`));
    // require("./socket.handler")(server);
  })
  .catch((error) => {
    console.error(`Not connected to ${db}... ${error}`);
  });

module.exports = server;
