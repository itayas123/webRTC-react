const express = require("express");
const expressRouter = express.Router({ mergeParams: true });
const { getUserIdByToken } = require("../utils");
const ErrorResponse = require("../models/errorResponse");
const CRUDService = require("./crud.service");
const Source = require("../models/source");
const User = require("../models/user");

class SourceService extends CRUDService {
  constructor(router) {
    super(Source, router);
  }

  setupRoutes() {
    this.router.get("/sourcesByUser", this.sourcesByUser.bind(this));
    super.setupRoutes();
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
        await User.updateOne(
          { _id: userId },
          { sources: [...user.toObject().sources, newSource._id] }
        );
      }
      return res.send({ data: newSource });
    } catch (e) {
      next(e);
    }
  }
}
const sourceService = new SourceService(expressRouter);
module.exports = sourceService.router;
