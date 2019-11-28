const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const Token = require("../model/Token");
const passport = require("passport");
const config = require("../../../config/database");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const async = require("async");

//Define nodemailer transporter
let transporter = nodemailer.createTransport({
  // host: "mail.google.com",
  service: "gmail",
  // port: 587,
  secure: false,
  auth: {
    user: "ekpotwisdom@gmail.com", // generated ethereal user
    pass: "spinosky" // generated ethereal password
  },
  tls: {
    rejectUnauthorized: false
  }
});
//nodemailer transporter ends here

// create a new user
exports.registerUser = (req, res) => {
  // function to create a new user
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  });
  // function to add user to the database
  User.addUser(newUser, (err, user) => {
    if (err) {
      let message = "";
      // validation to check if username is aleady taken by anothe user
      if (err.errors.username) {
        message = "Username is already in use";
      }
      // validtion to check if email is taken by another user
      if (err.errors.email) {
        message = "Email is already in use";
      }

      res.status(401).json({
        message: false,
        err
      });
    }

    // function to create a new token
    var token = new Token({
      _userId: newUser._id, // i cature the users id
      token: crypto.randomBytes(16).toString("hex") // the code here generates the token using crypto
    });

    //save the token
    token.save(function(err) {
      if (err) {
        return res.status(500).send({ msg: err.message });
      }

      // send email to user
      let transporter = nodemailer.createTransport({
        // host: "mail.google.com",
        service: "gmail",
        // port: 587,
        secure: false,
        auth: {
          user: "ekpotwisdom@gmail.com", // generated ethereal user
          pass: "spinosky" // generated ethereal password
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      //define the email template
      var mailOptions = {
        from: "no-reply@yourwebapplication.com",
        to: newUser.email,
        subject: "Account Verification Token",
        // this is the body of the mail that is sent the the valid user
        text:
          "Hello,\n\n" +
          "Please verify your account by clicking the link: \nhttp://" +
          req.headers.host +
          "/api/users/confirmation/" +
          token.token +
          ".\n"
      };

      // action to actually send the email
      transporter.sendMail(mailOptions, function(err) {
        // check if there are any errors
        if (err) {
          return res.status(500).send({ msg: err.message });
        }
        // response to the user when the register
        res
          .status(200)
          .send("A verification email has been sent to " + newUser.email + ".");
      });
    });
  });
};

// Send email confimation link to users email
exports.confirmationPost = (req, res, next) => {
  // here we use the find method to get the token from the email params
  Token.findOne({ token: req.params.token }, (err, token) => {
    // check if this is a valid token or not
    // if it is a valid token it the passes this validation
    if (!token)
      return res.status(400).send({
        type: "not-verified",
        msg: "We were unable to find a valid token. Your token my have expired."
      });

    // find the user using the user id that is on the token model
    User.findOne({ _id: token._userId }, (err, user) => {
      // if this isnt a valid user it displays this error
      if (!user)
        return res.status(400).send({
          msg: "We were unable to find a user for this token."
        });

      // so here if the valid status is true it displays this message
      //remember that `isVerified is set to false by default`
      if (user.isVerified)
        return res.status(400).send({
          type: "already-verified",
          msg: "This user has already been verified."
        });

      //if all validation is passed we set `isverified` to true
      user.isVerified = true;
      user.save(function(err) {
        if (err) {
          return res.status(500).send({
            msg: err.message
          });
        }
        res.status(200).send("The account has been verified. Please log in.");
      });
    });
  });
};

// resend token to users email where neccessary
exports.resendTokenPost = (req, res, next) => {
  // find user with this email
  User.find({ email: req.body.email }, (err, user) => {
    console.log(user[0]);
    //if this user doesnt exit,return this error message
    if (!user[0]) {
      return res.status(400).send({
        msg: "We were unable to find a user with that email."
      });
    }
    //if status of isVerified on user model is true then return this error meaning that this user has already verified hhis or her account
    if (user[0].isVerified) {
      return res.status(400).send({
        msg: "This account has already been verified. Please login."
      });
    }

    //This will create a new token
    var token = new Token({
      _userId: user[0]._id,
      token: crypto.randomBytes(16).toString("hex")
    });

    //save the token on the token model/collection
    token.save(err => {
      if (err) {
        return res.status(500).send({ msg: err.message });
      }
      //mail option
      let mailOptions = {
        from: "no-reply@yourwebapplication.com",
        to: user[0].email,
        subject: "Account Verification Token",
        // this is the body of the mail that is sent the the valid user
        text:
          "Hello,\n\n" +
          "Please verify your account by clicking the link: \nhttp://" +
          req.headers.host +
          "/api/users/confirmation/" +
          token.token +
          ".\n"
      };

      //action to send the mail
      transporter.sendMail(mailOptions, function(err) {
        // check if there are any errors
        if (err) {
          return res.status(500).send({ msg: err.message });
        }
        // response to the user when the register
        res
          .status(200)
          .send("A verification email has been sent to " + user[0].email + ".");
      });
    });
  });
};

//login the user and the email has ben verified
exports.loginUser = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  User.getUserByUsername(username, (err, user) => {
    if (err) {
      res.status(404).json(err);
    }
    console.log(username);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Wrong Login Details"
      });
    }
    if (!user.isVerified) {
      return res.status(401).send({
        type: "not-verified",
        msg: "Your account has not been verified."
      });
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) {
        res.status(404).json(err);
      }

      if (isMatch) {
        const token = jwt.sign(
          {
            type: "user",
            data: {
              _id: user._id,
              username: user.username,
              name: user.name,
              email: user.email
            }
          },
          config.secret,
          { expiresIn: 604800 }
        );

        return res.status(200).json({
          success: true,
          token: token
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Wrong Login Details"
        });
      }
    });
  });
};

