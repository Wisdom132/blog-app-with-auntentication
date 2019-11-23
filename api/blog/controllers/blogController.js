const express = require("express");
const Blog = require("../model/blog");
const Category = require("../../category/model/category");

// get all blog post
exports.getBlogPosts = async (req, res) => {
  try {
    let response = await Blog.find()
      .populate("category")
      .select(
        "tags dateCreated title content category.title category.description"
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

// create a new blog post
exports.createNewPost = async (req, res) => {
  try {
    let blog = new Blog({
      title: req.body.title,
      tags: req.body.tags,
      category: req.body.category,
      content: req.body.content
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
        "tags dateCreated title content category.title category.description"
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
    });
    res.status(200).json({
      data: response
    });
  } catch (err) {
    res.status(500).json({
      error: err
    });
  }
};
