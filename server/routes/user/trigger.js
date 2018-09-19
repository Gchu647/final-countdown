// This route allows a user to activate/deactivate the user's countdown trigger:
const express = require('express');
const router = express.Router();

const isAuthenticated = require('../../middleware/isAuthenticated');
const Trigger = require('../../db/models/Trigger');

router.route('/:id/trigger')
  .get(isAuthenticated, (req, res) => {
    const userId = req.params.id;
    const origin = req.query.origin;
    let queryTarget = {};

    // Front-end req targets "pending_notification",
    // while back-end req targets "countdown":
    queryTarget = origin === 'frontEnd'
        ? { pending_notification: false }
        : { countdown: null };

    return new Trigger()
      .query(qb => {
        qb.whereNot(queryTarget).andWhere({ user_id: userId });
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
    time.setSeconds(time.getSeconds() + countdownDays * 0.864);

    const triggerInput = {
      user_id: userId ? userId.trim() : null,
      countdown: time.toUTCString(),
      active: true,
      pending_notification: true
    };

    // Check if all old triggers are deleted before creating a new one:
    new Trigger()
      .query(qb => {
        // Check if all old triggers are deleted:
        qb.where({ user_id: userId });
      })
      .orderBy('id', 'DESC')
      .fetch()
      .then(trigger => {
        if (
          trigger.attributes.countdown &&
          trigger.attributes.pending_notification
        ) {
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
    const origin = req.query.origin;
    const manualDeactivation = req.query.manualDeactivation;
    let queryTarget;
    let columnsToModify;

    // Front-end req targets "pending_notification",
    // while back-end req targets "countdown":
    queryTarget = origin === 'frontEnd'
        ? { pending_notification: false }
        : { countdown: null };

    // Front-end req only removes countdown value if user manually deactivates
    // the countdown.  This is necessary to ensure that the DEATHWATCH protocol
    // is able to (1) retrieve triggers from the database based upon each
    // trigger's countdown value, and (2) determine which messages remain unsent
    // for those countdowns that have expired naturally (rather than having been
    // canceled).  After successfully sending a user's messages, then the
    // DEATHWATCH protocol will set the countdown value to "null":
    columnsToModify = (origin === 'frontEnd' && manualDeactivation === 'true')
        ? { countdown: null, active: false, pending_notification: false }
        : { active: false };

    // Flag active trigger as being "deleted":
    return new Trigger()
      .query(qb => {
        qb.whereNot(queryTarget).andWhere({ user_id: userId });
      })
      .save(columnsToModify, { patch: true })
      .then(trigger => {
        return res.json(trigger);
      })
      .catch(err => {
        return res.status(400).json({ error: err.message });
      });
  });

router.route('/:id/trigger/acknowledge')
  .put(isAuthenticated, (req, res) => {
    const userId = req.params.id;

    return new Trigger()
      .query(qb => {
        qb.where({ user_id: userId }).andWhere({ pending_notification: true })
      })
      .save({ pending_notification: false }, { patch: true })
      .then(trigger => {
        return res.json(trigger);
      })
      .catch(err => {
        return res.status(400).json({ error: err.message });
      });
  });

module.exports = router;
