const Joi = require("joi");
const mongoose = require("mongoose");

const sourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  src: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255
  }
});

const Source = mongoose.model("Source", sourceSchema);

function validateSource(source) {
  const schema = {
    name: Joi.string()
      .min(5)
      .max(50)
      .required(),
    src: Joi.string()
      .min(2)
      .max(255)
      .required()
  };

  return Joi.validate(source, schema);
}

exports.Source = Source;
exports.validate = validateSource;
