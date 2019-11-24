const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  admin: {
    type: Boolean,
    required: false
  },
  sources: {
    type: Array,
    required: false
  }
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id }, config.get("jwtPrivateKey"));
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user, isRegister) {
  const schema = {
    name: isRegister
      ? Joi.string()
          .min(5)
          .max(50)
          .required()
      : Joi.string().optional(),
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .min(5)
      .max(255)
      .required(),
    admin: Joi.boolean().optional()
  };

  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;
