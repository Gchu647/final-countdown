//These routes manages all packages('last messages') of a user
const express = require('express');
const router = express.Router();
const isAuthenticated = require('../../middleware/isAuthenticated');
const Package = require('../../db/models/Package');

router.route('/:id/packages')
  .get((req, res) => {
    res.send('packages smoke test!');
  })


module.exports = router;