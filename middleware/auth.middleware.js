const User = require("../infra/model/user.model");
const { token } = require("../lib/jwt");
const jwt = require("jsonwebtoken");
// module.exports = {
const authenticatedMiddleware = async (req, res, next) => {
  const bearer = req.headers.authorization;

  if (!bearer || !bearer.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Authentication token is missing." });
  }

  const accessToken = bearer?.split("Bearer ")[1]?.trim();
  try {
    const payload = await token.verifyAccessToken(accessToken);

    if (payload instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        message: jwt.JsonWebTokenError || "Authentication error occured.",
      });
    }

    const user = await User.findById(payload.id, "-password");

    if (!user) {
      return res.status(401).json({ message: "Authentication Failed." });
    }

    // check soft delete
    if (user?.deleted_at) {
      return res.status(401).json({ message: "Authentication Failed." });
    }

    // set user in req
    req.user = user;
    return next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  authenticatedMiddleware,
};
