const mongoose = require("mongoose");
const config = require("../config");

module.exports = function () {
  const db = config.MONGO_URL;
  mongoose
    .connect(db, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    })
    .then(() => console.log(`Connected to ${db}...`))
    .catch((error) => {
      console.error(`Not connected to ${db}... ${error}`);
    });
};
