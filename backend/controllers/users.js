import { create, findUserByCredentials, findById } from '../models/user.js';
import { hash as _hash } from 'bcryptjs';
import jwt from 'jsonwebtoken';
const { sign } = jwt;
import BadRequestError from '../errors/bad-request-error.js';
import ConflictError from '../errors/conflict-error.js';
import UnauthorizedError from '../errors/unauthorized-error.js';
import NotFoundError from '../errors/not-found-error.js';
import { celebrate, Joi } from 'celebrate';

const validateUserCreation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30).default('Jacques Cousteau'),
    about: Joi.string().min(2).max(30).default('Explorer'),
    avatar: Joi.string().uri().optional()
  })
});

export function createUser(req, res, next) {
  const { email, password, name = 'New User', about = 'Explorer', avatar } = req.body;

  _hash(password, 10)
    .then((hash) => create({ 
      name, 
      about, 
      avatar: avatar || undefined,
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
}


export function login(req, res, next) {
  const { email, password } = req.body;
  
  findUserByCredentials(email, password)
    .then((user) => {
      console.log('User found:', user.email); 
      const token = sign(
        { _id: user._id },
        process.env.JWT_SECRET || 'dev-secret',
        { expiresIn: '7d' }
      );
      res.send({ token });
    })
    .catch((err) => {
      console.error('Login error:', err);
      next(new UnauthorizedError('Correo electrónico o contraseña incorrectos'));
    });
}

export function getCurrentUser(req, res, next) {
    findById(req.user._id)
        .then((user) => {
            if (!user) {
                throw new NotFoundError('Usuario no encontrado');
            }
            res.send(user);
        })
        .catch(next);
}

