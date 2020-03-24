class CrudController {
  constructor(model) {
    this.model = model;
  }

  create = async (req, res) => {
    const results = new this.model(req.body);
    try {
      const saved = await results.save();
      return res.send();
    }
  };
}
