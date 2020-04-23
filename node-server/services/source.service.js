const express = require("express");
const expressRouter = express.Router({ mergeParams: true });
const { getUserIdByToken } = require("../utils");
const ErrorResponse = require("../models/errorResponse");
const CRUDService = require("./crud.service");
const Source = require("../models/source");
const User = require("../models/user");

class SourceService extends CRUDService {
  constructor() {
    super(Source);
  }

  setupRoutes() {
    super.setupRoutes();
    this.routes.push({
      method: "get",
      path: "/sourcesByUser",
      handler: this.sourcesByUser.bind(this),
    });
  }

  async sourcesByUser(req, res, next) {
    let user = null;
    try {
      const { token } = req.headers;
      const _id = getUserIdByToken(token);
      user = await User.findById(_id).populate("sources");
      if (user) {
        if (user.admin) {
          const allSources = await this.model.find({});
          return res.send({ data: allSources });
        }
        return res.send({ data: user.sources });
      } else {
        return next(new ErrorResponse("Invalid token", 401));
      }
    } catch (e) {
      next(e);
    }
  }

  async create(req, res, next) {
    const { source, users } = req.body;
    const newSource = new this.model(source);
    try {
      await newSource.save();
      for (const userId of users) {
        const user = await User.findById(userId);
        await User.findByIdAndUpdate(userId, {
          sources: [...user.toObject().sources, newSource._id],
        });
      }
      return res.send({ data: newSource });
    } catch (e) {
      next(e);
    }
  }
}

new SourceService().routes.forEach((route) => {
  const { method, path, handler } = route;
  console.log(method + " " + path);
  expressRouter[method](path, handler);
});

module.exports = expressRouter;
