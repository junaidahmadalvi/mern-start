const express = require("express");
const passport = require("../../lib/passport");
const { BASE_URL } = require("../../config/constant");
const router = express.Router();

// Route to authenticate with Google
router.get(
  `/auth/google`,
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Route for Google OAuth callback
router.get(
  `/auth/google/callback`,
  passport.authenticate("google", {
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
