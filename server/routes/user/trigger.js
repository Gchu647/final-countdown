// This route allows a user to activate/deactivate the user's countdown trigger:
const express = require('express');
const router = express.Router();

const isAuthenticated = require('../../middleware/isAuthenticated');
const Trigger = require('../../db/models/Trigger');

router.route('/:id/trigger')
  .get(isAuthenticated, (req, res) => {
    const userId = req.params.id;

    return new Trigger()
      .query(qb => {
        qb.whereNot({ countdown: null }).andWhere({ user_id: userId });
      })
      .fetch()
      .then(trigger => {
        return res.json(trigger);
      })
      .catch(err => {
        return res.status(400).json({ error: err.message });
      });
  })
  .post(isAuthenticated, (req, res) => {
    const userId = req.query.id;
    const countdownDays = Number(req.query.countdownDays);
    const time = new Date();

    // 86,400 seconds in a day (LOWER THIS VALUE WHEN TESTING):
    time.setSeconds(time.getSeconds() + (countdownDays * .86400));

    const triggerInput = {
      user_id: userId ? userId.trim() : null,
      countdown: time.toUTCString()
    };

    // Check if all old triggers are deleted before creating a new one:
    new Trigger()
      .query(qb => {
        // Check if all old triggers are deleted:
        qb.whereNot({ countdown: null }).andWhere({ user_id: userId });
      })
      .fetch()
      .then(trigger => {
        if (trigger !== null) {
          throw new Error('You already set up a trigger!');
        } else {
          // Save trigger if all old triggers are deleted:
          return new Trigger().save(triggerInput).then(trigger => {
            return res.json(trigger);
          });
        }
      })
      .catch(err => {
        return res.status(400).json({ error: err.message });
      });
  })
  .delete(isAuthenticated, (req, res) => {
    const userId = req.params.id;

    // Flag active trigger as being "deleted":
    return new Trigger()
      .query(qb => {
        qb.whereNot({ countdown: null }).andWhere({ user_id: userId });
      })
      .save(
        {
          countdown: null
        },
        { patch: true }
      )
      .then(trigger => {
        return res.json(trigger);
      })
      .catch(err => {
        return res.status(400).json({ error: err.message });
      });
  });

module.exports = router;
