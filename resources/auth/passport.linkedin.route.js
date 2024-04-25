const express = require("express");
const passport = require("../../lib/passport");
const { BASE_URL } = require("../../config/constant");
const router = express.Router();

router.get(`/auth/linkedin`, passport.authenticate("linkedin"));

router.get(
  `/auth/linkedin/callback`,
  passport.authenticate("linkedin", {
    failureRedirect: `${BASE_URL}/auth/login`,
    session: false,
  }),
  async (req, res) => {
    const token = req?.user?.token;
    req.token = undefined;
    res.json({ token });
  }
);

module.exports = router;
