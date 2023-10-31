const express = require('express');
const router = express.Router();

router.route('/')
  .get((req, res) => {
    res.status(200).send('Server is healthy');
    console.log('Server is healthy');
  });

module.exports = router;