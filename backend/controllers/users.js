const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const BadRequestError = require('../errors/bad-request-error');
const ConflictError = require('../errors/conflict-error');
const UnauthorizedError = require('../errors/unauthorized-error');

module.exports.createUser = (req, res, next) => {
    const { name, about, avatar, email, password } = req.body;

    bcrypt.hash(password, 10)
        .then((hash) => User.create({ name, about, avatar, email, password: hash }))
        .then((user) => {
            res.status(201).send({
                _id: user._id,
                name: user.name,
                about: user.about,
                avatar: user.avatar,
                email: user.email,
            });
        })
        .catch((err) => {
            if (err.name === 'ValidationError') {
                next(new BadRequestError('Datos inválidos'));
            } else if (err.code === 11000) {
                next(new ConflictError('Correo electrónico ya registrado'));
            } else {
                next(err);
            }
        });
};

module.exports.login = (req, res, next) => {
    const { email, password } = req.body;

    User.findUserByCredentials(email, password)
        .then((user) => {
            const token = user.generateAuthToken();
            res.send({ token });
        })
        .catch((err) => {
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
