const express = require('express');
const router = express.Router();
const {protect} = require('../controllers/authControllers');
const {
  getAllComments,
  postComment,
  deleteComment,
  getAllUserComments,
} = require('../controllers/commentsController');

router.route('/:type/:typeId').get(getAllComments).post(protect, postComment);

router.route('/:type/:typeId/:commentId').delete(protect, deleteComment);
router.route('/:type/:typeId/user').get(protect, getAllUserComments);

module.exports = router;
