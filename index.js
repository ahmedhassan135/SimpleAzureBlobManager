const express = require("express");
const cors = require("cors");
const passport = require("./config/passportConfig");
const session = require("express-session");

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const authRouter = require("./routes/authRoutes");
const containerRouter = require("./routes/containerRoutes");
const blobRouter = require("./routes/blobRoutes");

app.use("/auth", authRouter);
app.use("/container", containerRouter);
app.use("/blob", blobRouter);

app.get("/", (req, res) => {
  console.log();
  res.send("Server is running!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
