const express = require('express');
const ShortURL = require('../models/ShortURL');
const Analytics = require('../models/Analytics');
const router = express.Router();

router.post('/', async (req, res) => {
  const { longUrl, userId, topic } = req.body;
  const shortCode = Math.random().toString(36).substring(2, 8);

  try {
    const newShortURL = await ShortURL.create({ longUrl, shortCode, userId, topic });
    res.status(201).json(newShortURL);
  } catch (err) {
    res.status(500).json({ error: 'Failed to shorten URL' });
  }
});

router.get('/:shortCode', async (req, res) => {
  const { shortCode } = req.params;

  try {
    const shortUrl = await ShortURL.findOne({ shortCode });
    if (!shortUrl) return res.status(404).json({ error: 'URL not found' });

    await Analytics.findOneAndUpdate(
      { shortUrlId: shortUrl._id },
      { $push: { clicks: { userAgent: req.headers['user-agent'], ipAddress: req.ip } } },
      { upsert: true }
    );

    res.redirect(shortUrl.longUrl);
  } catch (err) {
    res.status(500).json({ error: 'Failed to redirect' });
  }
});

module.exports = router;
