const mongoose = require("mongoose");
const { makeSchema } = require("./base.model");

const userSchema = makeSchema({
  googleId: { type: String },
  email: { type: String, required: true, unique: true },
  // password: { type: String, required: true },
  // gender: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);
