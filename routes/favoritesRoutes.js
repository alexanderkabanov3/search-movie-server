const express = require('express');
const router = express.Router();
const {protect} = require('../controllers/authControllers');
const {
  getFavorites,
  postFavorite,
  deleteFavorite,
} = require('../controllers/favoritesController');

router.route('/').get(protect, getFavorites).post(protect, postFavorite);

router.route('/:type/:mediaid').delete(protect, deleteFavorite);

module.exports = router;
