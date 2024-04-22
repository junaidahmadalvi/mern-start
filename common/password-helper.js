const bcrypt = require("bcrypt");

const createHash = async (password) => {
  const salt = 12;

  return bcrypt.hash(password, salt);
};

const compareHash = async (encryptedStr, toBeComparedStr) => {
  return await bcrypt.compare(toBeComparedStr, encryptedStr);
};

module.exports = {
  createHash,
  compareHash,
};
