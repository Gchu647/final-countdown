// This routes lets user post a trigger or flags a trigger
const express = require('express');
const router = express.Router();
const Trigger = require('../../db/models/Trigger');

router.route('/')
  .post((req, res) => {
    const userId = req.body.id;
    console.log(req.body);

    return new Trigger()
    .where({'user_id': userId})
    .fetch()
    .then(trigger => {
      console.log('trigger', trigger);
      return res.json(trigger);
    })
    .catch(err => {
      return res.json({ error: err.message });
    });
  })

module.exports = router;