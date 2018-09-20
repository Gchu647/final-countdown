const express = require('express');
const router = express.Router();
const Country = require('../db/models/Country');

router.get('/', (req, res) => {
  return Country
    .fetchAll()
    .then(countries => {
      res.json(countries);
    })
    .catch(err => {
      res.status(400).json({ message: err.message });
    });
})

module.exports = router;