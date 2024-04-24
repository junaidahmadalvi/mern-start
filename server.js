const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");
var bodyParser = require("body-parser");
const baseUrl = process.env.BASE_URL;
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
app.get(`${baseUrl}`, (req, res) => {
  res.send("API is running...");
});

// ---- Routes -----
const userRoutes = require("./resources/user/user.route");

app.use(`${baseUrl}/auth`, userRoutes);

// globel middlware for all authenticated endpoints
app.use(authenticatedMiddleware);

app.get(`${baseUrl}/authenticated`, (req, res) => {
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
