const express = require("express");
const passport = require("../config/passportConfig");

const router = express.Router();
require("dotenv").config();

router.use(express.urlencoded({ extended: false }));

checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("login");
};

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/container/list-containers",
    failureRedirect: "login",
  })
);

router.get("/login", (req, res) => {
  res.send("Send a post request to /auth/login to authenticate");
});

module.exports = router;
