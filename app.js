const express = require('express');
const morgan = require('morgan');
const compression = require('compression');

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
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );
  res.header(
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'
  ); // If needed
  res.header('Access-Control-Allow-Credentials', true); // If needed

  next();
});
app.use(compression());
//Routes

app.use('/api/auth', authRoutes);
app.use('/api/favorite', favoriteRoutes);
app.use('/api/comments', commentsRoutes);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.url} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
