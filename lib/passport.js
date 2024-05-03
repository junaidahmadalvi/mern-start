const passport = require("passport");
const jwt = require("jsonwebtoken");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
const { BASE_URL } = require("../config/constant");
const User = require("../infra/model/user.model");

// Configure the Google oauth2 strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${BASE_URL}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
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
          process.env.JWT_ACCESS_SECRET,
          { expiresIn: "1d" }
        );

        return done(null, { user, token });
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Configure the Linkdin oauth2 strategy
passport.use(
  new LinkedInStrategy(
    {
      clientID: process.env.LINKDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: `${BASE_URL}/auth/linkedin/callback`,
      scope: ["r_emailaddress", "r_liteprofile"],
      // state: true,   // uncoment this to use express-sessions
    },
    function (accessToken, refreshToken, profile, done) {
      process.nextTick(async () => {
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
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: "1d" }
          );

          return done(null, { user, token });
        } catch (err) {
          return done(err);
        }
      });
    }
  )
);

// Configure the passport jwt strategy
passport.use(
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
