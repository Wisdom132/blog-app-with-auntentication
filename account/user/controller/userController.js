const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");

const User = require("../model/User");
const passport = require("passport");
const config = require("../../../config/database");

exports.registerUser = (req, res) => {
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    contact: req.body.contact,
    password: req.body.password
  });
  User.addUser(newUser, (err, user) => {
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
        message: "User registration is successful",
        user
      });
    }
  });
};

exports.loginUser = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  User.getUserByUsername(username, (err, user) => {
    if (err) throw err;

    if (!user) {
      return res.status(500).json({
        success: false,
        message: "Wrong Login Details"
      });
    }
    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) {
        res.json(err);
      }
      if (isMatch) {
        const token = jwt.sign(
          {
            type: "user",
            data: {
              _id: user._id,
              username: user.username,
              name: user.name,
              email: user.email,
              contact: user.contact
            }
          },
          config.secret,
          { expiresIn: 604800 }
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

exports.getUsers = async (req, res) => {
  try {
    let response = await User.find();
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({
      error: err
    });
  }
};

exports.googleStrategy = passport.authenticate("google", {
  scope: ["profile"]
});

(exports.googleRedirect = passport.authenticate("google")),
  (req, res) => {
    res.send("This is google redirect");
  };

//get authenticated user profile
exports.getAuthenticatedUserProfile = async (req, res) => {
  try {
    let response = await res.status(200).json({
      user: req.user
    });
  } catch (err) {
    res.status(500).json({
      error: err
    });
  }
};

exports.deleteUserInfo = async (req, res) => {
  let id = req.params.id;
  try {
    let response = await User.remove({ _id: id });
    res.status(200).json({
      message: "User deleted",
      response: response
    });
  } catch (err) {
    res.status(500).json({
      error: err
    });
  }
};
