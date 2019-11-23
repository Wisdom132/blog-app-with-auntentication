const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../account/user/model/User");
const Admin = require("../account/admin/model/Admin");

const config = require("../config/database");

// to authenticate the user using jwt strategy
module.exports = (userType, passport) => {
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  opts.secretOrKey = config.secret;
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      if (userType == "admin") {
        Admin.getAdminById(jwt_payload.data._id, (err, user) => {
          if (err) return done(err, false);
          if (user) return done(null, user);
          return done(null, false);
        });
      }
      if (userType == "users") {
        User.getUserById(jwt_payload.data._id, (err, user) => {
          if (err) return done(err, false);
          if (user) return done(null, user);
          return done(null, false);
        });
      }
    })
  );
};
