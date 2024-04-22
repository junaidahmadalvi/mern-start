const { createHash, compareHash } = require("../../common/password-helper");
const User = require("../../infra/model/user");
const { token } = require("../../lib/jwt");

const registerUser = async (body) => {
  const isEmailExist = await User.findOne({ email: body.email }, "-password");
  if (isEmailExist) return { success: false, message: "Email already exist" };

  const hashedPassword = await createHash(body.password);

  const user = new User({ ...body, password: hashedPassword });
  await user.save();
  return user;
};

const loginUser = async (body) => {
  const user = await User.findOne({ email: body.email });

  if (!user) return { success: false, message: "Email or password invalid" };

  const isMatch = await compareHash(user.password, body.password);
  if (!isMatch) return { success: false, message: "Email or password invalid" };

  const accessToken = await token.createAccessToken(user._id);
  const refreshToken = await token.createRefreshToken(user._id);

  return { accessToken, refreshToken };
};

const getUsers = async () => {
  const users = await User.find();
  res.json({ list: users });
};

module.exports = { registerUser, loginUser, getUsers };
