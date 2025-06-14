const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const BadRequestError = require('../errors/bad-request-error');

const ConflictError = require('../errors/conflict-error');
const UnauthorizedError = require('../errors/unauthorized-error');
const NotFoundError = require('../errors/not-found-error');
const { celebrate, Joi } = require('celebrate');

const validateUserCreation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30).default('Jacques Cousteau'),
    about: Joi.string().min(2).max(30).default('Explorer'),
    avatar: Joi.string().uri().optional()
  })
});

module.exports.createUser = (req, res, next) => {
   const { email, password, name = 'New User', about = 'Explorer', avatar } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({ 
      name, 
      about, 
      avatar: avatar || undefined, // Send undefined if empty
      email, 
      password: hash 
    }))
    .then((user) => {
      res.status(201).send({
        _id: user._id,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map((e) => ({
          field: e.path,
          message: e.message
        }));
        next(new BadRequestError('Validation failed', errors));
      } else if (err.code === 11000) {
        next(new ConflictError('Email already exists'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  
  User.findUserByCredentials(email, password)
    .then((user) => {
      // Add logging to verify user found
      console.log('User found:', user.email); 
      const token = jwt.sign(
        { _id: user._id },
        process.env.JWT_SECRET || 'dev-secret',
        { expiresIn: '7d' }
      );
      res.send({ token });
    })
    .catch((err) => {
      console.error('Login error:', err); // Add detailed logging
      next(new UnauthorizedError('Correo electrónico o contraseña incorrectos'));
    });
};

module.exports.getCurrentUser = (req, res, next) => {
    User.findById(req.user._id)
        .then((user) => {
            if (!user) {
                throw new NotFoundError('Usuario no encontrado');
            }
            res.send(user);
        })
        .catch(next);
};
