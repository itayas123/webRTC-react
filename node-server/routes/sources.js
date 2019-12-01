//const bcrypt = require("bcrypt");
const _ = require("lodash");
const { Source, validate } = require("../models/source");
const { User } = require("../models/user");
const express = require("express");
const router = express.Router();

async function getUserSources(user) {
  let userSources = [];
  for (let i = 0; i < user.sources.length; i++) {
    let source = null;
    source = await Source.findOne({ name: user.sources[i] });
    if (source) {
      userSources.push(source);
    } else {
      try {
        user.sources.splice(i, 1);
        await user.save();
      } catch (e) {
        console.log(e);
      }
    }
  }
  return userSources;
}

async function checkSource(source) {
  const { error } = validate(source);
  if (error) throw new Error(error.details[0].message);

  let existSource = null;
  try {
    existSource = await Source.findOne({ name: source.name });
  } catch (e) {
    console.log(e);
  }

  if (existSource) throw new Error("Source's name already exist.");

  return new Source(_.pick(source, ["name", "src"]));
}

async function pushSourceToUsers(users, source) {
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
}

router.get("/", async (req, res) => {
  let user = null;
  try {
    user = await User.findOne({ token: req.query.token });
  } catch (e) {
    console.log(e);
  }
  if (user && user.admin) {
    Source.find({}, (err, allSources) => {
      return res.send({ data: allSources, error: null });
    });
  } else if (user) {
    const userSourcees = await getUserSources(user);
    return res.send({ data: userSourcees, error: null });
  } else {
    return res.send({ data: null, error: "Invalid token" });
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
      res.send({
        data: true,
        error: null
      });
    } catch (e) {
      console.log(e);
    }
  } else {
    res.send({
      data: null,
      error: "Invalid name"
    });
  }
});

router.post("/", async (req, res) => {
  let source = null;
  try {
    source = await checkSource(req.body.source);
  } catch (error) {
    res.send({ data: null, error: error.message });
  }
  if (source) {
    try {
      await source.save();
    } catch (e) {
      console.log(e);
    }

    await pushSourceToUsers(req.body.users);

    res.send({
      data: _.pick(source, ["name", "src"]),
      error: null
    });
  }
});

module.exports = router;
