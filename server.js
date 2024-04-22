const express = require("express");
const app = express();
require("dotenv").config();
const baseUrl = process.env.BASE_URL;

const connect = require("./config/db");
connect();

app.use(express.json());

// Routes
const userRoutes = require("./resources/user/user.route");

app.use(`${baseUrl}/user`, userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
