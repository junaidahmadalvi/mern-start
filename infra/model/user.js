const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  googleId: { type: String },
  email: { type: String, required: true, unique: true },
  // password: { type: String, required: true },
  // gender: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);
