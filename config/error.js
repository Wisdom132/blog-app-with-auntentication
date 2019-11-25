const express = require("express");
const app = express();
let error = app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

let err = app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = { error, err };
