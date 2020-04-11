//const bcrypt = require("bcrypt");
const Source = require("../models/source");
const User = require("../models/user");
const express = require("express");
const router = express.Router({ mergeParams: true });
const jwt = require("jsonwebtoken");

router.get("/", async (req, res) => {
  try {
    const allSources = await Source.find({});
    return res.send({ data: allSources, error: null });
  } catch (e) {
    console.log(e);
  }
});

router.get("/sourcesByUser", async (req, res) => {
  let user = null;
  try {
    const { _id } = jwt.decode(req.headers.token);
    user = await User.findById(_id).populate("sources");
    if (user) {
      let allSources = [];
      if (user.admin) allSources = await Source.find({});
      return res.send({ data: [...user.sources, ...allSources], error: null });
    } else {
      return res.send({ data: null, error: "Invalid token" });
    }
  } catch (e) {
    console.log(e);
  }
});

router.delete("/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    await Source.deleteOne({ _id });
    return res.send({
      data: req.body,
      error: null,
    });
  } catch (e) {
    console.log(e);
  }
});

async function addSourceToUsers(users, source) {
  for (const email of users) {
    const user = await User.findOne({ email });
    await User.updateOne(
      { _id: user._id },
      { ...user.toObject(), sources: [...user.sources, source] }
    );
  }
}
router.post("/", async (req, res) => {
  const source = new Source(req.body.source);
  try {
    await source.save();
    await addSourceToUsers(req.body.users, source._id);
  } catch (e) {
    console.log(e);
  }

  return res.send({
    data: source,
    error: null,
  });
});

module.exports = router;
