require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const path = require("path");
const morgan = require("morgan");
const passportSetup = require("./config/googleStrategy");
const PORT = process.env.PORT || 5000;
//bring in the database
const config = require("./config/database");
//connect to the database
mongoose.set("useCreateIndex", true);
mongoose
  .connect(config.database, {
    useNewUrlParser: true
  })
  .then(() => {
    console.log("Database is connected");
  })
  .catch(err => {
    console.log({
      database_error: err
    });
  });
//initialize the modules
const app = express();

//configure morgan
app.use(morgan("dev"));
//defining middlewares
//registering cors
app.use(cors());
//set static folder
app.use(express.static(path.join(__dirname, "public")));
//boody parser middleware
app.use(bodyParser.json());
// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// configure page error handling
// const error = require("./config/error");
// app.use(error.error);
// app.use(error.err);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/uploads", express.static("uploads"));
// create a custome middleware for authentication
const checkUserType = (req, res, next) => {
  const userType = req.originalUrl.split("/")[2];
  require("./config/passport")(userType, passport);
  next();
};

app.use(checkUserType);
// bring in routes
//user routes
const users = require("./account/user/routes/user");
app.use("/api/users", users);

//admin routes
const admin = require("./account/admin/routes/admin");
app.use("/api/admin", admin);

// blog routes
const blogPost = require("./api/blog/routes/blog");
app.use("/api/blog", blogPost);

//category routes
const category = require("./api/category/routes/category");
app.use("/api/category", category);


//draft routes
const draft = require("./api/draft/routes/draftRoutes")
app.use("/api/draft", draft);


//register port
app.listen(PORT, () => {
  console.log("App is running on " + PORT);
});