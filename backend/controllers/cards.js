import { find, create, findById, findByIdAndRemove, findByIdAndUpdate } from '../models/cards.js';
import ForbiddenError from '../errors/forbidden-error.js';
import NotFoundError from '../errors/not-found-error.js';
import BadRequestError from '../errors/bad-request-error.js';

export function getCards(req, res, next) {
    find({})
      .then((cards) => res.send(cards))
      .catch(next);
}

export function createCard(req, res, next) {
    const { name, link } = req.body;
    const owner = req.user._id;

    create({ name, link, owner })
        .then((card) => res.status(201).send(card))
        .catch((err) => {
            if (err.name === 'ValidationError') {
                next(new BadRequestError('Datos inválidos'));
            } else {
                next(err);
            }
        });
}

export function deleteCard(req, res, next) {
    findById(req.params.cardId)
        .then((card) => {
            if (!card) {
                throw new NotFoundError('Tarjeta no encontrada');
            }
            if (card.owner.toString() !== req.user._id) {
                throw new ForbiddenError('No tienes permiso para eliminar esta tarjeta');
            }
            return findByIdAndRemove(req.params.cardId);
        })
        .then(deleteCard => res.send(deleteCard))
        .catch(next);
}

export function likeCard(req, res, next) {
    findByIdAndUpdate(
        req.params.cardId,
        { 
            likes: true,
        },
        { new: true }
    )
     .then(card => {
        if (!card) {
            throw new NotFoundError('Tarjeta no encontrada');
        }
        res.send(card);
     })
     .catch(next);
}

export function dislikeCard(req, res, next) {
    findByIdAndUpdate(
        req.params.cardId,
        { likes: false },
        { new: true }
    )
     .then(card => {
        if (!card) {
            throw new NotFoundError('Tarjeta no encontrada');
        }
        res.send(card);
     })
     .catch(next);
}