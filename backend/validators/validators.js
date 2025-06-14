const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const validateURL = (value, helpers) => {
  if (!value) return value;
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
};

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8)
  })
});

const validateUserCreation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30).default('New User'),
    about: Joi.string().min(2).max(30).default('Explorer'),
    avatar: Joi.string().custom(validateURL).allow('').optional()
  })
});

module.exports = {
  validateLogin,
  validateUserCreation
};