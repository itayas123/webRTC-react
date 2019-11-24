//const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../models/user");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const { error } = validate(req.query, false);
  if (error)
    return res
      .status(200)
      .send({ data: null, error: error.details[0].message });

  let user = null;
  try {
    user = await User.findOne({ email: req.query.email });
  } catch (e) {
    console.log(e);
  }
  if (!user)
    return res.status(200).send({ data: null, error: "Invalid email." });

  //const validPassword = await bcrypt.compare(req.query.password, user.password);
  const validPassword = req.query.password === user.password;
  if (!validPassword)
    return res.status(200).send({ data: null, error: "Invalid password." });

  const token = user.generateAuthToken();
  res
    .status(200)
    .header("x-auth-token", token)
    .send({
      data: _.pick(user, ["_id", "name", "email", "admin"]),
      error: null
    });
});

module.exports = router;