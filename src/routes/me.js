'use strict';

const { Router } = require('express');

const auth = require('../middleware/auth');

const router = Router();

router.get('/', auth, (req, res) => {
  res.status(200).json({
    id: req.user.id,
    email: req.user.email,
  });
});

module.exports = router;