//send email to users email to reset password
exports.forgotPassword = (req, res) => {
  async.waterfall(
    [
      //first function ==> to find user
      done => {
        // find user with his or her email
        User.findOne({ email: req.body.email }).exec((err, user) => {
          if (user) {
            done(err, user);
          } else {
            done("User not found.");
          }
        });
      },
      //second function ===> to generate token
      (user, done) => {
        // create the random token
        crypto.randomBytes(16, (err, buffer) => {
          let token = buffer.toString("hex");
          done(err, user, token);
        });
      },
      // third function ===> find user email and the assign reset_password_token to the generated token
      (user, token, done) => {
        // find user using the user id and set the reset password token to the generated token
        User.findByIdAndUpdate(
          { _id: user._id },
          {
            reset_password_token: token,
            reset_password_expires: Date.now() + 86400000
          },
          { upsert: true, new: true }
        ).exec(function(err, new_user) {
          done(err, token, new_user);
        });
      },
      // forth function ==> create simple email template
      (token, user, done) => {
        let data = {
          to: user.email,
          from: "no-reply@yourwebapplication.com",
          template: "forgot-password-email",
          subject: "Password help has arrived!",
          text:
            "Hello,\n\n" +
            "Please reset you password by clicking the link: \nhttp://" +
            req.headers.host +
            "/api/users/reset-password?token=" +
            token
        };

        //action to send token to user
        transporter.sendMail(data, err => {
          if (!err) {
            return res.json({
              msg: err.message,
              message: "Kindly check your email for further instructions"
            });
          } else {
            res.status(200).json("Sent");
          }
        });
      }
    ],
    err => {
      return res.status(422).json({ message: err });
    }
  );
};

// get all the users data
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

//log user out and delete token
exports.logUserOut = (req, res) => {
  req.logout();
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

//delete user from db
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

// still login with google strategy
exports.googleStrategy = passport.authenticate("google", {
  scope: ["profile"]
});

//redirect user if valid
(exports.googleRedirect = passport.authenticate("google")),
  (req, res) => {
    res.send("This is google redirect");
  };
