const express = require('express');
const router = express.Router();
const Recipient = require('../../db/models/Recipient');

router.route('/:id/recipients')
  .get((req, res) => { // fetchs all recipients from a user
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
  .post((req, res) => {
    const userId = req.params.id;
    // Initailize edited info
    const recipientInput = {
      email: req.body.email ? req.body.email.trim() : null,
      f_name: req.body.fName ? req.body.fName.trim() : null,
      l_name: req.body.lName ? req.body.lName.trim() : null,
      phone_num: req.body.phoneNum ? req.body.phoneNum.trim() : null,
      sender_id: Number(userId),
      relationship_id: Number(req.body.relationshipId),

    };

    // Save using bookshelf
    return new Recipient()
      .save(recipientInput)
      .then(response => {
        return response.refresh();
      })
      .then(recipient => {
        return res.json(recipient);
      })
      .catch(err => {
        console.log(err.message);
        return res.status(400).json({ 'error': err.message });
      });
  })

module.exports = router;