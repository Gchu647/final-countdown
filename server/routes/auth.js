// This route is reponsible for registration, login, and logout
const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../db/models/User');
const saltedRounds = 12;

// Register new user
router.post('/register', (req, res) => {
  console.log('request to register', req.body);
  // taking out info from incoming request
  let { email, password, fName, lName } = req.body;
  // setting a default count down timer
  const defaultCountDown = 14;

  bcrypt.genSalt(saltedRounds, (err, salt) => {
    if (err) {
      return res.status(500);
    }

    bcrypt.hash(password, salt, (err, hashedPassword) => {
      if (err) {
        return res.status(500);
      }
      // Needs email(unique) and password to register:
      return new User({
        email: email ? email.trim() : null,
        password: hashedPassword,
        f_name: fName ? fName.trim() : null,
        l_name: lName ? lName.trim() : null,
        default_countdown: Number(defaultCountDown),
      })
        .save()
        .then(result => {
          res.json(result.attributes.email);
        })
        .catch(err => {
          res.status(400).json({ message: err.message });
        });
    });
  });
});

// Login in with a username(the email) and password
router.post('/login', (req, res, next) => {
  // If user is logged in, then instruct the user to log out first:
  if (req.user) {
    res
      .status(400)
      .json({ message: `${req.user.email} is already logged in` });
  } else {
    passport.authenticate('local', (err, user) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      } else {
        req.login(user, err => {
          if (err) {
            return next(err);
          } else {
            res.json({
              email: user.email,
              id: req.user.id
            });
          }
        });
      }
    })(req, res, next);
  }
});

// Logout user
router.get('/logout', (req, res) => {
  req.logout();
  res.json({ success: true });
});

module.exports = router;