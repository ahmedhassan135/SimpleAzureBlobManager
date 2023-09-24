const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

authUser = (user, password, done) => {
  //This is a placeholder method to simulate a DB call to check if the user credentials are valid
  //It will always return true to simulate successful login

  let authenticated_user = { id: 123, name: "Testuser" };

  return done(null, authenticated_user);
};

passport.use(new LocalStrategy(authUser));

passport.serializeUser((userObj, done) => {
  done(null, userObj);
});

passport.deserializeUser((userObj, done) => {
  done(null, userObj);
});

module.exports = passport;
