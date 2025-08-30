const express = require('express');
const router = express.Router();

router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email' });
    }
    // TODO: Save email to MongoDB or email service (e.g., Mailchimp)
    res.json({ message: 'Subscribed successfully' });
  } catch (err) {
    console.error('Newsletter error:', err);
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

module.exports = router;