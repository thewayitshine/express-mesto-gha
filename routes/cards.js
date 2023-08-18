const cardsRouter = require('express').Router();
const { celebrate } = require('celebrate');

const { createCardValidation, deleteCardValidation, likeCardValidation } = require('../middlewares/validation');
const cardOwnerCheck = require('../middlewares/cardOwnerCheck');

const {
  getAllCards, addNewCard, deleteCard, putLike, deleteLike,
} = require('../controllers/cards');

cardsRouter.get('/', getAllCards);
cardsRouter.post('/', celebrate(createCardValidation), addNewCard);
cardsRouter.delete('/:cardId', celebrate(deleteCardValidation), cardOwnerCheck, deleteCard);
cardsRouter.put('/:cardId/likes', celebrate(likeCardValidation), putLike);
cardsRouter.delete('/:cardId/likes', celebrate(likeCardValidation), deleteLike);

module.exports = cardsRouter;
