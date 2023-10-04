const express = require("express");
const passport = require("../config/passportConfig");
const { checkAuthenticated } = require("../Util/ServerUtil");

const router = express.Router();
require("dotenv").config();

router.use(express.urlencoded({ extended: false }));

// Use the Azure AD authentication middleware for the /login route
router.get(
  "/login" /*, passport.authenticate("azure_ad_oauth2")*/,
  (req, res) => {
    console.log("login page success");
    res.send("Login page");
  }
);

router.get(
  "/login/callback",
  //passport.authenticate("azure_ad_oauth2", { failureRedirect: "/fail" }),
  (req, res) => {
    console.log("callback page");
    res.redirect("/container/list-containers");
  }
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/test" /*, checkAuthenticated*/, (req, res) => {
  res.send("it is working");
});

router.post("/login/azure", (req, res) => {
  if (req.body.code) {
    const formData = new URLSearchParams();
    formData.append("grant_type", "authorization_code");
    formData.append("client_id", process.env.CLIENT_ID);
    formData.append("code", req.body.code);
    formData.append("redirect_uri", process.env.REDIRECT_URI);
    formData.append("scope", "openid email profile");

    fetch("https://login.microsoftonline.com/common/oauth2/v2.0/token", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        res.json({
          access_token: json.access_token,
        });
      });
  } else {
    res.statusCode = 400;
  }
});

module.exports = router;
