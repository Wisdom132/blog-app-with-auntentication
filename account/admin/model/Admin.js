const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const uniqueValidator = require("mongoose-unique-validator");

// Admin  Schema
const adminSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
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
  password: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  job_profile: {
    type: String,
    required: true
  }
});

adminSchema.plugin(uniqueValidator);
const Admin = (module.exports = mongoose.model("Admin", adminSchema));

// find admin by ID
module.exports.getAdminById = (id, callback) => {
  Admin.findById(id, callback);
};

// find admin by its username
module.exports.getAdminByUsername = (username, callback) => {
  const query = {
    username: username
  };

  Admin.findOne(query, callback);
};

// To register the admin
module.exports.addAdmin = (newAdmin, callback) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newAdmin.password, salt, (err, hash) => {
      if (err) throw err;
      newAdmin.password = hash;
      newAdmin.save(callback);
    });
  });
};

// compare password
module.exports.comparePassword = (password, hash, callback) => {
  bcrypt.compare(password, hash, (err, isMatch) => {
    if (err) throw err;
    callback(null, isMatch);
  });
};
