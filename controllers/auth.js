const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const keys = require('../config/keys');

module.exports.login = async function (req, res) {
  const candidate = await User.findOne({name: req.body.name});

  if (candidate) {
    // check the password
    const passwordResult = bcrypt.compareSync(
      req.body.password,
      candidate.password
    );

    if (passwordResult) {
      // token generation
      const token = jwt.sign(
        {
          name: candidate.name,
          id: candidate._id,
        },
        keys.jwt,
        {
          expiresIn: 60 * 60,
        }
      );

      res.status(200).json({
        token: `Bearer ${token}`,
      });
    } else {
      // passwords don't match
      res.status(401).json({
        message: 'passwords do not match',
      });
    }
  } else {
    // candidate is not exist
    res.status(404).json({
      message: 'user is not found',
    });
  }
};

module.exports.register = async function (req, res) {
  const candidateEmail = await User.findOne({email: req.body.email});
  const candidateName = await User.findOne({name: req.body.name});

  if (candidateEmail) {
    res.status(409).json({
      message: 'this email is already exist',
    });
  } else if (candidateName) {
    res.status(409).json({
      message: 'this name is already exist',
    });
  } else {
    // we have to create user
    const salt = bcrypt.genSaltSync(10);
    const password = req.body.password;

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(password, salt),
    });

    try {
      await user.save();
      res.status(201).json(user);
    } catch (err) {
      // process the error
      res.status(401).json({
        message: 'something went wrong',
      });
    }
  }
};
