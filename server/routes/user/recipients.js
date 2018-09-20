const express = require('express');
const router = express.Router();
const knex = require('../../db/knex');
const isAuthenticated = require('../../middleware/isAuthenticated');
const Recipient = require('../../db/models/Recipient');

router.route('/:id/recipients')
  .get(isAuthenticated, (req, res) => {
    // fetchs all recipients from a user
    const userId = req.params.id;

    return new Recipient()
      .query(qb => {
        qb.where({ sender_id: userId }).andWhere({ deleted_at: null });
      })
      .fetchAll({ withRelated: ['package.file'] })
      .then(recipients => {
        return res.json(recipients);
      })
      .catch(err => {
        return res.status(400).json({ message: err.message });
      });
  })
  .post(isAuthenticated, (req, res) => {
    const userId = req.params.id;
    // Initailize recipient info
    const recipientInput = {
      email: req.body.email ? req.body.email.trim() : null,
      f_name: req.body.firstName ? req.body.firstName.trim() : null,
      l_name: req.body.lastName ? req.body.lastName.trim() : null,
      phone_num: req.body.phoneNumber ? req.body.phoneNumber.trim() : null,
      sender_id: Number(userId),
      package_id: req.body.packageId,
      group_id: req.body.groupId,
    };

    console.log('post new recipient', recipientInput);

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
        return res.status(400).json({ error: err.message });
      });
  });

router.route('/:id/recipients/:recipientId')
  .get(isAuthenticated, (req, res) => {
    // fetches one recipient of a user
    const userId = req.params.id;
    const recipientId = req.params.recipientId;

    return new Recipient()
      .query(qb => {
        qb.where({ id: recipientId })
          .andWhere({ sender_id: userId })
          .andWhere({ deleted_at: null });
      })
      .fetch()
      .then(recipient => {
        console.log('Getting a recipient: ', recipient.attributes);

        const recipientResponse = {
          id: recipient.attributes.id,
          email: recipient.attributes.email,
          firstName: recipient.attributes.f_name,
          lastName: recipient.attributes.l_name,
          phoneNumber: recipient.attributes.phone_num,
          packageId: recipient.attributes.package_id,
          groupId: recipient.attributes.group_id
        };

        return res.json(recipientResponse);
      })
      .catch(err => {
        return res.status(400).json({ message: err.message });
      });
  })
  .put(isAuthenticated, (req, res) => {
    // edit recipient's info
    const userId = req.params.id;
    const recipientId = req.params.recipientId;
    // Initailize edited info
    const recipientInput = {
      email: req.body.email ? req.body.email.trim() : null,
      f_name: req.body.firstName ? req.body.firstName.trim() : null,
      l_name: req.body.lastName ? req.body.lastName.trim() : null,
      phone_num: req.body.phoneNumber ? req.body.phoneNumber.trim() : null,
      sender_id: Number(userId),
      package_id: req.body.packageId ? req.body.packageId : null,
      group_id: req.body.groupId ? req.body.groupId : null
    };

    // Edit using bookshelf
    return new Recipient()
      .query(qb => {
        qb.where({ id: recipientId })
          .andWhere({ sender_id: userId })
          .andWhere({ deleted_at: null });
      })
      .save(recipientInput, { patch: true })
      .then(response => {
        return response.refresh();
      })
      .then(recipient => {
        return res.json(recipient);
      })
      .catch(err => {
        console.log(err.message);
        return res.status(400).json({ error: err.message });
      });
  })
  .delete(isAuthenticated, (req, res) => {
    const userId = req.params.id;
    const recipientId = req.params.recipientId;

    // flags the trigger input
    return new Recipient()
      .query(qb => {
        qb.where({ id: recipientId }).andWhere({ sender_id: userId });
      })
      .save({ deleted_at: knex.fn.now() }, { patch: true })
      .then(response => {
        return response.refresh();
      })
      .then(recipient => {
        return res.json({ message: 'recipient deleted' });
      })
      .catch(err => {
        return res.status(400).json({ error: err.message });
      });
  });

router.route('/:id/recipients/:recipientId/package')
  .get(isAuthenticated, (req, res) => {
    const userId = req.params.id;
    const recipientId = req.params.recipientId;

    return new Recipient()
      .query(qb => {
        qb.where({ id: recipientId })
          .andWhere({ sender_id: userId })
          .andWhere({ deleted_at: null });
      })
      .fetch({ withRelated: ['package.file'] })
      .then(recipient => {
        return res.json(recipient);
      })
      .catch(err => {
        return res.status(400).json({ message: err.message });
      });
  });

module.exports = router;
