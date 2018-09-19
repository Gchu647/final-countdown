const express = require('express');
const router = express.Router();
const knex = require('../../db/knex');
const isAuthenticated = require('../../middleware/isAuthenticated');
const Group = require('../../db/models/Group');

router.route('/:id/groups').get(isAuthenticated, (req, res) => {
  // Fetchs all groups from a user:
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

    return new Group()
      .query(qb => {
        qb.where({ id: groupId }).andWhere({ owner_id: userId });
      })
      .fetch({
        withRelated: [ 'relationship',
          {
            members: qb => {
              qb.where({ sender_id: userId });
            }
          },
          'package.file'
        ]
      })
      .then(group => {
        return res.json(group);
      })
      .catch(err => {
        return res.status(400).json({ message: err.message });
      });
  });

module.exports = router;
