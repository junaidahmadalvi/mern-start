const express = require("express");
const passport = require("../../lib/passport");
const { BASE_URL } = require("../../config/constant");
const router = express.Router();

router.get(
  `${BASE_URL}/protected`,
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ message: "You are authenticated!", user: req?.user });
  }
);

module.exports = router;
