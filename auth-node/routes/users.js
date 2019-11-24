//const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../models/user");
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  User.find({}, (err, users) => {
    let allUsers = [];

    users.forEach(user => {
      allUsers.push(user);
    });

    return res.status(200).send({ data: allUsers, error: null });
  });
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error)
    return res
      .status(200)
      .send({ data: null, error: error.details[0].message });

  let user = null;
  try {
    user = await User.findOne({ email: req.body.email });
  } catch (e) {
    return res
      .status(200)
      .send({ data: null, error: error.details[0].message });
  }

  if (user)
    return res
      .status(200)
      .send({ data: null, error: "User already registered." });

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  user.admin = false;
  user.sources = [];
  // const salt = await bcrypt.genSalt(10);
  // user.password = await bcrypt.hash(user.password, salt);

  try {
    await user.save();
  } catch (e) {
    return res
      .status(200)
      .send({ data: null, error: error.details[0].message });
  }

  const token = user.generateAuthToken();
  res
    .status(200)
    .header("x-auth-token", token)
    .send({
      data: _.pick(user, ["_id", "name", "email", "admin", "sources"]),
      error: null
    });
});

module.exports = router;
