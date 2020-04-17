const config = require("../config");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  admin: {
    type: Boolean,
    required: false,
  },
  sources: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Source",
    },
  ],
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, config.JWT_PRIVATE_KEY);
  return token;
};

userSchema.methods.comparePassword = function (password, callback) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    callback(err, isMatch);
  });
};

const hashPassword = function (next, user) {
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
};

userSchema.pre("updateOne", function (next) {
  hashPassword(next, this._update);
});

userSchema.pre("save", function (next) {
  hashPassword(next, this);
});

module.exports = mongoose.model("User", userSchema);
