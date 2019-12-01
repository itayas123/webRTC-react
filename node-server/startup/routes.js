const express = require("express");
const users = require("../routes/users");
const auth = require("../routes/auth");
const source = require("../routes/sources");

module.exports = function(app) {
  app.use(express.json());
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/api/sources", source);
};
