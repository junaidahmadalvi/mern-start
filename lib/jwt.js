const jwt = require("jsonwebtoken");

const token = {
  createAccessToken: (userId) =>
    createToken(
      userId,
      process.env.JWT_ACCESS_SECRET,
      process.env.JWT_ACCESS_DURATION ?? "15s"
    ),

  createRefreshToken: (userId) =>
    createToken(
      userId,
      process.env.JWT_REFRESH_SECRET,
      process.env.JWT_REFRESH_DURATION ?? "5m"
    ),

  verifyAccessToken: (token) =>
    verifyToken(token, process.env.JWT_ACCESS_SECRET),

  verifyRefreshToken: (token) =>
    verifyToken(token, process.env.JWT_REFRESH_SECRET),
};

module.exports = { token };

const createToken = (userId, secret, expiresIn) => {
  return jwt.sign({ id: userId }, secret, {
    expiresIn,
  });
};

const verifyToken = async (token, secret) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, payload) => {
      if (err) return reject(err);

      resolve(payload);
    });
  });
};
