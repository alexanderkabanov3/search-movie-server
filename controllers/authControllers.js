const jwt = require('jsonwebtoken');
const {promisify} = require('util');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = (id) => {
  return jwt.sign({id: id}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

module.exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signToken(newUser._id);

  newUser.password = undefined;

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
  });

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

module.exports.login = catchAsync(async (req, res, next) => {
  const {name, password} = req.body;

  if (!name || !password) {
    return next(new AppError('please provide email and password', 400));
  }

  const user = await User.findOne({name: name}).select('+password');
  let correct;
  if (user !== null) {
    correct = await user.correctPassword(password, user.password);
  }

  if (!user || !correct) {
    return next(new AppError('incorrect name or password', 401));
  }

  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
  });
});

module.exports.protect = catchAsync(async (req, res, next) => {
  // 1) getting token and check if it's there
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('you are not logged in', 401));
  }

  // 2) verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) check if user still exists
  const freshUser = await User.findOne({_id: decoded.id});

  if (!freshUser) {
    return next(new AppError('token dose no longer exist '));
  }
  // 4) check if user changed password after the token was issued
  if (freshUser.changedPasswordAfter(decoded.id)) {
    return next(
      new AppError('user recently changed the password, login again', 401)
    );
  }

  req.user = freshUser;

  next();
});
