class CRUDService {
  constructor(model, router) {
    this.model = model;
    this.router = router;
    this.setupRoutes();
  }

  setupRoutes() {
    this.router.post("/", this.create.bind(this));
    this.router.put("/:_id", this.update.bind(this));
    this.router.delete("/:_id", this.delete.bind(this));
    this.router.get("/", this.getAll.bind(this));
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
      next(e);
    }
  }

  async update(req, res, next) {
    try {
      const { _id } = req.params;
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
      const { _id } = req.params;
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
