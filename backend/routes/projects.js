const express = require('express');
const Project = require('../models/Project');
const router = express.Router();

router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Query required' });
    // TODO: Search projects in MongoDB
    const projects = await Project.find({ title: { $regex: q, $options: 'i' } });
    res.json(projects);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Failed to search' });
  }
});

module.exports = router;