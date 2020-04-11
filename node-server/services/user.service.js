const express = require("express");
const expressRouter = express.Router({ mergeParams: true });
const jwt = require("jsonwebtoken");
const ErrorResponse = require("../models/errorResponse");
const CRUDService = require("./crud.service");
const User = require("../models/user");

class UserService extends CRUDService {
  constructor(router) {
    super(User, router);
  }

  setupRoutes() {
    super.setupRoutes();
    this.router.get("/getCurrentUser", this.getCurrentUser.bind(this));
    this.router.get("/login", this.login.bind(this));
  }

  async getCurrentUser(req, res, next) {
    try {
      const { token } = req.headers;
      if (token) {
        const { _id } = jwt.decode(token);
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
      // TODO: change to body
      const { email, password } = req.query;
      const user = await this.model.findOne({ email });
      if (!user) return next(new ErrorResponse("Invalid email", 404));
      if (user.password !== password)
        return next(new ErrorResponse("Invalid password", 404));
      const token = user.generateAuthToken();
      return res.send({ data: { ...user.toObject(), token } });
    } catch (e) {
      next(e);
    }
  }
}
const userService = new UserService(expressRouter);
module.exports = userService.router;
