import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
        default: 'https://pictures.s3.yandex.net/resources/avatar_1604080799.jpg',
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

// Método para buscar usuario por credenciales
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

// Método para generar token
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        { _id: this._id },
        process.env.JWT_SECRET || 'dev-secret',
        { expiresIn: '7d' }
    );
    return token;
};

// Exporta el modelo y los métodos necesarios
export const User = mongoose.model('user', userSchema);

// Exporta métodos adicionales (opcional, si los necesitas directamente)
export const create = (userData) => User.create(userData);
export const findById = (id) => User.findById(id);
export const findUserByCredentials = (email, password) => 
    User.findUserByCredentials(email, password);