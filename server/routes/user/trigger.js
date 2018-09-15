// This routes lets user post a trigger or flags a trigger
const express = require('express');
const router = express.Router();
const isAuthenticated = require('../../middleware/isAuthenticated');
const Trigger = require('../../db/models/Trigger');

// Posting and flagging user triggers
router.route('/:id/trigger')
  .post(isAuthenticated, (req, res) => {
    const userId = req.params.id;
    const customTimer = req.body.customTimer; // Currently in seconds
    let time = new Date();

    // set time with customerTimer or default
    if(customTimer) {
      time.setSeconds(time.getSeconds() + customTimer);
    } else {
      time.setSeconds(time.getSeconds() + 604800); // 7 days
    }

    let triggerInput = {
      user_id: userId ? userId.trim() : null,
      countdown: time.toUTCString(),
    }

    // Checks if all old triggers are deleted before creating a new one
    new Trigger()
    .query(qb => { // First check if all old triggers are deleted
      qb.whereNot({ countdown: null })
        .andWhere({ user_id: userId });
    })
    .fetch()
    .then( trigger => {
      if(trigger !== null) {
        throw new Error('You already set up a trigger!');
      } else {
        // Save trigger if all old triggers are deleted
        return new Trigger()
        .save(triggerInput)
        .then(trigger => {
          return res.json(trigger);
        })
      }
    })
    .catch(err => {
      return res.status(400).json({ error: err.message});
    });

  })
  .delete(isAuthenticated, (req, res) => {
   const userId = req.params.id;;

    // flags the trigger input
    return new Trigger()
    .where({'user_id': userId})
    .save({
      countdown: null
    }, { patch: true })
    .then(trigger => {
      return res.json(trigger);
    })
    .catch(err => {
      return res.status(400).json({ error: err.message });
    });

  })

module.exports = router;