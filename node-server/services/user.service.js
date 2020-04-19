const express = require("express");
const expressRouter = express.Router({ mergeParams: true });
const { getUserIdByToken } = require("../utils");
const ErrorResponse = require("../models/errorResponse");
const CRUDService = require("./crud.service");
const User = require("../models/user");

class UserService extends CRUDService {
  constructor(router) {
    super(User, router);
  }

  setupRoutes() {
    this.router.put("/login", this.login.bind(this));
    this.router.get("/getCurrentUser", this.getCurrentUser.bind(this));
    super.setupRoutes();
  }

  async getAll(req, res, next) {
    try {
      const results = await User.find({}).populate("sources");
      return res.send({ data: results });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async getCurrentUser(req, res, next) {
    try {
      const { token } = req.headers;
      if (token) {
        const _id = getUserIdByToken(token);
        const user = await this.model.findById(_id);
        return res.send({ data: user });
      }
      return next(new ErrorResponse("Invalid token", 404));
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await this.model.findOne({ email });
      if (!user) {
        return next(new ErrorResponse("Invalid email", 404));
      }
      user.comparePassword(password, (err, isMatch) => {
        if (err) {
          return next(err);
        }
        if (!isMatch) {
          return next(new ErrorResponse("Invalid password", 404));
        }
        const token = user.generateAuthToken();
        return res.send({ data: { ...user.toObject(), token } });
      });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new UserService(expressRouter).router;
