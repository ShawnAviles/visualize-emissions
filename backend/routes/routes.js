const express = require('express');
const router = express.Router();

router.route('/')
  .post((req, res) => {
    res.send('Returning large routes data from JSON file');
  });

module.exports = router;