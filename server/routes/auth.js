const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../db/models/User');

router.get('/login', (req, res) => {
  res.send('auth.js smoke test!');
})

module.exports = router;