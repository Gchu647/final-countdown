const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../db/models/User');
const saltedRounds = 12;

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
        email,
        password: hashedPassword,
        f_name: fName,
        l_name: lName,
        default_countdown: defaultCountDown,
      })
        .save()
        .then(result => {
          res.json(result.attributes.email);
        })
        .catch(err => {
          console.log('err.message', err.message);
          res.status(400).json({ message: 'email already exists' });
        });
    });
  });
});

router.get('/login', (req, res) => {
  res.send('auth.js smoke test!');
})

module.exports = router;