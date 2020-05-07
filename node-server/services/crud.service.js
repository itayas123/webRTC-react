const ErrorResponse = require("../models/errorResponse");

class CRUDService {
  constructor(model, router) {
    this.model = model;
    this.routes = [];
    this.setupRoutes();
  }

  setupRoutes() {
    this.routes.push(
      {
        method: "post",
        path: "/",
        handlers: [this.checkAdmin, this.create.bind(this)],
      },
      {
        method: "put",
        path: "/:id",
        handlers: [this.checkAdmin, this.update.bind(this)],
      },
      {
        method: "delete",
        path: "/:id",
        handlers: [this.checkAdmin, this.delete.bind(this)],
      },
      {
        method: "get",
        path: "/",
        handlers: [this.checkAdmin, this.getAll.bind(this)],
      }
    );
  }

  checkUser(req, res, next) {
    if (!req.user) {
      return next(new ErrorResponse("Invalid token", 401));
    }
    return next();
  }

  checkAdmin(req, res, next) {
    if (!req.user || !req.user.admin) {
      return next(new ErrorResponse("Invalid token - User isn't Admin", 401));
    }
    return next();
  }

  async create(req, res, next) {
    try {
      const { body } = req;
      delete body._id;
      const newObject = new this.model({ ...body });
      await newObject.save();
      return res.send(newObject);
    } catch (e) {
      console.error(e);
      if (e.code === 11000) {
        // duplication error - already exists
        const exists = Object.keys(e.keyPattern)[0];
        return next(new ErrorResponse(`${exists} already exists`));
      }
      next(e);
    }
  }

  async update(req, res, next) {
    try {
      const _id = req.params.id;
      await this.model.updateOne({ _id }, req.body);
      const newUser = await this.model.findById(_id);
      return res.send(newUser);
    } catch (e) {
      console.error(e);
      next(e);
    }
  }

  async delete(req, res, next) {
    try {
      const _id = req.params.id;
      await this.model.deleteOne({ _id });
      return res.send(req.body);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async getAll(req, res, next) {
    try {
      const results = await this.model.find({});
      return res.send(results);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
}

module.exports = CRUDService;
