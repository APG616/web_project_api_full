const Card = require('../models/cards');
const ForbiddenError = require('../errors/forbidden-error');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');

module.exports.getCards = (req, res, next) => {
    Card.find({})
      .then((cards) => res.send(cards))
      .catch(next);
};

module.exports.createCard = (req, res, next) => {
    const { name, link } = req.body;
    const owner = req.user._id;

    Card.create({ name, link, owner })
        .then((card) => res.status(201).send(card))
        .catch((err) => {
            if (err.name === 'ValidationError') {
                next(new BadRequestError('Datos inválidos'));
            } else {
                next(err);
            }
        });
};

module.exports.deleteCard = (req, res, next) => {
    Card.findById(req.params.cardId)
        .then((card) => {
            if (!card) {
                throw new NotFoundError('Tarjeta no encontrada');
            }
            if (card.owner.toString() !== req.user._id) {
                throw new ForbiddenError('No tienes permiso para eliminar esta tarjeta');
            }
            return Card.findByIdAndRemove(req.params.cardId);
        })
        .then(deleteCard => res.send(deleteCard))
        .catch(next);
};

module.exports.likeCard = (req, res, next) => {
    Card.findByIdAndUpdate(
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
};

module.exports.dislikeCard = (req, res, next) => {
    Card.findByIdAndUpdate(
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
};