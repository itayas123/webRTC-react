//const bcrypt = require("bcrypt");
const _ = require("lodash");
const { Source, validate } = require("../models/source");
const { User } = require("../models/user");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  let user = null;
  try {
    user = await User.findOne({ token: req.query.token });
  } catch (e) {
    console.log(e);
  }
  if (user && user.admin) {
    Source.find({}, (err, allSources) => {
      return res.status(200).send({ data: allSources, error: null });
    });
  } else if (user) {
    let userSourcees = [];
    for (let i = 0; i < user.sources.length; i++) {
      let source = null;
      source = await Source.findOne({ name: user.sources[i] });
      if (source) {
        userSourcees.push(source);
      } else {
        try {
          user.sources.splice(i, 1);
          await user.save();
        } catch (e) {
          console.log(e);
        }
      }
    }
    return res.status(200).send({ data: userSourcees, error: null });
  } else {
    return res.status(200).send({ data: null, error: "Invalid token" });
  }
});

router.delete("/", async (req, res) => {
  let source = null;
  try {
    source = await Source.findOne({ name: req.query.name });
  } catch (e) {
    console.log(e);
  }
  if (source) {
    try {
      await source.remove();
      res.status(200).send({
        data: true,
        error: null
      });
    } catch (e) {
      console.log(e);
    }
  } else {
    res.status(200).send({
      data: null,
      error: "Invalid name"
    });
  }
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
    console.log(e);
  }

  if (source)
    return res
      .status(200)
      .send({ data: null, error: "Source's name already registered." });

  source = new Source(_.pick(bodySource, ["name", "src"]));

  try {
    await source.save();
  } catch (e) {
    console.log(e);
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
