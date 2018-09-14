//These routes manages all packages('last messages') of a user
const express = require('express');
const router = express.Router();
const isAuthenticated = require('../../middleware/isAuthenticated');
const Package = require('../../db/models/Package');
const EncryptedFile = require('../../db/models/EncryptedFile');

router.route('/:id/packages')
  .get((req, res) => {
    const userId = req.params.id;

    return new Package()
      .query(qb => {
        qb.where({ 'package_maker_id': userId })
          .andWhere({'deleted_at': null});
      })
      .fetchAll({ 'withRelated': ['file'] })
      .then(packages => {
        return res.json(packages);
      })
      .catch(err => {
        return res.status(400).json({ message: err.message });
      });
  })
  .post((req, res) => {
    // req.body is going to come in with a recipient_id and a message
    // we can make our own name for messages
    const userId = req.params.id;
    const recipientId = req.body.recipientId;

    const packageInput = {
      'package_maker_id': userId,
      'recipient_id': recipientId,
    };

    return new Package()
    .save(packageInput)
    .then(response => {
      return response.refresh();
    })
    .then(package => {
      return res.json(package);
    })
    .catch(err => {
      console.log(err.message);
      return res.status(400).json({ 'error': err.message });
    });
  })


module.exports = router;