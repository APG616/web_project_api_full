const router = require('express').Router();
const {
    getCards,
    createCard,
    deleteCard,
    likeCard,
    dislikeCard,
} = require('../controllers/cards');
const auth = require('../middleware/auth');

router.get('/', auth, getCards);
router.post('/', auth, createCard);
router.delete('/:id', auth, deleteCard);
router.put('/:cardId/likes', auth, likeCard);
router.put('/:cardId/dislikes', auth, dislikeCard);

module.exports = router;