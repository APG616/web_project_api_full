const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        default: 'Jacques Cousteau',
        minlength: 2,
        maxlength: 30,
    },
    about: {
        type: String,
        default: 'Explorador',
        minlength: 2,
        maxlength: 30,
    },
    avatar: {
        type: String,
        default:'https://pictures.s3.yandex.net/resources/avatar_1604080799.jpg',
        validate: {
            validator: (v) => validator.isURL(v),
            message: 'URL inválida',
        },
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (v) => validator.isEmail(v),
            message: 'Email inválido',
        },
    },
    password: {
        type: String,
        required: true,
        select: false,
        minlength: 8,
    },
});


userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Credenciales incorrectas'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Credenciales incorrectas'));
          }
          return user;
        });
    });
};

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        { _id: this._id },
        process.env.JWT_SECRET || 'dev-secret',
        { expiresIn: '7d' }
    );
    return token;
};

module.exports = mongoose.model('user', userSchema);