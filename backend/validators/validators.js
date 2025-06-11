const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const validateURL = (value, helper) => {
    if (validator.isURL(value)) {
        return value;
    }
    return helpers.error('string.uri');
};

module.exports.validateLogin = celebrate({
    body: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required().min(8),
    }),
});

module.exports.validateUserCreation = celebrate({
    body: Joi.object().keys({
        name: Joi.string().required().min(2).max(30),
        about: Joi.string().required().min(2).max(30),
        avatar: Joi.string().custom(validateURL, 'URL validation'),
        email: Joi.string().required().email(),
        password: Joi.string().required().min(8),
    }),
});