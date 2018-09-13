const express = require('express');
const router = express.Router();
const Recipient = require('../../db/models/Recipient');

router.route('/:id/recipients')
  .get((req, res) => {
    res.send('recipients smoke test!');
  })

module.exports = router;