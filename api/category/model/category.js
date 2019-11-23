const mongoose = require("mongoose");
// blog Schema
const categorySchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  dateCreated: {
    type: Date,
    default: Date.now()
  }
});

const Category = (module.exports = mongoose.model("Category", categorySchema));
