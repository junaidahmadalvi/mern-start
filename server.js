const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");
var bodyParser = require("body-parser");
const { BASE_URL } = require("./config/constant");
const passport = require("./lib/passport");
const { authenticatedMiddleware } = require("./middleware/auth.middleware");
const connect = require("./config/db");

connect();

// custom morgan's token fro timespan log
morgan.token("timespan", function (req, res) {
  return new Date().toISOString();
});

//-------globel middlewares-----
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
//to encode url to prevent hacking(passing threat query in query params)
app.use(express.urlencoded({ extended: false }));
//for genrating api hitting logs
app.use(
  morgan(
    "Log => " +
      ":remote-addr :method :url :status :res[content-length] - :response-time ms - :timespan"
  )
);

//------ api testing for default ------------
app.get(`${BASE_URL}`, (req, res) => {
  res.send("API is running...");
});

// ---- Routes -----
const userRoutes = require("./resources/user/user.route");
const passportGoogleRoute = require("./resources/auth/passport.google.route");
const passportLinkedinRoute = require("./resources/auth/passport.linkedin.route");

// user auth routes (custom)
app.use(`${BASE_URL}/auth`, userRoutes);
// initiliaze passport-js
app.use(passport.initialize());
// ----------------- Google Auth (passport-js) -------------------------------
app.use(`${BASE_URL}/`, passportGoogleRoute);
// ----------------- Linkedin Auth (passport-js) -------------------------------
app.use(`${BASE_URL}/`, passportLinkedinRoute);

// globel middlware for all authenticated endpoints (custom implemented auth for jwt)
app.use(authenticatedMiddleware);

//test endpoints for authenticated routes
app.get(`${BASE_URL}/authenticated`, (req, res) => {
  res.send({
    success: "true",
    message: "Protected test API is running...",
    user: req.user,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
