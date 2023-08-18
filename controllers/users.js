const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../utils/constants');

const User = require('../models/user');

const NotFound = require('../errors/notFoundError');
const Unauthorized = require('../errors/unauthorizedError');
const Conflict = require('../errors/conflictError');

const userCheck = (user, res) => {
  if (user) {
    return res.send(user);
  }
  throw new NotFound('Запрашиваемая карточка не найдена');
};

const createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        email, password: hash, name, about, avatar,
      })
        .then((newUser) => res.status(201).send({
          email: newUser.email,
          name: newUser.name,
          about: newUser.about,
          avatar: newUser.avatar,
        }))
        .catch((err) => {
          if (err.code === 11000) {
            next(new Conflict('Пользователь с таким email уже существует!'));
          } else {
            next(err);
          }
        });
    })
    .catch(next);
};

const getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getUser = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => userCheck(user, res))
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  const ownerId = req.user._id;

  User.findByIdAndUpdate(ownerId, { name, about }, { new: true, runValidators: true })
    .then((user) => userCheck(user, res))
    .catch(next);
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const ownerId = req.user._id;

  User.findByIdAndUpdate(ownerId, { avatar }, { new: true, runValidators: true })
    .then((user) => userCheck(user, res))
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new Unauthorized('Ошибка! Неверный email или пароль.');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new Unauthorized('Ошибка! Неверный email или пароль.');
          }

          const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });

          return res.send({ token });
        });
    })
    .catch(next);
};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  updateUserAvatar,
  getCurrentUser,
  login,
};
