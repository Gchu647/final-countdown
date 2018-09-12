const express = require('express');
const router = express.Router();
const auth = require('./auth');
const profile = require('./profile');

router.use('/', auth);
router.use('/profile', profile);

module.exports = router;