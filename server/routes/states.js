const express = require('express');
const router = express.Router();
const State = require('../db/models/State');

router.get('/', (req, res) => {
  return State
    .fetchAll()
    .then(state => {
      res.json(state);
    })
    .catch(err => {
      res.status(400).json({ message: err.message });
    });
})

module.exports = router;