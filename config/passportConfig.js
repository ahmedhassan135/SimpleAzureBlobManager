const passport = require("passport");
const OIDCStrategy = require("passport-azure-ad-oauth2").Strategy;

passport.serializeUser((userObj, done) => {
  done(null, userObj);
});

passport.deserializeUser((userObj, done) => {
  done(null, userObj);
});

module.exports = passport;
