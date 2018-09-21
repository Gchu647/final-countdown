// These routes manage all packages (i.e., "last messages") of a user:
const express = require('express');
const router = express.Router();
const knex = require('../../db/knex');
const isAuthenticated = require('../../middleware/isAuthenticated');
const Package = require('../../db/models/Package');
const User = require('../../db/models/User');
const EncryptedFile = require('../../db/models/EncryptedFile');
// Encryption & Decrypt functions
const encryptStr = require('../../deathwatch/encrypt');
const decryptStr = require('../../deathwatch/decrypt');

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
    // req.body includes a message and a title:
    const userId = req.params.id;
    let packageId;

    // First, create a new package:
    return new Package()
      .save({ package_maker_id: userId })
      .then(response => {
        return response.refresh();
      })
      .then(package => {
        // Second, we are fetching the hashed password to encrypt the message
        packageId = package.attributes.id;

        return new User()
          .where({ id: userId })
          .fetch()
          .then(user => {
            return user.attributes.password;
          });
      })
      .then(userPass => {
        // Third, create an encrypted file using the package ID as foreign key:
        // trims down the req.body message or set it to null
        const message = req.body.message ? req.body.message.trim() : null;
        let encryptedMessage = null;

        // if message is not falsy, encrypt it
        if (message) {
          encryptedMessage =encryptStr(message, userPass);
        }

        return new EncryptedFile()
          .save({
            name: req.body.title ? req.body.title : 'Message',
            aws_url: encryptedMessage,
            package_id: packageId
          })
          .then(response => {
            return response.refresh();
          })
          .then(file => {
            return new Package({ id: packageId })
              .save({ file_id: file.attributes.id }, { patch: true })
          })
          .then(() => {
            res.json({ packageId });
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
    const userId = req.params.id;
    const packageId = req.params.packageId;
    let messageTitle;
    let encryptedMessage;
    let decryptedMessage;

    return new Package()
      .query(qb => {
        qb.where({ id: packageId }).andWhere({ deleted_at: null });
      })
      .fetch({ withRelated: ['file'] })
      .then(packages => {
        // Stores the encrypted message and title from db
        encryptedMessage = packages.toJSON().file[0].aws_url;
        messageTitle = packages.toJSON().file[0].name;

        // Gets user password for decryption
        return new User()
          .where({ id: userId })
          .fetch()
          .then(user => {
            return user.attributes.password;
          });
      })
      .then(userPass => {
        // Sends back a decrypted message
        decryptedMessage = decryptStr(encryptedMessage, userPass);

        const messageData = {
          title: messageTitle,
          message: decryptedMessage
        };

        res.json(messageData);
      })
      .catch(err => {
        return res.status(400).json({ message: err.message });
      });
  })
  .put(isAuthenticated, (req, res) => {
    // Edit encrypted file by package ID:
    const userId = req.params.id;
    const packageId = req.params.packageId;

    return new User()
      .where({ id: userId })
      .fetch()
      .then(user => {
        return user.attributes.password;
      })
      .then(userPass => {
        // Using userPass to encrypt message
        const message = req.body.message ? req.body.message.trim() : null;
        let encryptedMessage = null;

        // if message is not falsy, encrypt it
        if (message) {
          encryptedMessage = encryptStr(message, userPass);
        }

        // Save file with encrypted message
        return new EncryptedFile().where({ package_id: packageId }).save(
          {
            name: req.body.title,
            aws_url: encryptedMessage
          },
          { patch: true }
        );
      })
      .then(() => {
        res.json({ message: 'message has being edited' });
      })
      .catch(err => {
        return res.status(400).json({ error: err.message });
      });
  })
  .delete(isAuthenticated, (req, res) => {
    // Flag package with deleted_at:
    const userId = req.params.id;
    const packageId = req.params.packageId;

    // Flags the trigger input:
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
