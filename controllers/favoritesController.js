const Favorite = require('../models/favoriteModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

module.exports.getFavorites = catchAsync(async (req, res, next) => {
  const favorites = await Favorite.find({user: req.user._id});

  res.status(200).json({
    status: 'success',
    data: favorites,
  });
});

module.exports.postFavorite = catchAsync(async (req, res, next) => {
  const potential = await Favorite.find({
    type: req.body.type,
    mediaId: req.body.mediaId,
    user: req.user.id,
  });

  if (potential.length > 0) {
    return next(new AppError('item is already exist', 400));
  }

  const favorite = await Favorite.create({
    type: req.body.type,
    mediaId: req.body.mediaId,
    user: req.user.id,
  });

  res.status(201).json({
    status: 'success',
    data: favorite,
  });
});

module.exports.deleteFavorite = catchAsync(async (req, res, next) => {
  const candidate = await Favorite.find({
    type: req.params.type,
    mediaId: req.params.mediaid,
    user: req.user._id,
  });

  if (candidate.length > 0) {
    await Favorite.findByIdAndDelete(candidate[0]._id);
  } else {
    return next(new AppError('item was not found', 400));
  }

  res.status(200).json({
    status: 'success',
    message: 'item was deleted',
  });
});
