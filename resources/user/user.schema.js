const yup = require("yup");

const userloginSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

const userRegisterSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
  gender: yup.string().required(),
});

module.exports = {
  userRegisterSchema,
  userloginSchema,
};
