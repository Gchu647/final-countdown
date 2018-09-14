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


module.exports = router;