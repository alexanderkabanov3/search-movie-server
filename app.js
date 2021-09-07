const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const authRoutes = require('./routes/authRoutes');
const favoriteRoutes = require('./routes/favoritesRoutes');
const commentsRoutes = require('./routes/commentsRoutes');

const app = express();

// Middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

//Routes

app.use('/api/auth', authRoutes);
app.use('/api/favorite', favoriteRoutes);
app.use('/api/comments', commentsRoutes);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.url} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
