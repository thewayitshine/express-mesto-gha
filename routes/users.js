const usersRouter = require('express').Router();
const { celebrate } = require('celebrate');

const { getUserByIdValidation, editUserValidation, editAvatarValidation } = require('../middlewares/validation');

const {
  getAllUsers, getUser, createUser, updateUser, updateUserAvatar, getCurrentUser,
} = require('../controllers/users');

usersRouter.get('/me', getCurrentUser);
usersRouter.get('/', getAllUsers);
usersRouter.get('/:userId', celebrate(getUserByIdValidation), getUser);
usersRouter.post('/', createUser);
usersRouter.patch('/me', celebrate(editUserValidation), updateUser);
usersRouter.patch('/me/avatar', celebrate(editAvatarValidation), updateUserAvatar);

module.exports = usersRouter;
