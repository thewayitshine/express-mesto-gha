const Card = require('../models/card');

const { ERROR_400, ERROR_404, ERROR_500 } = require('../errors/errors');

const cardCheck = (card, res) => {
  if (card) {
    return res.send(card);
  }
  return res.status(ERROR_404).send({ message: 'Запрашиваемая карточка не найдена' });
};

const getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(() => res.status(ERROR_500).send({ message: 'На сервере произошла ошибка' }));
};

const addNewCard = (req, res) => {
  const { name, link } = req.body;
  const { _id } = req.user;

  Card.create({ name, link, owner: _id })
    .then((newCard) => {
      res.send(newCard);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_400).send({
          message: 'Переданы некорректные данные при создании карточки',
        });
      }
      return res.status(ERROR_500).send({ message: 'На сервере произошла ошибка' });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.deleteOne({ _id: cardId })
    .then((card) => {
      if (card.deletedCount === 0) {
        return res.status(ERROR_404).send({ message: 'Запрашиваемая карточка не найдена' });
      }
      return res.send({ message: 'Карточка успешно удалена.' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_400).send({
          message: 'Некорректный _id',
        });
      }
      return res.status(ERROR_500).send({ message: 'На сервере произошла ошибка' });
    });
};

const putLike = (req, res) => {
  const { cardId } = req.params;
  const ownerId = req.user._id;

  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: ownerId } }, { new: true })
    .then((card) => {
      cardCheck(card, res);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_400).send({
          message: 'Переданы некорректные данные для постановки лайка',
        });
      }
      return res.status(ERROR_500).send({ message: 'На сервере произошла ошибка' });
    });
};

const deleteLike = (req, res) => {
  const { cardId } = req.params;
  const ownerId = req.user._id;

  Card.findByIdAndUpdate(cardId, { $pull: { likes: ownerId } }, { new: true })
    .then((card) => {
      cardCheck(card, res);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_400).send({
          message: 'Переданы некорректные данные для cнятия лайка',
        });
      }
      return res.status(ERROR_500).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports = {
  getAllCards,
  addNewCard,
  deleteCard,
  putLike,
  deleteLike,
};

