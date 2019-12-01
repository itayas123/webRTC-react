//const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../models/user");
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  User.find({}, (err, users) => {
    let allUsers = [];

    users.forEach(user => {
      allUsers.push(user.email);
    });

    return res.send({ data: allUsers, error: null });
  });
});

router.get("/getCurrentUser", async (req, res) => {
  let user = null;
  try {
    user = await User.findOne({ token: req.query.token });
  } catch (e) {
    console.log(e);
  }
  if (user) {
    return res.send({ data: user, error: null });
  } else {
    return res.send({ data: null, error: "Invalid token." });
  }
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body, true);
  if (error) return res.send({ data: null, error: error.details[0].message });

  let user = null;
  try {
    user = await User.findOne({ email: req.body.email });
  } catch (e) {
    console.log(e);
  }

  if (user) return res.send({ data: null, error: "User already registered." });

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  const token = user.generateAuthToken();
  user.token = token;
  user.admin = false;
  user.sources = [];
  // const salt = await bcrypt.genSalt(10);
  // user.password = await bcrypt.hash(user.password, salt);

  try {
    await user.save();
  } catch (e) {
    console.log(e);
  }

  res.send({
    data: _.pick(user, ["_id", "name", "email", "admin", "token", "sources"]),
    error: null
  });
});

module.exports = router;
