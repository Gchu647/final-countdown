//These routes manages all packages('last messages') of a user
const express = require('express');
const router = express.Router();
const isAuthenticated = require('../../middleware/isAuthenticated');
const Package = require('../../db/models/Package');
const EncryptedFile = require('../../db/models/EncryptedFile');

router.route('/:id/packages')
  .get((req, res) => { // Fetching all the packages of a user
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
    // req.body is going to come in with a recipientId and a message
    const userId = req.params.id;
    const recipientId = req.body.recipientId;

    const packageInput = {
      'package_maker_id': userId,
      'recipient_id': recipientId,
    };

    // First we make a package
    return new Package()
    .save(packageInput)
    .then(response => {
      return response.refresh();
    })
    .then( package => {
      // Second we make a encrypted_file using the package id as foreign key
      return new EncryptedFile()
        .save({
          'name': 'Message',
          'aws_url': req.body.message,
          'packages_id': package.attributes.id,
        })
        .then(response => {
          return response.refresh();
        })
        .then(() => {
          res.json({'message': 'message saved'});
        })
    })
    .catch(err => {
      console.log(err.message);
      return res.status(400).json({ 'error': err.message });
    });
  })

  router.route('/:id/packages/:packageId')
    .get((req, res) => {
      const packageId = req.params.packageId;

      return new Package()
      .query(qb => {
        qb.where({ 'id': packageId })
          .andWhere({'deleted_at': null});
      })
      .fetch({ 'withRelated': ['file'] })
      .then(packages => {
        return res.json(packages);
      })
      .catch(err => {
        return res.status(400).json({ message: err.message });
      });
    })


module.exports = router;