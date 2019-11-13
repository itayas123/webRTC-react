const Joi = require("joi");
//const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User } = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const _ = require("lodash");

router.get("/", async (req, res) => {
  const { error } = validate(req.query);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.query.email });
  if (!user) return res.status(400).send("Invalid email or password.");

  //const validPassword = await bcrypt.compare(req.query.password, user.password);
  const validPassword = req.query.password === user.password;
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email", "admin"]));
});

function validate(req) {
  const schema = {
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .min(5)
      .max(255)
      .required()
  };

  return Joi.validate(req, schema);
}

module.exports = router;
