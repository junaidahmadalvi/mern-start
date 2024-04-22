const express = require("express");
const { registerUser, getUsers, loginUser } = require("./user.controller");
const router = express.Router();

router.get("/", getUsers);

router.post("/register", registerUser);

router.post("/login", loginUser);

module.exports = router;
