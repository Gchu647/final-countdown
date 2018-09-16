const express = require('express');
const router = express.Router();
const Relationships = require('../db/models/Relationships');

router.get('/', (req, res) => {
  console.log('server getting relationships');
  
  return Relationships
    .fetchAll()
    .then(relationships => {
      res.json(relationships);
    })
    .catch(err => {
      res.status(400).json({ message: err.message });
    });
})

module.exports = router;