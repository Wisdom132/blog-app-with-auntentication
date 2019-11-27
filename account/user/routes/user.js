const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const jwt = require("jsonwebtoken");

const passport = require("passport");

// custome user registration
router.post("/register", userController.registerUser);
//custom user login
router.post("/login", userController.loginUser);
//get all users
router.get("/users", userController.getUsers);
router.get("/confirmation/:token", userController.confirmationPost);
// router.post("/resend", userController.resendTokenPost);
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  userController.getAuthenticatedUserProfile
);
router.delete("/users/remove/:id", userController.deleteUserInfo);
router.get("/google", userController.googleStrategy);
router.get("/google/redirect", userController.googleRedirect);

module.exports = router;
