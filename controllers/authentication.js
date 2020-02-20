const jwt = require("jwt-simple");
const User = require("../models/user");
const config = require("../config");

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret); // information we want to encode, secret string
}

exports.signup = function(req, res, next) {
  // get information from request object
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return res
      .status(422)
      .send({ error: "please send request with both email and password" });
  }
  // see if user with email exists return error
  User.findOne({ email: email }, function(err, existingUser) {
    if (err) {
      return next(err);
    }
    if (existingUser) {
      return res.status(422).send({ error: "email is in use" }); // unprocessable entity
    }
    // if new email - create and save user record
    const user = new User({ email: email, password: password });
    user.save(function(err) {
      if (err) {
        return next(err);
      }
    }); // pass callback as operation is async

    // respond to request
    res.json({ token: tokenForUser(user), user: user });
  });
};

exports.signin = function(req, res, next) {
  res.json({ token: tokenForUser(req.user), user: req.user });
};
