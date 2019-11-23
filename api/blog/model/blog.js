const mongoose = require("mongoose");
// blog Schema
const blogSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  tags: {
    type: Array,
    required: false
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  },
  // featuredImage: {
  //   type: String,
  //   required: true
  // },
  content: {
    type: String,
    required: true
  },
  dateCreated: {
    type: Date,
    default: Date.now()
  }
});

const Blog = (module.exports = mongoose.model("Blog", blogSchema));
