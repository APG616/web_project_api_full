import { Schema, model } from 'mongoose';
import validator from 'validator'; // Importa el módulo completo
const { isURL } = validator; 

const cardSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30,
    },
    link: {
        type: String,
        required: true,
        validate: {
            validator: (v) => isURL(v),
            message: 'URL inválida',
        },
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    likes: [{
        type: Boolean,
        default: false,
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Card = model('Card', cardSchema);

export const find = (query) => Card.find(query);
export const create = (data) => Card.create(data);
export const findById = (id) => Card.findById(id);
export const findByIdAndRemove = (id) => Card.findByIdAndRemove(id);
export const findByIdAndUpdate = (id, update, options) => Card.findByIdAndUpdate(id, update, options);


export default Card;