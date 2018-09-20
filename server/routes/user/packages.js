// These routes manage all packages (i.e., "last messages") of a user:
const express = require('express');
const router = express.Router();
const knex = require('../../db/knex');
const isAuthenticated = require('../../middleware/isAuthenticated');
const Package = require('../../db/models/Package');
const EncryptedFile = require('../../db/models/EncryptedFile');

router
  .route('/:id/packages')
  .get(isAuthenticated, (req, res) => {
    // Fetch all packages of a user:
    const userId = req.params.id;

    return new Package()
      .query(qb => {
        qb.where({ package_maker_id: userId }).andWhere({ deleted_at: null });
      })
      .fetchAll({ withRelated: ['file'] })
      .then(packages => {
        return res.json(packages);
      })
      .catch(err => {
        return res.status(400).json({ message: err.message });
      });
  })
  .post(isAuthenticated, (req, res) => {
    // req.body includes a message:
    const userId = req.params.id;
    // const recipientId = req.body.recipientId;
    console.log('posting package: ', req.body);

    const packageInput = {
      package_maker_id: userId,
      // recipient_id: recipientId
    };

    // First, create a new package:
    return new Package()
      .save(packageInput)
      .then(response => {
        return response.refresh();
      })
      .then(package => {
        // Second, create an encrypted file using the package ID as foreign key:
        return new EncryptedFile()
          .save({
            name: req.body.title? req.body.title : 'Message',
            aws_url: req.body.message ? req.body.message.trim() : null,
            package_id: package.attributes.id
          })
          .then(response => {
            return response.refresh();
          })
          .then(file => {
            res.json({ 'packageId': file.attributes.package_id });
          });
      })
      .catch(err => {
        console.log(err.message);
        return res.status(400).json({ error: err.message });
      });
  });

// -------------------------------------------------------------------------- //

router.route('/:id/packages/:packageId')
  .get(isAuthenticated, (req, res) => {
    // Fetch package by ID:
    const packageId = req.params.packageId;

    return new Package()
      .query(qb => {
        qb.where({ id: packageId }).andWhere({ deleted_at: null });
      })
      .fetch({ withRelated: ['file'] })
      .then(packages => {
        return res.json(packages);
      })
      .catch(err => {
        return res.status(400).json({ message: err.message });
      });
  })
  .put(isAuthenticated, (req, res) => {
    // Edit encrypted file by package ID:
    const packageId = req.params.packageId;

    return new EncryptedFile()
      .where({ package_id: packageId })
      .save(
        {
          aws_url: req.body.message
        },
        { patch: true }
      )
      .then(() => {
        res.json({ message: 'message has being edited' });
      })
      .catch(err => {
        return res.status(400).json({ error: err.message });
      });
  })
  .delete(isAuthenticated, (req, res) => {
    // Flag package with deleted_at
    const userId = req.params.id;
    const packageId = req.params.packageId;

    // flags the trigger input
    return new Package()
      .query(qb => {
        qb.where({ id: packageId }).andWhere({ package_maker_id: userId });
      })
      .save({ deleted_at: knex.fn.now() }, { patch: true })
      .then(response => {
        return response.refresh();
      })
      .then(package => {
        return res.json(package);
      })
      .catch(err => {
        console.log(err.message);
        return res.status(400).json({ error: err.message });
      });
  });

module.exports = router;
