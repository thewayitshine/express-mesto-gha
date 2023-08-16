const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./routes');

const app = express();
const { ERROR_404 } = require('./errors/errors');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://0.0.0.0:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '64dcf88b332c3ffc96ab5839',
  };
  next();
});

app.use('/', router);

app.use((req, res) => {
  res.status(ERROR_404).send({
    message: 'Данная cтраница не найдена',
  });
});

app.listen(PORT);
