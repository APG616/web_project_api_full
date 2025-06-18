import express from 'express';
import { getCards, createCard, deleteCard, likeCard, dislikeCard } from '../controllers/cards.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getCards);
router.post('/', auth, createCard);
router.delete('/:id', auth, deleteCard);
router.put('/:cardId/likes', auth, likeCard);
router.put('/:cardId/dislikes', auth, dislikeCard);

export default router;