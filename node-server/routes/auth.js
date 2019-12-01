//const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../models/user");
const express = require("express");
const router = express.Router();

async function checkUser(user) {
  const { error } = validate(user, false);
  if (error) throw new Error(error.details[0].message);

  let newUser = null;
  try {
    newUser = await User.findOne({ email: user.email });
  } catch (e) {
    console.log(e);
  }
  if (!newUser) throw new Error("Invalid email.");

  if (newUser.password !== user.password) throw new Error("Invalid password.");

  return newUser;
}

router.get("/", async (req, res) => {
  let user = null;
  try {
    user = await checkUser(req.query, res);
  } catch (error) {
    res.send({ data: null, error: error.message });
  }

  if (user) {
    const token = user.generateAuthToken();
    user.token = token;

    try {
      await user.save();
    } catch (e) {
      console.log(e);
    }
    res.send({
      data: _.pick(user, ["_id", "name", "email", "admin", "token"]),
      error: null
    });
  }
});

module.exports = router;
