// This route is for getting user profile information
const express = require('express');
const router = express.Router();
const trigger = require('./trigger');
const User = require('../../db/models/User');

router.use('/user', trigger); // user's trigger

router.route('/user/:id')
  .get((req, res) => { // fetches user information by id
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
  .put((req, res) => {
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