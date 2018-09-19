const express = require('express');
const router = express.Router();
const auth = require('./auth');
const user = require('./user');
const relationships = require('./relationships');
const countries = require('./countries');
const states = require('./states');

router.use('/', auth);
router.use('/', user);
router.use('/relationships', relationships);
router.use('/countries', countries);
router.use('/states', states);

module.exports = router;