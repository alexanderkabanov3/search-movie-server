const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['movie', 'tv'],
  },
  mediaId: {
    type: Number,
    required: true,
  },
  user: {
    ref: 'users',
    type: mongoose.Schema.ObjectId,
    required: true,
  },
});

const Favorite = mongoose.model('favorites', favoriteSchema);

module.exports = Favorite;
