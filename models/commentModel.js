const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['movieoverview', 'seriesoverview', 'personoverview'],
  },
  typeId: {
    type: Number,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  user: {
    ref: 'users',
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

const Comment = mongoose.model('comments', commentSchema);

module.exports = Comment;
