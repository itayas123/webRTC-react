//const bcrypt = require("bcrypt");
const _ = require("lodash");
const { Source, validate } = require("../models/source");
const { User } = require("../models/user");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  let user = null;
  try {
    user = await User.findOne({ email: req.query.email });
  } catch (e) {
    console.log(e);
  }
  Source.find({}, (err, sources) => {
    let userSourcees = [];
    if (user) {
      sources.forEach(source => {
        if (
          user.admin ||
          (user.sources && user.sources.includes(source.name))
        ) {
          userSourcees.push(source);
        }
      });
    }
    return res.status(200).send({ data: userSourcees, error: null });
  });
});

router.post("/", async (req, res) => {
  const bodySource = req.body.source;
  const { error } = validate(bodySource);
  if (error)
    return res
      .status(200)
      .send({ data: null, error: error.details[0].message });

  let source = null;
  try {
    source = await Source.findOne({ name: bodySource.name });
  } catch (e) {
    return res
      .status(200)
      .send({ data: null, error: error.details[0].message });
  }

  if (source)
    return res
      .status(200)
      .send({ data: null, error: "Source's name already registered." });

  source = new Source(_.pick(bodySource, ["name", "src"]));

  try {
    await source.save();
  } catch (e) {
    return res
      .status(200)
      .send({ data: null, error: error.details[0].message });
  }
  const users = req.body.users;
  for (let i = 0; i < users.length; i++) {
    let user = null;
    try {
      user = await User.findOne({ email: users[i] });
      if (user) {
        user.sources.push(source.name);
        await user.save();
      }
    } catch (e) {
      console.log(e);
    }
  }

  res.status(200).send({
    data: _.pick(source, ["name", "src"]),
    error: null
  });
});

module.exports = router;
