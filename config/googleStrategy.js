let passport = require("passport");
let mongoose = require("mongoose");
let GoogleStrategy = require("passport-google-oauth20");
let User = require("../account/user/model/User");
passport.use(
  new GoogleStrategy(
    {
      clientID:
        "581244986088-d2lp7iuo6f3qed1boi7sa05mtoiho3ae.apps.googleusercontent.com",
      clientSecret: "rKArI-0bMZgRgjQu6hgMiuhd",
      // clientID: process.env.GOOGLE_CLIENT_ID,
      // clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/users/google/redirect"
    },
    (accessToken, refreshToken, profile, cb) => {
      User.findOne({ googleid: profile.id }).then(currentUser => {
        if (currentUser) {
          console.log(`user is ` + currentUser);
        } else {
          let user = new User({
            name: profile.displayName,
            username: profile.displayName,
            googleId: profile.id
          });
          user.save().then(response => {
            console.log(`google user ${response}`);
          });
        }
      });
      console.log("passport was fired");
      console.log(profile);
    }
  )
);
