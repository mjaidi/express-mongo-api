const Authentication = require("./controllers/authentication");
const Pages = require("./controllers/pages");

const passportService = require("./services/passport");
const passport = require("passport");
const permit = require("./middleware/permissions");

const requireAuth = passport.authenticate("jwt", { session: false });
const requireSignIn = passport.authenticate("local", { session: false });

module.exports = function(app) {
  // a route
  app.post("/signup", Authentication.signup);
  app.post("/login", requireSignIn, Authentication.signin);
  app.get("/admin", requireAuth, permit("admin"), Pages.secretAdmin);
  app.get(
    "/secret",
    requireAuth,
    permit("admin", "client", "supplier"),
    Pages.secretAllLoggedIn
  );
};
