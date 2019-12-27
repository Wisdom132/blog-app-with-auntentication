const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const uniqueValidator = require("mongoose-unique-validator");

// user Schema
const userSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
    index: true,
    required: true
  },
  username: {
    type: String,
    unique: true,
    required: true
  },
  isVerified: { type: Boolean, default: false },
  password: {
    type: String,
    required: [true, "Password is required"]
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  },
  dateCreated: {
    default: Date.now(),
    type: Date
  }
});

userSchema.plugin(uniqueValidator);
const User = (module.exports = mongoose.model("User", userSchema));

// find user by ID
module.exports.getUserById = (id, callback) => {
  User.findById(id, callback);
};

// find user by its username
module.exports.getUserByUsername = (username, callback) => {
  const query = {
    username: username
  };
  console.log(username);
  User.findOne(query, callback);
};
// To register the user
module.exports.addUser = (newUser, callback) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
};

// compare password
module.exports.comparePassword = (password, hash, callback) => {
  bcrypt.compare(password, hash, (err, isMatch) => {
    if (err) {
      res.status(404).json(err);
    }

    callback(null, isMatch);
  });
};
