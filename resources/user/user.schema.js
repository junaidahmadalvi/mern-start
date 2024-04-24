const yup = require("yup");

const userloginSchema = yup.object({
  googleId: yup.string().email(),
  email: yup.string().email().required(),
  password: yup.string().required(),
});

const userRegisterSchema = yup.object({
  googleId: yup.string().email(),
  email: yup.string().email().required(),
  // password: yup.string().required(),
  // gender: yup.string().required(),
});

module.exports = {
  userRegisterSchema,
  userloginSchema,
};
