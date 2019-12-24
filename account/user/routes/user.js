const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const auth = require("../../../config/auth");

// custome user registration
router.post("/register", userController.registerUser);
//custom user login
router.post("/login", userController.loginUser);

// loguser out
router.get("/logout", userController.logUserOut);
//get all users
router.get("/users", auth, userController.getUsers);
router.get("/confirmation/:token", userController.confirmationPost);
router.post("/resend", userController.resendTokenPost);

router.post("/forgot-password", userController.forgotPassword);

router.get("/reset-password/:token", userController.getUserToken);
router.post("/reset-password/:token", userController.resetPassword);

router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  userController.getAuthenticatedUserProfile
);
router.delete("/users/remove/:id", userController.deleteUserInfo);
router.get("/google", userController.googleStrategy);
router.get("/google/redirect", userController.googleRedirect);

module.exports = router;
