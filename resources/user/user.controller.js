const { yupErrorCheck } = require("../../common/validation-helper");
const { userRegisterSchema, userloginSchema } = require("./user.schema");
const userService = require("./user.service");

exports.registerUser = async (req, res) => {
  try {
    await userRegisterSchema.validate(req.body, {
      abortEarly: false,
    });
    const user = await userService.registerUser(req.body);

    res.status(201).json(user);
  } catch (error) {
    error.name === "ValidationError"
      ? res.status(400).json(yupErrorCheck(error))
      : res.status(500).json({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    await userloginSchema.validate(req.body, {
      abortEarly: false,
    });
    const token = await userService.loginUser(req.body);

    res.status(201).json(token);
  } catch (error) {
    error.name === "ValidationError"
      ? res.status(400).json(yupErrorCheck(error))
      : res.status(500).json({ message: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const user = await userService.getUsers();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Add other controller methods (login, update, delete, etc.)
