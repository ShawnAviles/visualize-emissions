const express = require('express');
const router = express.Router();
const { getRoutes } = require('../controllers/requestController');

router.route('/')
  .post(async (req, res) => {
    const zipCodes = req.body;
    const output = await getRoutes(zipCodes);
    res.send({
      response: 'SUCCESS',
      data: output
    });
    console.log('Returning large routes data from JSON file: ', output);
  });

module.exports = router;