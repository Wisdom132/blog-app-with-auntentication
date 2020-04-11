const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");

const Admin = require("../model/Admin");
const passport = require("passport");
const config = require("../../../config/database");

exports.registerAdmin = (req, res) => {
  let newAdmin = new Admin({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    contact: req.body.contact,
    password: req.body.password,
    job_profile: req.body.job_profile
  });
  Admin.addAdmin(newAdmin, (err, admin) => {
    if (err) {
      let message = "";
      if (err.errors.username) {
        message = "Username is already in use";
      }
      if (err.errors.email) {
        message = "Email is already in use";
      }

      res.status(401).json({
        message: false,
        err
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Admin registration is successful",
        admin
      });
    }
  });
};

exports.loginAdmin = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  Admin.getAdminByUsername(username, (err, admin) => {
    if (err) throw err;

    if (!admin) {
      return res.status(500).json({
        success: false,
        message: "Wrong Login Details"
      });
    }
    Admin.comparePassword(password, admin.password, (err, isMatch) => {
      if (err) {
        res.json(err);
      }
      if (isMatch) {
        const token = jwt.sign({
            type: "admin",
            data: {
              _id: admin._id,
              username: admin.username,
              name: admin.name,
              email: admin.email,
              contact: admin.contact,
              job_profile: admin.job_profile
            }
          },
          config.secret, {
            expiresIn: 604800
          }
        );
        return res.json({
          success: true,
          token: token
        });
      } else {
        return res.json({
          success: false,
          message: "Wrong Login Details"
        });
      }
    });
  });
};

exports.getAdmin = async (req, res) => {
  try {
    let response = await Admin.find();
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({
      error: err
    });
  }
};

//get authenticated Admin profile
exports.getAuthenticatedAdminProfile = async (req, res) => {
  try {
    let response = await res.status(200).json({
      admin: req.user
    });
  } catch (err) {
    res.status(500).json({
      error: err
    });
  }
};

exports.deleteAdminInfo = async (req, res) => {
  let id = req.params.id;
  try {
    let response = await Admin.remove({
      _id: id
    });
    res.status(200).json({
      message: "Admin deleted",
      response: response
    });
  } catch (err) {
    res.status(500).json({
      error: err
    });
  }
};