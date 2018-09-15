// This route is for getting user profile information
const express = require('express');
const router = express.Router();
const trigger = require('./trigger');
const recipients = require('./recipients');
const packages = require('./packages');
const isAuthenticated = require('../../middleware/isAuthenticated');
const User = require('../../db/models/User');

router.use('/user', trigger); // user's trigger
router.use('/user', recipients); // user's recipients
router.use('/user', packages); //user's packages

router.route('/user/:id')
  .get(isAuthenticated, (req, res) => { // fetches user information by id
    const userId = req.params.id;

    return new User()
      .where({ 'id': userId })
      .fetch()
      .then(user => {
        return res.json(user);
      })
      .catch(err => {
        return res.status(400).json({ message: err.message });
      });
  })
  .put(isAuthenticated, (req, res) => { // edits user information by id
    const userId = req.params.id;
    // Initailize edited info
    const userInput = {
      f_name: req.body.fName ? req.body.fName.trim() : null,
      l_name: req.body.lName ? req.body.lName.trim() : null,
    };

    // Edit using bookshelf
    return new User()
      .where({ 'id': userId })
      .save(userInput, { patch: true })
      .then(response => {
        return response.refresh();
      })
      .then(user => {
        return res.json(user);
      })
      .catch(err => {
        console.log(err.message);
        return res.status(400).json({ 'error': err.message });
      });
  })

module.exports = router;