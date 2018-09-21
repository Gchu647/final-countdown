// This route is reponsible for registration, login, and logout:
const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const router = express.Router();

const User = require('../db/models/User');
const Group = require('../db/models/Group');
const Package = require('../db/models/Package');
const EncryptedFile = require('../db/models/EncryptedFile');

const saltedRounds = 12;

// Register new user:
router.post('/register', (req, res) => {
  // Extract relevant data from incoming request:
  let { email, password, fName, lName } = req.body;
  let newUser = {};
  let newFileId;
  let newPackageId;

  bcrypt.genSalt(saltedRounds, (err, salt) => {
    if (err) {
      return res.status(500);
    }

    bcrypt.hash(password, salt, (err, hashedPassword) => {
      if (err) {
        return res.status(500);
      }
      // Registration requires email(unique) and password:
      return (
        new User({
          email: email ? email.trim() : null,
          password: hashedPassword,
          f_name: fName ? fName.trim() : null,
          l_name: lName ? lName.trim() : null,
          default_timer: 604800 // 7 days
        })
          .save()
          .then(result => {
            newUser = result.attributes;
          })
          // Create FAMILY group with related package and encrypted file:
          .then(() => {
            return new EncryptedFile()
              .save({
                name: '',
                aws_url: ''
              })
              .then(response => {
                newFileId = response.attributes.id;
                return response.refresh();
              })
              .then(file => {
                return new Package().save({
                  package_maker_id: newUser.id,
                  file_id: file.attributes.id
                });
              })
              .then(response => {
                newPackageId = response.attributes.id;
                return response.refresh();
              })
              .then(() => {
                return new EncryptedFile({ id: newFileId }).save(
                  { package_id: newPackageId },
                  { patch: true }
                );
              })
              .then(() => {
                return new Group().save({
                  relationship_id: 1, // FAMILY
                  package_id: newPackageId,
                  owner_id: newUser.id
                });
              })
              .then(response => {
                return response.refresh();
              });
          })
          // Create FRIENDS group with related package and encrypted file:
          .then(() => {
            return new EncryptedFile()
              .save({
                name: '',
                aws_url: ''
              })
              .then(response => {
                newFileId = response.attributes.id;
                return response.refresh();
              })
              .then(file => {
                return new Package().save({
                  package_maker_id: newUser.id,
                  file_id: file.attributes.id
                });
              })
              .then(response => {
                newPackageId = response.attributes.id;
                return response.refresh();
              })
              .then(() => {
                return new EncryptedFile({ id: newFileId }).save(
                  { package_id: newPackageId },
                  { patch: true }
                );
              })
              .then(() => {
                return new Group().save({
                  relationship_id: 2, // FRIENDS
                  package_id: newPackageId,
                  owner_id: newUser.id
                });
              })
              .then(response => {
                return response.refresh();
              });
          })
          // Create HATERS group with related package and encrypted file:
          .then(() => {
            return new EncryptedFile()
              .save({
                name: '',
                aws_url: ''
              })
              .then(response => {
                newFileId = response.attributes.id;
                return response.refresh();
              })
              .then(file => {
                return new Package().save({
                  package_maker_id: newUser.id,
                  file_id: file.attributes.id
                });
              })
              .then(response => {
                newPackageId = response.attributes.id;
                return response.refresh();
              })
              .then(() => {
                return new EncryptedFile({ id: newFileId }).save(
                  { package_id: newPackageId },
                  { patch: true }
                );
              })
              .then(() => {
                return new Group().save({
                  relationship_id: 3, // HATER
                  package_id: newPackageId,
                  owner_id: newUser.id
                });
              })
              .then(response => {
                return response.refresh();
              });
          })
          .then(() => {
            return res.json(newUser);
          })
          .catch(err => {
            res.status(400).json({ message: err.message });
          })
      );
    });
  });
});

// Log in with a username (i.e., email address) and password:
router.post('/login', (req, res, next) => {
  // If user is logged in, then instruct the user to log out first:
  if (req.user) {
    res.status(400).json({ message: `${req.user.email} is already logged in` });
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

// Log out user:
router.get('/logout', (req, res) => {
  req.logout();
  res.json({ success: true });
});

module.exports = router;
