const express = require("express");
const expressRouter = express.Router({ mergeParams: true });
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
      handlers: [this.checkUser, this.sourcesByUser.bind(this)],
    });
  }

  async sourcesByUser(req, res, next) {
    try {
      const { user } = req;
      if (user.admin) {
        const allSources = await this.model.find({});
        return res.send(allSources);
      }
      return res.send(user.sources);
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
        await User.findByIdAndUpdate(userId, {
          $push: { sources: newSource._id },
        });
      }
      return res.send(newSource);
    } catch (e) {
      next(e);
    }
  }
}

new SourceService().routes.forEach((route) => {
  const { method, path, handlers } = route;
  console.log(method + " " + path);
  expressRouter[method](path, handlers);
});

module.exports = expressRouter;
