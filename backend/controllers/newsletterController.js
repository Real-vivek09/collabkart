// Subscribe to newsletter with simple email validation
exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email' });
    }

    // TODO: Save the email to DB or mailing service (e.g., Mailchimp)
    res.json({ message: 'Subscribed successfully' });
  } catch (err) {
    console.error('Newsletter subscribe error:', err);
    res.status(500).json({ error: 'Failed to subscribe' });
  }
};
