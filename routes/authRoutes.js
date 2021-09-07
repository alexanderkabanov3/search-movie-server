const express = require('express');
const router = express.Router();
const {signup, login} = require('../controllers/authControllers');

// http://localhost:8000/api/auth/login
router.route('/login').post(login);

// http://localhost:8000/api/auth/register
router.route('/signup').post(signup);

module.exports = router;
