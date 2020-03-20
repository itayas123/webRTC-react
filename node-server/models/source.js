const mongoose = require("mongoose");

const sourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  uri: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Source", sourceSchema);
