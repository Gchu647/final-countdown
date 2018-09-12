// This route is for getting user profile information
const express = require('express');
const router = express.Router();
const User = require('../db/models/User');

router.route('/:id')
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
      email: req.body.email ? req.body.email.trim() : null,
      f_name: req.body.fName ? req.body.fName.trim() : null,
      l_name: req.body.lName ? req.body.lName : null,
    };

    // Edit using bookshelf
    return new User()
      .where({ 'id': userId })
      .save(userInput, { patch: true })
      .then(response => {
        console.log('Edited user', response);
        return response.refresh();
      })
      .then(user => {
        return res.json(user);
      })
      .catch(err => {
        console.log(err.message);
        return res.json({ 'error': err.message });
      });
  })

module.exports = router;