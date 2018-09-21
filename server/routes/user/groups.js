const express = require('express');
const router = express.Router();

const isAuthenticated = require('../../middleware/isAuthenticated');
const Group = require('../../db/models/Group');
const User = require('../../db/models/User');

// Decryption file
const decryptStr = require('../../deathwatch/decrypt');

router.route('/:id/groups')
  .get(isAuthenticated, (req, res) => {
    // Fetches all groups from a user:
    const userId = req.params.id;

    return new Group()
      .query(qb => {
        qb.where({ owner_id: userId });
      })
      .fetchAll({ withRelated: ['relationship'] })
      .then(groups => {
        return res.json(groups);
      })
      .catch(err => {
        return res.status(400).json({ message: err.message });
      });
  })
  .post(isAuthenticated, (req, res) => {
    // Posts a new group from user:
    const userId = req.params.id;

    return new Group()
      .save({
        relationship_id: Number(req.body.relationshipId),
        package_id: Number(req.body.packageId),
        owner_id: userId
      })
      .then(groups => {
        return res.json(groups);
      })
      .catch(err => {
        return res.status(400).json({ message: err.message });
      });
  });

router.route('/:id/groups/:groupId').get(isAuthenticated, (req, res) => {
  // Fetches a single user group:
  const userId = req.params.id;
  const groupId = req.params.groupId;

  return new Group()
    .query(qb => {
      qb.where({ id: groupId }).andWhere({ owner_id: userId });
    })
    .fetch({ withRelated: ['relationship'] })
    .then(group => {
      return res.json(group);
    })
    .catch(err => {
      return res.status(400).json({ message: err.message });
    });
});

router.route('/:id/groups/:groupId/members')
  .get(isAuthenticated, (req, res) => {
    // Fetches a single user group and its members:
    const userId = req.params.id;
    const groupId = req.params.groupId;

    return new Group()
      .query(qb => {
        qb.where({ id: groupId }).andWhere({ owner_id: userId });
      })
      .fetch({
        withRelated: [
          'relationship',
          {
            members: qb => {
              qb.where({ sender_id: userId });
            }
          }
        ]
      })
      .then(group => {
        return res.json(group);
      })
      .catch(err => {
        return res.status(400).json({ message: err.message });
      });
  });

router.route('/:id/groups/:groupId/package')
  .get(isAuthenticated, (req, res) => {
    // Fetches a single user group, its members, and its package file:
    const userId = req.params.id;
    const groupId = req.params.groupId;
    let packageId;
    let messageTitle;
    let encryptedMessage;
    let decryptedMessage;

    return new Group()
      .query(qb => {
        qb.where({ id: groupId }).andWhere({ owner_id: userId });
      })
      .fetch({
        withRelated: [
          'relationship',
          {
            members: qb => {
              qb.where({ sender_id: userId });
            }
          },
          'package.file'
        ]
      })
      .then(group => {
        encryptedMessage = group.toJSON().package.file[0].aws_url;
        messageTitle = group.toJSON().package.file[0].name;
        packageId = group.toJSON().package.id;
        // Gets user password for decryption
        return new User()
          .where({ 'id': userId })
          .fetch()
          .then(user => {
            return  user.attributes.password
          });
      })
      .then(userPass => {
        // Sends back a decrypted message
        decryptedMessage = decryptStr(encryptedMessage, userPass)

        const messageData = {
          packageId: packageId,
          title: messageTitle,
          message: decryptedMessage
        }

        return res.json(messageData);
      })
      .catch(err => {
        return res.status(400).json({ message: err.message });
      });
  });

module.exports = router;
