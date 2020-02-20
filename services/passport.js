const passport = require("passport");
const User = require("../models/user");
const config = require("../config");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local");

// Create Local Strategy
const localOptions = { usernameField: "email" };
const localLogin = new LocalStrategy(localOptions, function(
  email,
  password,
  done
) {
  // verify username and password
  User.findOne({ email: email }, function(err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false);
    }
    // verify password - need to decrypt to verify
    user.comparePassword(password, function(err, isMatch) {
      if (err) {
        return done(err);
      }
      if (!isMatch) {
        return null, false;
      }
      return done(null, user);
    });
  });
});

// setup options for jwt strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  secretOrKey: config.secret
};

// create jwt strategy
// function called when user loggs in (payload is decoded jwt token)
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  // See if userID in payload exists in db
  const user = User.findById(payload.sub, function(err, user) {
    if (err) {
      return done(err, false);
    }
    if (user) {
      // if so call done with user
      return done(null, user);
    } else {
      // else call done without user
      return done(null, false);
    }
  });
});

// tell passport to use the strategy
passport.use(jwtLogin);
passport.use(localLogin);
