// lib/passport.js
const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const { BASE_URL } = require("../config/constant");
const User = require("../infra/model/user");
const jwt = require("jsonwebtoken");

// Configure the Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: `${BASE_URL}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("accessToken", accessToken);
      console.log("refreshToken", refreshToken);
      console.log("profile", profile);
      console.log("done", done);
      try {
        let user = await User.findOne({ googleId: profile.id }, "-password");
        if (!user) {
          user = new User({
            googleId: profile.id,
            email: profile?.emails[0]?.value,
            ...profile,
          });
          await user.save();
        }
        const token = jwt.sign(
          { userId: user.id },
          process.env.JWT_ACCESS_SECRET
        );

        return done(null, { user, token });
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.use(
  "jwt_strategy",
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    },
    async (payload, done) => {
      const user = await User.findById(payload.id, "-password");
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    }
  )
);

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (user, done) => {
  const dbUser = await User.findById(user.id);
  done(null, dbUser);
});

module.exports = passport;
