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
        handler: this.create.bind(this),
      },
      {
        method: "put",
        path: "/:id",
        handler: this.update.bind(this),
      },
      {
        method: "delete",
        path: "/:id",
        handler: this.delete.bind(this),
      },
      {
        method: "get",
        path: "/",
        handler: this.getAll.bind(this),
      }
    );
  }

  async create(req, res, next) {
    try {
      const { body } = req;
      delete body._id;
      const newObject = new this.model({ ...body });
      await newObject.save();
      return res.send({ data: newObject });
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
      return res.send({
        data: newUser,
      });
    } catch (e) {
      console.error(e);
      next(e);
    }
  }

  async delete(req, res, next) {
    try {
      const _id = req.params.id;
      await this.model.deleteOne({ _id });
      return res.send({
        data: req.body,
      });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async getAll(req, res, next) {
    try {
      const results = await this.model.find({});
      return res.send({ data: results });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
}

module.exports = CRUDService;
