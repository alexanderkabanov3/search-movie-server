const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Comment = require('../models/commentModel');

module.exports.getAllComments = catchAsync(async (req, res, next) => {
  const comments = await Comment.find({
    type: req.params.type,
    typeId: req.params.typeId,
  });

  res.status(200).json({
    status: 'success',
    data: comments,
  });
});

module.exports.postComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.create({
    type: req.params.type,
    typeId: req.params.typeId,
    text: req.body.text,
    user: req.user.id,
  });

  res.status(200).json({
    status: 'success',
    data: comment,
  });
});

module.exports.deleteComment = catchAsync(async (req, res, next) => {
  const candidate = await Comment.find({
    type: req.params.type,
    typeId: req.params.typeId,
    _id: req.params.commentId,
    user: req.user._id,
  });

  if (candidate.length > 0) {
    await Comment.findByIdAndDelete(candidate[0]._id);
  } else {
    return next(new AppError('item was not found', 400));
  }

  res.status(200).json({
    status: 'success',
    message: 'comment was deleted',
  });
});

module.exports.getAllUserComments = catchAsync(async (req, res, next) => {
  const userComments = await Comment.find({
    type: req.params.type,
    typeId: req.params.typeId,
    user: req.user._id,
  });

  res.status(200).json({
    status: 'success',
    data: userComments,
  });
});
