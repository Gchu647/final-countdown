// This route is reponsible for registration, login, and logout
const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../db/models/User');
const Package = require('../db/models/Package');
const Group = require('../db/models/Group');
const saltedRounds = 12;

// Register new user
router.post('/register', (req, res) => {
  console.log('request to register', req.body);
  // taking out info from incoming request
  let { email, password, fName, lName } = req.body;
  // setting a default count down timer
  const defaultCountDown = 14;
  let newUser = {};

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
        default_timer: 604800, // 7 days
      })
        .save()
        .then(result => {
          newUser = result.attributes;
          console.log('newUser', newUser);

          // return res.json(result.attributes.email)
        })
        // Making Group(family) with a package
        .then(() => {
          return new Package()
            .save({
              'package_maker_id': newUser.id,
            })
            .then(response => {
              return response.refresh();
            })
            .then(package => {
              console.log('package.attributes.id', package.attributes.id);
              return new Group()
                .save({
                  'relationship_id': 1, // family
                  'package_id': package.attributes.id,
                  'owner_id': newUser.id,
                });
            })
        })
        // Making Group(friends) with a package
        .then(() => {
          return new Package()
            .save({
              'package_maker_id': newUser.id,
            })
            .then(response => {
              return response.refresh();
            })
            .then(package => {
              console.log('package.attributes.id', package.attributes.id);
              return new Group()
                .save({
                  'relationship_id': 2, // friends
                  'package_id': package.attributes.id,
                  'owner_id': newUser.id,
                });
          })          
        })
        // Making Group(haters) with a package
        .then(() => {
          return new Package()
            .save({
              'package_maker_id': newUser.id,
            })
            .then(response => {
              return response.refresh();
            })
            .then(package => {
              console.log('package.attributes.id', package.attributes.id);
              return new Group()
                .save({
                  'relationship_id': 3, // haters
                  'package_id': package.attributes.id,
                  'owner_id': newUser.id,
                });
          })          
        })
        .then(() => {
          return res.json(newUser);
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
  console.log('login in server!', req.body);
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
  console.log('logging out in server!');
  req.logout();
  res.json({ success: true });
});

module.exports = router;