const Joi = require('joi');

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required()
});

const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

const validateLogin = (data) => {
  return loginSchema.validate(data);
};

const validateRefreshToken = (data) => {
  return refreshTokenSchema.validate(data);
};

const validateSignup = (data) => {
  return signupSchema.validate(data);
};

module.exports = {
  validateLogin,
  validateRefreshToken,
  validateSignup
}; 