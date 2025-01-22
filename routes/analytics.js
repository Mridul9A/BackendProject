const express = require('express');
const Analytics = require('../models/Analytics');
const router = express.Router();

router.get('/:shortUrlId', async (req, res) => {
  try {
    const analytics = await Analytics.findOne({ shortUrlId: req.params.shortUrlId });
    res.status(200).json(analytics || { clicks: [] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

module.exports = router;
