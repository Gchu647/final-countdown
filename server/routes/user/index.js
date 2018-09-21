// This route is for getting user profile information
const express = require('express');
const router = express.Router();
const trigger = require('./trigger');
const groups = require('./groups');
const recipients = require('./recipients');
const packages = require('./packages');
const isAuthenticated = require('../../middleware/isAuthenticated');
const User = require('../../db/models/User');

router.use('/user', groups);
router.use('/user', trigger);
router.use('/user', recipients);
router.use('/user', packages);

router.route('/user/:id')
  .get(isAuthenticated, (req, res) => {
    // fetches user information by id
    const userId = req.params.id;

    return new User()
      .where({ id: userId })
      .fetch()
      .then(user => {
        const userResponse = {
          id: user.attributes.id,
          email: user.attributes.email,
          firstName: user.attributes.f_name, //f_name
          lastName: user.attributes.l_name, //l_name
          dateOfBirth: user.attributes.dob, //dob
          countryId: user.attributes.country, //country
          stateId: user.attributes.state, //state
          city: user.attributes.city,
          phoneNumber: user.attributes.phone_num //phone_num
        };

        return res.json(userResponse);
      })
      .catch(err => {
        return res.status(400).json({ message: err.message });
      });
  })
  .put(isAuthenticated, (req, res) => {
    // edits user information by id
    const userId = req.params.id;
    // Initailize edited info
    const userInput = {
      f_name: req.body.firstName ? req.body.firstName.trim() : null,
      l_name: req.body.lastName ? req.body.lastName.trim() : null,
      dob: req.body.dateOfBirth ? req.body.dateOfBirth.trim() : null,
      country: req.body.countryId, // adding Number() breaks it
      state: req.body.stateId, // adding Number() breaks it
      city: req.body.city ? req.body.city.trim() : null,
      phone_num: req.body.phoneNumber ? req.body.phoneNumber.trim() : null
    };

    // Edit using bookshelf
    return new User()
      .where({ id: userId })
      .save(userInput, { patch: true })
      .then(response => {
        return response.refresh();
      })
      .then(user => {
        return res.json(user);
      })
      .catch(err => {
        console.log(err.message);
        return res.status(400).json({ error: err.message });
      });
  });

module.exports = router;
