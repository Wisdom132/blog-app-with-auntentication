const express = require("express");
const Category = require("../model/category");

exports.getCategory = async (req, res) => {
  try {
    let response = await Category.find().select(
      "title description dateCreated"
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

exports.createNewCategory = async (req, res) => {
  try {
    let category = new Category({
      title: req.body.title,
      description: req.body.description
    });
    let response = await category.save();
    res.status(200).json({
      data: response
    });
  } catch (err) {
    res.status(500).json({
      error: err
    });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const id = req.params.id;
    let response = await Category.findById({ _id: id }).select(
      "title description dateCreated"
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

exports.removeCategory = async (req, res) => {
  try {
    const id = req.params.id;
    let response = await Category.remove({ _id: id });
    res.status(200).json({
      data: response
    });
  } catch (err) {
    res.status(500).json({
      error: err
    });
  }
};