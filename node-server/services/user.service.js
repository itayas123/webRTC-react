const express = require("express");
const expressRouter = express.Router({ mergeParams: true });
const ErrorResponse = require("../models/errorResponse");
const CRUDService = require("./crud.service");
const User = require("../models/user");

class UserService extends CRUDService {
  constructor() {
    super(User);
  }

  setupRoutes() {
    super.setupRoutes();
    this.routes.push(
      {
        method: "post",
        path: "/login",
        handlers: this.login.bind(this),
      },
      {
        method: "get",
        path: "/getCurrentUser",
        handlers: [this.checkUser, this.getCurrentUser.bind(this)],
      }
    );
  }

  async getAll(req, res, next) {
    try {
      const results = await User.find({}).populate("sources");
      return res.send(results);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async getCurrentUser(req, res, next) {
    try {
      return res.send(req.user);
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
        return res.send({ ...user.toObject(), token });
      });
    } catch (e) {
      next(e);
    }
  }
}

new UserService().routes.forEach((route) => {
  const { method, path, handlers } = route;
  console.log(method + " " + path);
  expressRouter[method](path, handlers);
});

module.exports = expressRouter;
