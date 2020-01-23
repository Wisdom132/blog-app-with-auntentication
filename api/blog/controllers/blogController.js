const express = require("express");
const Blog = require("../model/blog");
const Category = require("../../category/model/category");
const upload = require("../../../config/multer");
const cloud = require("../../../config/cloudinary");

// get all blog post
exports.getBlogPosts = async (req, res) => {
  try {
    let response = await Blog.find()
      .populate("category")
      .select(
        "tags dateCreated title content category.title category.description featured_image"
      );
    res.status(200).json({
      data: response
    });
  } catch (err) {
    res.status(500).json({
      error: err
    });
  }
};



exports.getAllPostsAndCategory = async (req, res) => {
  try {
    let response = await Blog.aggregate([
       {$lookup:{
        from: 'categories',
        localField: 'category',
        foreignField: '_id',
        as: 'category'
}},
      { $group: { _id: "$category", posts: { $push: "$$ROOT" } } },
     
    ])
    res.status(200).json({
      data: response
    });
  } catch (err) {
    res.status(500).json({
      error: err
    });
    console.log(err)
  }
};




// create a new blog post
exports.createNewPost = async (req, res) => {
  let images = [];
  for (let file of req.files) {
    let result = await cloud.uploads(file.path);

    images.push(result.url);
  }
  try {
    let result = await cloud.uploads();
    console.log(result);
    let blog = new Blog({
      title: req.body.title,
      tags: req.body.tags,
      category: req.body.category,
      content: req.body.content,
      featured_image: images
    });

    let response = await blog.save();
    res.status(200).json({
      data: response
    });
  } catch (err) {
    res.status(500).json({
      error: err
    });
  }
};
// get post by id
exports.getBlogPostById = async (req, res) => {
  try {
    const id = req.params.id;
    let response = await Blog.findById({ _id: id })
      .populate("category")
      .select(
        "tags dateCreated title content category.title category.description featured_image"
      );
    res.status(200).json({
      response
    });
  } catch (err) {
    res.status(500).json({
      error: err
    });
  }
};

// delete a blogpost
exports.removeBlogPost = async (req, res) => {
  try {
    const id = req.params.id;
    let response = await Blog.remove({ _id: id });
    res.status(200).json({
      data: response
    });
  } catch (err) {
    res.status(500).json({
      error: err
    });
  }
};

// get blog post based on category
exports.getPostByCateggory = async (req, res) => {
  try {
    let response = await Blog.find({
      category: req.params.id
    }).populate("category");
    res.status(200).json({
      data: response
    });
  } catch (err) {
    res.status(500).json({
      error: err
    });
  }
};
