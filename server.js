const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");
var bodyParser = require("body-parser");
const { BASE_URL } = require("./config/constant");
const passport = require("./lib/passport");
const { token } = require("./lib/jwt");
const { authenticatedMiddleware } = require("./middleware/auth.middleware");
const connect = require("./config/db");
connect();

// custom morgan's token fro timespan log
morgan.token("timespan", function (req, res) {
  return new Date().toISOString();
});

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false })); //to encode url to prevent hacking(passing threat query in query params)
app.use(
  morgan(
    "Log => " +
      ":remote-addr :method :url :status :res[content-length] - :response-time ms - :timespan"
  )
); //for genrating api logs

//------ api testing for default ------------
app.get(`${BASE_URL}`, (req, res) => {
  res.send("API is running...");
});

// ---- Routes -----
// const userRoutes = require("./resources/user/user.route");

// app.use(`${BASE_URL}/auth`, userRoutes);

// ----------------- Google Auth (passport-js) -------------------------------

app.use(passport.initialize());

// Route to authenticate with Google
app.get(
  `${BASE_URL}/auth/google`,
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Route for Google OAuth callback
app.get(
  `${BASE_URL}/auth/google/callback`,
  passport.authenticate("google", {
    failureRedirect: `${BASE_URL}/auth/login`,
  }),
  async (req, res) => {
    // Create a JWT token for the user
    const token = await token.createAccessToken();
    res.json({ token });
  }
);

// Protected route that requires JWT authentication
app.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ message: "You are authenticated!" });
  }
);

// globel middlware for all authenticated endpoints
// app.use(authenticatedMiddleware);

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
