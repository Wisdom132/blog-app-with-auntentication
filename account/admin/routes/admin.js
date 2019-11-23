const express = require("express");
const router = express.Router();
const adminController = require("../controller/adminController");
const jwt = require("jsonwebtoken");

const passport = require("passport");

// custome user registration
router.post("/register", adminController.registerAdmin);
//custom user login
router.post("/login", adminController.loginAdmin);
//get all users
router.get("/admin", adminController.getAdmin);
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  adminController.getAuthenticatedAdminProfile
);
router.delete("/admin/remove/:id", adminController.deleteAdminInfo);

module.exports = router;
