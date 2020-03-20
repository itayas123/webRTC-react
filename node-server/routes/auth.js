//const bcrypt = require("bcrypt");
const User = require("../models/user");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const { email, password } = req.query;
  const user = await User.findOne({ email });
  if (!user) return res.send({ data: null, error: "Invalid email" });
  if (user.password !== password)
    return res.send({ data: null, error: "Invalid password" });
  const token = user.generateAuthToken();
  return res.send({ data: { ...user.toObject(), token }, error: null });
});

module.exports = router;
