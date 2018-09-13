const express = require('express');
const router = express.Router();
const Recipient = require('../../db/models/Recipient');

router.route('/:id/recipients')
  .get((req, res) => {
    const userId = req.params.id;

    return new Recipient()
      .where({ 'sender_id': userId })
      .fetchAll()
      .then(recipients => {
        return res.json(recipients);
      })
      .catch(err => {
        return res.status(400).json({ message: err.message });
      });
  })

module.exports = router;