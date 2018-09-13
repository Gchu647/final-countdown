const express = require('express');
const router = express.Router();
const auth = require('./auth');
const user = require('./user');
const relationships = require('./relationships');

router.use('/', auth);
router.use('/user', user);
router.use('/relationships', relationships);

module.exports = router;